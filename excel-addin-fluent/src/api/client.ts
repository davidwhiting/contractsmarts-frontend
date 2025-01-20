import { ApiResponse, FileRegistration, FileMetadata } from './types';

/**
 * ContractSmarts API client for interacting with the OCI API Gateway
 */
export class ContractSmartsApi {
  private readonly baseUrl: string;
  private readonly version = 'v1';

  constructor(config: { baseUrl: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Register a file with the system
   */
  async registerFile(
    excelUuid: string,
    userUuid: string
  ): Promise<ApiResponse<FileRegistration>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/files/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            excelUuid,
            userUuid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Deregister a file from the system
   */
  async deregisterFile(
    excelUuid: string,
    userUuid: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/files/deregister`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            excelUuid,
            userUuid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Create metadata for a file
   */
  async createMetadata(
    excelUuid: string,
    userUuid: string,
    metadata: Record<string, unknown>
  ): Promise<ApiResponse<FileMetadata>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/metadata`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            excelUuid,
            userUuid,
            metadata,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Update metadata for a file
   */
  async updateMetadata(
    excelUuid: string,
    userUuid: string,
    metadata: Record<string, unknown>
  ): Promise<ApiResponse<FileMetadata>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/metadata/${excelUuid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userUuid,
            metadata,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Get metadata for a file
   */
  async getMetadata(
    excelUuid: string,
    userUuid: string
  ): Promise<ApiResponse<FileMetadata>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/metadata/${excelUuid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-UUID': userUuid,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Delete metadata for a file
   */
  async deleteMetadata(
    excelUuid: string,
    userUuid: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/metadata/${excelUuid}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-User-UUID': userUuid,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Batch retrieve metadata for multiple files
   */
  async batchGetMetadata(
    files: { excelUuid: string; userUuid: string }[]
  ): Promise<ApiResponse<Record<string, FileMetadata>>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/${this.version}/metadata/batch`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}
