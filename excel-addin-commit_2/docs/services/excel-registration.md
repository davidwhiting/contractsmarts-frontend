# Excel File Registration Module

This module provides functionality for registering and managing Excel files within the ContractSmarts Office Add-in. It enables unique identification and metadata tracking of Excel files by storing a UUID and associated metadata within the Excel file itself.

## Features

- Generate and store unique identifiers (UUIDs) for Excel files
- Store and retrieve metadata in a persistent way
- Handle file registration status
- Update file metadata
- Proper XML parsing and validation
- Robust error handling

## Installation

1. Install required dependencies:

```bash
npm install uuid
npm install --save-dev @types/uuid
```

2. Import the module:

```typescript
import { ExcelFileRegistration } from './path/to/ExcelFileRegistration';
```

## Usage

### Registering a New File

When a user wants to register their Excel file with ContractSmarts:

```typescript
try {
  const metadata = await ExcelFileRegistration.registerFile();
  console.log('File registered successfully:', metadata);
  // metadata = {
  //   uuid: "123e4567-e89b-12d3-a456-426614174000",
  //   registrationDate: "2025-01-18T10:30:00.000Z",
  //   lastModified: "2025-01-18T10:30:00.000Z",
  //   version: "1.0"
  // }
} catch (error) {
  if (error.message.includes('already registered')) {
    // Handle already registered case
  } else {
    // Handle other errors
  }
}
```

### Checking if a File is Registered

To check if a file has existing metadata:

```typescript
try {
  const metadata = await ExcelFileRegistration.getFileMetadata();
  if (metadata) {
    console.log('File is registered:', metadata);
  } else {
    console.log('File is not registered');
  }
} catch (error) {
  console.error('Error checking file registration:', error);
}
```

### Updating File Metadata

To update metadata for a registered file:

```typescript
try {
  const updatedMetadata = await ExcelFileRegistration.updateFileMetadata({
    version: '1.1'
    // Add any other fields you want to update
  });
  console.log('Metadata updated:', updatedMetadata);
} catch (error) {
  console.error('Error updating metadata:', error);
}
```

## How It Works

The module uses two mechanisms to store file metadata:

1. **Custom Document Properties**
   - Stores the UUID for quick access and identification
   - Easily accessible through Office.js API
   - Survives file saves and reopens

2. **CustomXML Parts**
   - Stores the complete metadata in XML format
   - Provides structured data storage
   - Supports complex metadata schemas
   - Protected from accidental user modification

### Metadata Structure

The metadata is stored in the following format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<contractsmarts:metadata 
  xmlns:contractsmarts="http://www.contractsmarts.ai/metadata"
  version="1.0">
  <uuid>123e4567-e89b-12d3-a456-426614174000</uuid>
  <registrationDate>2025-01-18T10:30:00.000Z</registrationDate>
  <lastModified>2025-01-18T10:30:00.000Z</lastModified>
</contractsmarts:metadata>
```

## Error Handling

The module includes comprehensive error handling:

- Checks for existing registration before registering
- Validates XML structure and content
- Verifies UUID consistency
- Provides detailed error messages
- Wraps Office.js errors with additional context

Example error handling:

```typescript
try {
  await ExcelFileRegistration.registerFile();
} catch (error) {
  switch (true) {
    case error.message.includes('already registered'):
      console.error('This file is already registered');
      break;
    case error.message.includes('XML Parse Error'):
      console.error('Invalid metadata structure');
      break;
    default:
      console.error('Unexpected error:', error);
  }
}
```

## Best Practices

1. Always handle errors appropriately
2. Check file registration status before performing operations
3. Maintain metadata consistency with your backend database
4. Update the `lastModified` timestamp when making changes
5. Verify UUID consistency when updating metadata

## Integration with Backend

When using this module with your backend system:

1. Use the UUID as the primary key in your database
2. Store additional metadata that shouldn't be in the file
3. Implement version control if needed
4. Handle synchronization between file metadata and database

Example backend integration:

```typescript
async function registerFileWithBackend() {
  try {
    // Register file locally
    const metadata = await ExcelFileRegistration.registerFile();
    
    // Send to backend
    const response = await fetch('https://api.contractsmarts.ai/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: metadata.uuid,
        registrationDate: metadata.registrationDate,
        // Additional metadata...
      }),
    });
    
    if (!response.ok) {
      throw new Error('Backend registration failed');
    }
    
    return metadata;
  } catch (error) {
    // Handle errors
  }
}
```

## Limitations

- Requires Office.js API support
- Metadata must be serializable to XML
- Custom document properties are visible to users
- Maximum size limitations for CustomXML parts

## Contributing

If you find any issues or have suggestions for improvements, please submit an issue or pull request to the ContractSmarts repository.

## License

[Your license information here]
