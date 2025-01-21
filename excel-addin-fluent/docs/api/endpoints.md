# ContractSmarts API Endpoints

## Overview

This document details the API endpoints available in the ContractSmarts API Gateway. All endpoints require authentication and use JSON for request/response bodies.

## Base URL

```
https://api.contractsmarts.ai
```

## Authentication

All API requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is obtained through Auth0 authentication. See the client usage documentation for Auth0 setup details.

## Common Headers

All requests should include:
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

## API Versioning

The API uses URL path versioning. Current version: `v1`
Base path: `/api/v1`

## Endpoints

### File Registration

#### Register a File
```
POST /api/v1/files/register
```

Registers a new Excel file in the system.

**Request Body:**
```json
{
  "excelUuid": "string",
  "userUuid": "string"
}
```

**Success Response: (200 OK)**
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
```
POST /api/v1/files/deregister
```

Removes a file's registration from the system.

**Request Body:**
```json
{
  "excelUuid": "string",
  "userUuid": "string"
}
```

**Success Response: (200 OK)**
```json
{
  "success": true
}
```

### Metadata Management

#### Create Metadata
```
POST /api/v1/metadata
```

Creates new metadata for a file.

**Request Body:**
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

**Success Response: (201 Created)**
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
```
PUT /api/v1/metadata/{excelUuid}
```

Updates existing metadata for a file.

**Path Parameters:**
- `excelUuid`: The UUID of the Excel file

**Request Body:**
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

**Success Response: (200 OK)**
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
```
GET /api/v1/metadata/{excelUuid}
```

Retrieves metadata for a file.

**Path Parameters:**
- `excelUuid`: The UUID of the Excel file

**Headers:**
- `X-User-UUID`: The UUID of the requesting user

**Success Response: (200 OK)**
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
```
DELETE /api/v1/metadata/{excelUuid}
```

Deletes metadata for a file.

**Path Parameters:**
- `excelUuid`: The UUID of the Excel file

**Headers:**
- `X-User-UUID`: The UUID of the requesting user

**Success Response: (200 OK)**
```json
{
  "success": true
}
```

#### Batch Get Metadata
```
POST /api/v1/metadata/batch
```

Retrieves metadata for multiple files.

**Request Body:**
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

**Success Response: (200 OK)**
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
    }
  }
}
```

## Error Responses

All endpoints may return these error responses:

### Invalid Request (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field": "error details"
    }
  }
}
```

### Unauthorized (401 Unauthorized)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication failed"
  }
}
```

### Forbidden (403 Forbidden)
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "User does not have required permissions"
  }
}
```

### Not Found (404 Not Found)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Rate Limit Exceeded (429 Too Many Requests)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "details": {
      "retryAfter": 60
    }
  }
}
```

## Rate Limiting

Rate limits are enforced per user:
- 100 requests per minute
- 1000 requests per hour
- Batch operations count as one request per item

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1516242900
```
