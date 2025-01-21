# ContractSmarts API Documentation

This document describes the API endpoints and data formats for the ContractSmarts API Gateway.

## Base URL

```
https://api.contractsmarts.ai
```

## Authentication

All API requests must include appropriate authentication headers (e.g., JWT token). Authentication details will be handled by Auth0.

## Endpoints

### File Registration

#### Register a File
- **POST** `/api/v1/files/register`
- **Purpose**: Register a new Excel file in the system

Request:
```json
{
  "excelUuid": "string",
  "userUuid": "string"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "excelUuid": "string",
    "userUuid": "string",
    "registrationDate": "2025-01-18T10:30:00.000Z",
    "status": "active"
  }
}
```

#### Deregister a File
- **POST** `/api/v1/files/deregister`
- **Purpose**: Remove a file's registration from the system

Request:
```json
{
  "excelUuid": "string",
  "userUuid": "string"
}
```

Response:
```json
{
  "success": true
}
```

### Metadata Management

#### Create Metadata
- **POST** `/api/v1/metadata`
- **Purpose**: Create new metadata for a file

Request:
```json
{
  "excelUuid": "string",
  "userUuid": "string",
  "metadata": {
    "category": "string",
    "status": "string",
    "customFields": {
      "field1": "value1",
      "field2": "value2"
    }
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "excelUuid": "string",
    "userUuid": "string",
    "metadata": {
      "category": "string",
      "status": "string",
      "customFields": {
        "field1": "value1",
        "field2": "value2"
      }
    },
    "createdAt": "2025-01-18T10:30:00.000Z",
    "updatedAt": "2025-01-18T10:30:00.000Z",
    "version": "1.0"
  }
}
```

#### Update Metadata
- **PUT** `/api/v1/metadata/{excelUuid}`
- **Purpose**: Update existing metadata for a file

Request:
```json
{
  "userUuid": "string",
  "metadata": {
    "status": "updated",
    "customFields": {
      "field1": "new-value"
    }
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "excelUuid": "string",
    "userUuid": "string",
    "metadata": {
      "status": "updated",
      "customFields": {
        "field1": "new-value"
      }
    },
    "updatedAt": "2025-01-18T10:31:00.000Z",
    "version": "1.1"
  }
}
```

#### Get Metadata
- **GET** `/api/v1/metadata/{excelUuid}`
- **Headers**: `X-User-UUID: string`
- **Purpose**: Retrieve metadata for a file

Response:
```json
{
  "success": true,
  "data": {
    "excelUuid": "string",
    "userUuid": "string",
    "metadata": {
      "category": "string",
      "status": "string",
      "customFields": {
        "field1": "value1"
      }
    },
    "createdAt": "2025-01-18T10:30:00.000Z",
    "updatedAt": "2025-01-18T10:30:00.000Z",
    "version": "1.0"
  }
}
```

#### Delete Metadata
- **DELETE** `/api/v1/metadata/{excelUuid}`
- **Headers**: `X-User-UUID: string`
- **Purpose**: Delete metadata for a file

Response:
```json
{
  "success": true
}
```

#### Batch Get Metadata
- **POST** `/api/v1/metadata/batch`
- **Purpose**: Retrieve metadata for multiple files

Request:
```json
{
  "files": [
    {
      "excelUuid": "string",
      "userUuid": "string"
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "excelUuid1": {
      "excelUuid": "string",
      "userUuid": "string",
      "metadata": {},
      "createdAt": "2025-01-18T10:30:00.000Z",
      "updatedAt": "2025-01-18T10:30:00.000Z",
      "version": "1.0"
    },
    "excelUuid2": {
      "excelUuid": "string",
      "userUuid": "string",
      "metadata": {},
      "createdAt": "2025-01-18T10:30:00.000Z",
      "updatedAt": "2025-01-18T10:30:00.000Z",
      "version": "1.0"
    }
  }
}
```

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional error details
  }
}
```

Common error codes:
- `INVALID_REQUEST`: Malformed request or invalid parameters
- `UNAUTHORIZED`: Authentication failed
- `FORBIDDEN`: User doesn't have required permissions
- `NOT_FOUND`: Requested resource not found
- `ALREADY_EXISTS`: Resource already exists
- `VALIDATION_ERROR`: Data validation failed

## Rate Limits

- 100 requests per minute per user
- 1000 requests per hour per user
- Batch operations count as one request per item in the batch

When rate limits are exceeded, the API returns:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  }
}
```

## Versioning

The API is versioned using URL path versioning (e.g., `/api/v1/`). The current version is `v1`.
