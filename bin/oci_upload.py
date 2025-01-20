import oci
import mimetypes
import os
from pathlib import Path
import argparse
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class OCIUploader:
    def __init__(self, config_file=None, profile_name=None):
        """Initialize OCI client with optional config file and profile."""
        try:
            self.config = oci.config.from_file(config_file, profile_name) if config_file else oci.config.from_file()
            self.object_storage = oci.object_storage.ObjectStorageClient(self.config)
            self.namespace = self.object_storage.get_namespace().data
            
            # Initialize mimetypes
            mimetypes.init()
            # Add additional mime types not in the standard library
            self._add_custom_mime_types()
            
        except Exception as e:
            logger.error(f"Failed to initialize OCI client: {str(e)}")
            raise

    def _add_custom_mime_types(self):
        """Add additional mime types specific to web development."""
        additional_types = {
            '.js': 'application/javascript',
            '.js.map': 'application/json',
            '.jsx': 'application/javascript',
            '.tsx': 'application/javascript',
            '.ts': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.xml': 'application/xml',
            '.svg': 'image/svg+xml',
            '.json': 'application/json',
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.LICENSE.txt': 'text/plain',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
        }
        for ext, mime_type in additional_types.items():
            mimetypes.add_type(mime_type, ext)

    def get_content_type(self, filepath):
        """Determine content type based on file extension."""
        content_type, _ = mimetypes.guess_type(filepath)
        if content_type is None:
            # Handle special cases
            if filepath.endswith('.js.map'):
                return 'application/json'
            if filepath.endswith('.LICENSE.txt'):
                return 'text/plain'
            # Default to octet-stream if type cannot be determined
            return 'application/octet-stream'
        return content_type

    def upload_file(self, bucket_name, local_path, object_name):
        """Upload a single file to OCI bucket."""
        try:
            content_type = self.get_content_type(local_path)
            
            with open(local_path, 'rb') as f:
                self.object_storage.put_object(
                    namespace_name=self.namespace,
                    bucket_name=bucket_name,
                    object_name=object_name,
                    put_object_body=f,
                    content_type=content_type
                )
            logger.info(f"Successfully uploaded {local_path} as {object_name} [{content_type}]")
            return True
        except Exception as e:
            logger.error(f"Failed to upload {local_path}: {str(e)}")
            return False

    def upload_directory(self, bucket_name, local_dir, bucket_prefix, max_workers=5):
        """Upload an entire directory to OCI bucket with parallel processing."""
        local_dir_path = Path(local_dir)
        if not local_dir_path.exists():
            logger.error(f"Local directory {local_dir} does not exist")
            return False

        # Collect all files to upload
        files_to_upload = []
        for root, _, files in os.walk(local_dir):
            for file in files:
                local_path = Path(root) / file
                relative_path = local_path.relative_to(local_dir_path)
                object_name = str(Path(bucket_prefix) / relative_path)
                files_to_upload.append((str(local_path), object_name))

        # Upload files in parallel
        successful_uploads = 0
        failed_uploads = 0
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {
                executor.submit(self.upload_file, bucket_name, local_path, object_name): (local_path, object_name)
                for local_path, object_name in files_to_upload
            }
            
            for future in as_completed(future_to_file):
                local_path, object_name = future_to_file[future]
                try:
                    if future.result():
                        successful_uploads += 1
                    else:
                        failed_uploads += 1
                except Exception as e:
                    logger.error(f"Error uploading {local_path}: {str(e)}")
                    failed_uploads += 1

        logger.info(f"Upload complete. Successful: {successful_uploads}, Failed: {failed_uploads}")
        return failed_uploads == 0

def main():
    parser = argparse.ArgumentParser(description='Upload files to OCI bucket')
    parser.add_argument('--bucket', required=True, help='Name of the OCI bucket')
    parser.add_argument('--local-dir', required=True, help='Local directory to upload')
    parser.add_argument('--bucket-prefix', required=True, help='Prefix in the bucket (e.g., v0.1.0)')
    parser.add_argument('--config-file', help='Path to OCI config file')
    parser.add_argument('--profile', help='OCI config profile name')
    parser.add_argument('--max-workers', type=int, default=5, help='Maximum number of parallel uploads')
    
    args = parser.parse_args()
    
    try:
        uploader = OCIUploader(args.config_file, args.profile)
        success = uploader.upload_directory(
            args.bucket,
            args.local_dir,
            args.bucket_prefix,
            args.max_workers
        )
        exit(0 if success else 1)
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        exit(1)

if __name__ == '__main__':
    main()
