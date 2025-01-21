# ContractSmarts API Client

The ContractSmarts API client provides a type-safe interface for interacting with the ContractSmarts API Gateway. It handles file registration and metadata management for Excel files within the ContractSmarts ecosystem.

## Installation

```bash
npm install @contractsmarts/api-client
```

## Quick Start

```typescript
import { ContractSmartsApi } from '@contractsmarts/api-client';

const api = new ContractSmartsApi({
  baseUrl: 'https://api.contractsmarts.ai',
  // The API key will be automatically handled by Auth0
});

// Register a file
const result = await api.registerFile(excelUuid, userUuid);
if (result.success) {
  console.log('File registered:', result.data);
}
```

## Authentication

The API client automatically handles authentication using Auth0. The Auth0 token is automatically included in all API requests. Make sure you've configured Auth0 in your application:

```typescript
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="contractsmarts.auth0.com"
    clientId="your_client_id"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://api.contractsmarts.ai"
    }}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
```

## API Methods

### File Registration

#### Register a File

```typescript
const registration = await api.registerFile(excelUuid, userUuid);
if (registration.success) {
  const { registrationDate, status } = registration.data;
  console.log(`File registered on ${registrationDate} with status: ${status}`);
}
```

#### Deregister a File

```typescript
const deregistration = await api.deregisterFile(excelUuid, userUuid);
if (deregistration.success) {
  console.log('File deregistered successfully');
}
```

### Metadata Management

#### Create Metadata

```typescript
const metadata = await api.createMetadata(excelUuid, userUuid, {
  category: 'contract',
  department: 'legal',
  status: 'draft',
  customFields: {
    reviewedBy: 'John Doe',
    priority: 'high'
  }
});

if (metadata.success) {
  console.log('Metadata created:', metadata.data);
}
```

#### Update Metadata

```typescript
const updated = await api.updateMetadata(excelUuid, userUuid, {
  status: 'reviewed',
  customFields: {
    reviewedBy: 'Jane Smith',
    reviewDate: new Date().toISOString()
  }
});

if (updated.success) {
  console.log('Metadata updated:', updated.data);
}
```

#### Retrieve Metadata

```typescript
const retrieved = await api.getMetadata(excelUuid, userUuid);
if (retrieved.success) {
  const { metadata, version } = retrieved.data;
  console.log(`Metadata (version ${version}):`, metadata);
}
```

#### Delete Metadata

```typescript
const deleted = await api.deleteMetadata(excelUuid, userUuid);
if (deleted.success) {
  console.log('Metadata deleted successfully');
}
```

### Batch Operations

#### Batch Retrieve Metadata

```typescript
const files = [
  { excelUuid: 'uuid1', userUuid: 'user1' },
  { excelUuid: 'uuid2', userUuid: 'user1' }
];

const batchResult = await api.batchGetMetadata(files);
if (batchResult.success) {
  Object.entries(batchResult.data).forEach(([uuid, metadata]) => {
    console.log(`Metadata for ${uuid}:`, metadata);
  });
}
```

## Error Handling

The API client provides structured error responses. Here's how to handle them:

```typescript
try {
  const result = await api.registerFile(excelUuid, userUuid);
  if (!result.success) {
    switch (result.error?.code) {
      case 'ALREADY_EXISTS':
        console.error('File is already registered');
        break;
      case 'UNAUTHORIZED':
        console.error('Authentication failed');
        break;
      case 'FORBIDDEN':
        console.error('User does not have permission');
        break;
      default:
        console.error(`Error: ${result.error?.message}`);
    }
  }
} catch (error) {
  console.error('Network or system error:', error);
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | The request was malformed or contained invalid parameters |
| `UNAUTHORIZED` | Authentication failed or was not provided |
| `FORBIDDEN` | User doesn't have permission for the requested operation |
| `NOT_FOUND` | The requested resource was not found |
| `ALREADY_EXISTS` | The file is already registered |
| `VALIDATION_ERROR` | The provided data failed validation |

## TypeScript Support

The API client includes full TypeScript definitions. Here are the main interfaces:

```typescript
interface FileRegistration {
  excelUuid: string;
  userUuid: string;
  registrationDate: string;
  status: 'active' | 'deregistered';
}

interface FileMetadata {
  excelUuid: string;
  userUuid: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Rate Limits

The API has the following rate limits:

- 100 requests per minute per user
- 1000 requests per hour per user
- Batch operations count as one request per item in the batch

When rate limits are exceeded, the API returns an error with code `RATE_LIMIT_EXCEEDED`.

## Best Practices

1. Always check the `success` property of responses before accessing data
2. Implement retry logic for transient failures
3. Use batch operations when processing multiple files
4. Handle rate limits gracefully
5. Keep metadata payload sizes reasonable (under 100KB)

## Contributing

Please see CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

[Your license information here]
