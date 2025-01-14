# OCI Bucket Upload Script

A Python script for uploading web application files to Oracle Cloud Infrastructure (OCI) Object Storage buckets while preserving directory structure and setting correct content types.

## Features

- Preserves directory structure when uploading
- Automatically sets correct Content-Type headers for web files
- Supports parallel uploads for better performance
- Handles common web development file types:
  - JavaScript (.js, .jsx, .tsx)
  - CSS
  - HTML
  - Images (png, jpg, svg)
  - Source maps
  - Web fonts
  - XML files
  - License files
- Provides detailed logging
- Command-line interface with configurable options

## Prerequisites

1. Python 3.6 or higher
2. OCI SDK for Python:
```bash
pip install oci
```

3. Configured OCI credentials (~/.oci/config)
   - If you haven't set up your OCI credentials, follow the [OCI SDK Setup Guide](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm)

## Installation

1. Download both script files:
   - `oci_upload.py`
   - `requirements.txt`

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Upload a directory to your bucket:
```bash
python oci_upload.py \
    --bucket your-bucket-name \
    --local-dir ./dist \
    --bucket-prefix v1.0.0
```

### Common Scenarios

1. Upload a production build:
```bash
# First build your project
npm run build

# Then upload the dist directory
python oci_upload.py \
    --bucket your-bucket-name \
    --local-dir ./dist \
    --bucket-prefix prod/v1.0.0
```

2. Upload with a different configuration profile:
```bash
python oci_upload.py \
    --bucket your-bucket-name \
    --local-dir ./dist \
    --bucket-prefix v1.0.0 \
    --profile custom-profile
```

3. Upload with custom parallelism:
```bash
python oci_upload.py \
    --bucket your-bucket-name \
    --local-dir ./dist \
    --bucket-prefix v1.0.0 \
    --max-workers 10
```

### Command Line Options

```
--bucket         Required. Name of the OCI bucket
--local-dir      Required. Local directory to upload
--bucket-prefix  Required. Prefix in the bucket (e.g., v1.0.0)
--config-file    Optional. Path to OCI config file
--profile        Optional. OCI config profile name
--max-workers    Optional. Maximum number of parallel uploads (default: 5)
```

## Example Directory Structure

The script handles complex directory structures like:

```
upload/v1.0.0/
├── assets/
│   ├── images/
│   │   ├── icon-128.png
│   │   ├── icon-16.png
│   │   └── ...
├── styles/
│   ├── main.css
│   └── ...
├── js/
│   ├── app.js
│   ├── app.js.map
│   └── ...
├── index.html
└── manifest.xml
```

The directory structure will be preserved in the bucket:

```
bucket/v1.0.0/assets/images/icon-128.png
bucket/v1.0.0/assets/images/icon-16.png
bucket/v1.0.0/styles/main.css
bucket/v1.0.0/js/app.js
bucket/v1.0.0/js/app.js.map
bucket/v1.0.0/index.html
bucket/v1.0.0/manifest.xml
```

## Content Types

The script automatically sets appropriate Content-Type headers for common web files:

| File Extension | Content-Type |
|---------------|--------------|
| .html | text/html |
| .css | text/css |
| .js | application/javascript |
| .jsx, .tsx | application/javascript |
| .json | application/json |
| .png | image/png |
| .jpg, .jpeg | image/jpeg |
| .svg | image/svg+xml |
| .xml | application/xml |
| .map | application/json |
| .woff | font/woff |
| .woff2 | font/woff2 |
| .ttf | font/ttf |
| .eot | application/vnd.ms-fontobject |

## Error Handling

The script provides detailed error logging:
- Failed uploads are reported individually
- Summary of successful and failed uploads is provided
- Exit code 0 if all uploads succeed, 1 if any fail

## Using with CI/CD

Example GitHub Actions workflow:

```yaml
name: Deploy to OCI

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'
          
      - name: Install dependencies
        run: |
          pip install oci
          
      - name: Build application
        run: |
          npm install
          npm run build
          
      - name: Configure OCI credentials
        run: |
          mkdir -p ~/.oci
          echo "${{ secrets.OCI_CONFIG }}" > ~/.oci/config
          echo "${{ secrets.OCI_KEY }}" > ~/.oci/key.pem
          chmod 600 ~/.oci/config ~/.oci/key.pem
          
      - name: Upload to OCI bucket
        run: |
          python oci_upload.py \
            --bucket ${{ secrets.OCI_BUCKET }} \
            --local-dir ./dist \
            --bucket-prefix ${GITHUB_REF#refs/tags/}
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use and modify as needed.