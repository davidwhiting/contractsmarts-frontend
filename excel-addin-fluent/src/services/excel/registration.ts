import { v4 as uuidv4 } from 'uuid';

interface FileMetadata {
  uuid: string;
  registrationDate: string;
  lastModified: string;
  version: string;
}

/**
 * XML Parser utility class to safely parse and create XML
 */
class XmlHelper {
  private static parser = new DOMParser();
  private static serializer = new XMLSerializer();

  /**
   * Safely parse XML string
   */
  static parseXml(xmlString: string): Document {
    const doc = this.parser.parseFromString(xmlString, 'application/xml');
    // Check for parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`XML Parse Error: ${parseError.textContent}`);
    }
    return doc;
  }

  /**
   * Create metadata XML document
   */
  static createMetadataXml(metadata: FileMetadata, namespace: string): string {
    const doc = document.implementation.createDocument(null, null, null);
    
    // Create root element with namespace
    const root = doc.createElementNS(namespace, 'contractsmarts:metadata');
    root.setAttribute('version', metadata.version);
    doc.appendChild(root);

    // Add metadata elements
    const fields: (keyof FileMetadata)[] = ['uuid', 'registrationDate', 'lastModified'];
    fields.forEach(field => {
      const element = doc.createElementNS(namespace, field);
      element.textContent = metadata[field];
      root.appendChild(element);
    });

    return this.serializer.serializeToString(doc);
  }

  /**
   * Extract value from XML element
   */
  static getElementValue(doc: Document, tagName: string, namespace: string): string {
    const element = doc.getElementsByTagNameNS(namespace, tagName)[0];
    return element ? element.textContent || '' : '';
  }

  /**
   * Parse metadata from XML document
   */
  static parseMetadata(xmlString: string, namespace: string): FileMetadata {
    const doc = this.parseXml(xmlString);
    const root = doc.documentElement;

    if (!root || !root.namespaceURI?.includes(namespace)) {
      throw new Error('Invalid metadata XML: incorrect namespace');
    }

    const metadata: FileMetadata = {
      uuid: this.getElementValue(doc, 'uuid', namespace),
      registrationDate: this.getElementValue(doc, 'registrationDate', namespace),
      lastModified: this.getElementValue(doc, 'lastModified', namespace),
      version: root.getAttribute('version') || '1.0'
    };

    // Validate required fields
    const requiredFields: (keyof FileMetadata)[] = ['uuid', 'registrationDate', 'lastModified'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    if (missingFields.length > 0) {
      throw new Error(`Invalid metadata XML: missing required fields: ${missingFields.join(', ')}`);
    }

    return metadata;
  }
}

/**
 * Main class for Excel file registration and metadata management
 */
export class ExcelFileRegistration {
  private static readonly UUID_PROPERTY = 'ContractSmarts_UUID';
  private static readonly METADATA_XML_NAMESPACE = 'http://www.contractsmarts.ai/metadata';
  
  /**
   * Register a new Excel file by adding a UUID and metadata
   */
  public static async registerFile(): Promise<FileMetadata> {
    try {
      return await Excel.run(async (context) => {
        // First check if file is already registered
        const existingUuid = await this.getFileUuid(context);
        if (existingUuid) {
          throw new Error('File is already registered');
        }

        // Generate new UUID
        const uuid = uuidv4();
        
        // Create metadata object
        const metadata: FileMetadata = {
          uuid,
          registrationDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: '1.0'
        };

        // Store UUID in document properties
        await this.setCustomDocumentProperty(context, this.UUID_PROPERTY, uuid);
        
        // Store full metadata in CustomXML
        await this.setCustomXmlPart(context, metadata);
        
        await context.sync();
        return metadata;
      });
    } catch (error) {
      console.error('Error registering file:', error);
      throw this.wrapError(error);
    }
  }

  /**
   * Get the UUID of a registered file
   */
  private static async getFileUuid(context: Excel.RequestContext): Promise<string | null> {
    try {
      const properties = context.workbook.properties.custom;
      properties.load('items');
      await context.sync();

      const uuidProperty = properties.items.find(
        prop => prop.key === this.UUID_PROPERTY
      );
      
      return uuidProperty ? String(uuidProperty.value) : null;
    } catch (error) {
      console.error('Error getting file UUID:', error);
      throw this.wrapError(error);
    }
  }

  /**
   * Set a custom document property
   */
  private static async setCustomDocumentProperty(
    context: Excel.RequestContext,
    key: string,
    value: string
  ): Promise<void> {
    try {
      const properties = context.workbook.properties.custom;
      properties.add(key, value);
      await context.sync();
    } catch (error) {
      console.error('Error setting custom property:', error);
      throw this.wrapError(error);
    }
  }

  /**
   * Store metadata in CustomXML
   */
  private static async setCustomXmlPart(
    context: Excel.RequestContext,
    metadata: FileMetadata
  ): Promise<void> {
    try {
      const xml = XmlHelper.createMetadataXml(metadata, this.METADATA_XML_NAMESPACE);
      context.workbook.customXmlParts.add(xml);
      await context.sync();
    } catch (error) {
      console.error('Error setting CustomXML:', error);
      throw this.wrapError(error);
    }
  }

  /**
   * Get full metadata for a registered file
   */
  public static async getFileMetadata(): Promise<FileMetadata | null> {
    try {
      return await Excel.run(async (context) => {
        const uuid = await this.getFileUuid(context);
        if (!uuid) return null;

        const customXmlParts = context.workbook.customXmlParts;
        customXmlParts.load('items');
        await context.sync();

        // Find our metadata XML part
        for (const part of customXmlParts.items) {
          const xml = await this.getCustomXmlPartContent(part);
          try {
            const metadata = XmlHelper.parseMetadata(xml, this.METADATA_XML_NAMESPACE);
            // Verify UUID matches
            if (metadata.uuid === uuid) {
              return metadata;
            }
          } catch (error) {
            console.warn('Error parsing XML part:', error);
            // Continue checking other parts
            continue;
          }
        }
        return null;
      });
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw this.wrapError(error);
    }
  }

  /**
   * Update metadata for a registered file
   */
  public static async updateFileMetadata(updates: Partial<FileMetadata>): Promise<FileMetadata> {
    try {
      return await Excel.run(async (context) => {
        const currentMetadata = await this.getFileMetadata();
        if (!currentMetadata) {
          throw new Error('File is not registered');
        }

        // Create updated metadata
        const updatedMetadata: FileMetadata = {
          ...currentMetadata,
          ...updates,
          lastModified: new Date().toISOString()
        };

        // Remove old XML part
        const customXmlParts = context.workbook.customXmlParts;
        customXmlParts.load('items');
        await context.sync();

        for (const part of customXmlParts.items) {
          const xml = await this.getCustomXmlPartContent(part);
          try {
            const metadata = XmlHelper.parseMetadata(xml, this.METADATA_XML_NAMESPACE);
            if (metadata.uuid === currentMetadata.uuid) {
              part.delete();
              break;
            }
          } catch (error) {
            // Continue checking other parts
            continue;
          }
        }

        // Add new XML part
        await this.setCustomXmlPart(context, updatedMetadata);
        await context.sync();

        return updatedMetadata;
      });
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw this.wrapError(error);
    }
  }

  /**
   * Helper to get CustomXmlPart content
   */
  private static async getCustomXmlPartContent(
    part: Excel.CustomXmlPart
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      part.getXml((result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve(result.value);
        } else {
          reject(new Error(result.error.message));
        }
      });
    });
  }

  /**
   * Wrap errors with additional context
   */
  private static wrapError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`Excel File Registration Error: ${error.message}`, { cause: error });
    }
    return new Error(`Excel File Registration Error: ${String(error)}`);
  }
}
