export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface FileRegistration {
  excelUuid: string;
  userUuid: string;
  registrationDate: string;
  status: 'active' | 'deregistered';
}

export interface FileMetadata {
  excelUuid: string;
  userUuid: string;
  metadata: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  version: string;
}
