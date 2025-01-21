# ContractSmarts Frontend Code
## Table of Contents
- [Introduction](#introduction)
- [Excel Functionality](#excel-functionality)
    - [Excel File Registration](#excel-file-registration)
- [API](#api)

## Introduction
This contains the code for an Excel add-in frontend for the ContractSmarts application.

## Excel Functionality
These names I am using are arbitrary and will be updated as we decide what they should be called.

### Excel File Registration

"Registration" is the process in which we assign a UUID to a specific Excel xlsx file. We need this functionality so our programs can recognize files and build history and file-specific templates.

More details and example usage can be found in the documentation `docs/services/excel-registration.md`.

#### Design Choices
There are several options for storing Excel file metadata, including:

1. **Custom Document Properties**:

    - Excel files support custom document properties that persist with the file
    - These are ideal for storing metadata like UUIDs
    - They're accessible through the `Office.js` API
    - They survive file saves and reopens

2. **CustomXML**:

    - XML data that can be stored within the Excel file
    - Very robust and flexible
    - Survives file saves
    - Less likely to be accidentally modified

3. **Named Ranges** or **Hidden Worksheets**:

    - Could store metadata in a hidden worksheet
    - Less ideal as users might accidentally modify them
    - More visible in the Excel UI

We will use Custom Document Properties as the primary method for storing UUID and other metadata. CustomXML will be an option for storing additional metadata directly in the Excel file. Other information about the file can be stored in an Oracle database in json format with the UUID as a primary key.

#### Implementation
The file `src/services/excel/registration.ts` implements the registration process. Key features:

1. Uses both Custom Document Properties (for the UUID) and CustomXML (for full metadata)
2. Provides methods for:
    - Registering new files
    - Checking if files are already registered
    - Retrieving metadata
3. Includes error handling and logging
4. Uses TypeScript interfaces for type safety

#### Details

Some additional considerations:

1. The metadata is stored both as a simple UUID in document properties (for quick checks) and as full metadata in CustomXML (for more detailed information).
2. When storing metadata in your Oracle database, you should:

    - Use the UUID as the primary key
    - Store any additional metadata that shouldn't be in the file
    - Keep track of version history
    - Store user-specific data and permissions

3. For production use, you should:

    - _Add proper XML parsing instead of regex [**done**]_
    - _Add validation for metadata values [**done**]_
    - _Add methods for updating metadata [**done**]_
    - Add methods for handling version conflicts
    - _Add proper error handling for specific Office.js errors [**done**]_

#### Production-level Code

Key improvements made to the code:

1. Added a dedicated XmlHelper class that uses the browser's built-in `DOMParser` and `XMLSerializer` for proper XML handling:

    - Safe XML parsing with error detection
    - Proper namespace handling
    - XML creation using DOM methods
    - Validation of required fields

2. Enhanced error handling:
    - Added specific error checks for XML parsing
    - Improved error wrapping with context
    - Better error messages for debugging

3. Added metadata validation:
    - Checks for required fields
    - Validates XML structure
    - Verifies namespace
    - UUID consistency checks

4. Added new functionality:
    - `updateFileMetadata` method for updating existing metadata
    - Proper handling of `Office.js` async results
    - Better type safety throughout

5. Improved robustness:
    - Better handling of malformed XML
    - Graceful handling of missing or corrupt metadata
    - Proper cleanup of old metadata when updating

#### Usage Examples

```typescript
// Register a new file
try {
  const metadata = await ExcelFileRegistration.registerFile();
  console.log('File registered:', metadata);
} catch (error) {
  console.error('Registration failed:', error);
}

// Get metadata for an existing file
try {
  const metadata = await ExcelFileRegistration.getFileMetadata();
  if (metadata) {
    console.log('Found metadata:', metadata);
  } else {
    console.log('File is not registered');
  }
} catch (error) {
  console.error('Failed to get metadata:', error);
}

// Update metadata
try {
  const updatedMetadata = await ExcelFileRegistration.updateFileMetadata({
    version: '1.1'
  });
  console.log('Updated metadata:', updatedMetadata);
} catch (error) {
  console.error('Update failed:', error);
}
```

More details and example usage can be found in the documentation `docs/services/excel-registration.md`.

## API