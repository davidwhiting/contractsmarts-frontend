import { v4 as uuidv4 } from 'uuid';

interface FileMetadata {
  uuid: string;
  registrationDate: string;
  lastModified: string;
  version: string;
  status: 'tracked' | 'ignored';
}

class AlreadyRegisteredError extends Error {
  readonly existingUuid: string;

  constructor(uuid: string) {
    super('File is already registered');
    this.name = 'AlreadyRegisteredError';
    this.existingUuid = uuid;
  }
}

class XmlHelper {
  private static parser = new DOMParser();
  private static serializer = new XMLSerializer();

  static parseXml(xmlString: string): Document {
    const doc = this.parser.parseFromString(xmlString, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`XML Parse Error: ${parseError.textContent}`);
    }
    return doc;
  }

  static createMetadataXml(metadata: FileMetadata, namespace: string): string {
    const doc = document.implementation.createDocument(null, null, null);
    const root = doc.createElementNS(namespace, 'contractsmarts:metadata');
    root.setAttribute('version', metadata.version);
    doc.appendChild(root);

    const fields: (keyof FileMetadata)[] = ['uuid', 'registrationDate', 'lastModified', 'status'];
    fields.forEach(field => {
      const element = doc.createElementNS(namespace, field);
      element.textContent = metadata[field];
      root.appendChild(element);
    });

    return this.serializer.serializeToString(doc);
  }

  static getElementValue(doc: Document, tagName: string, namespace: string): string {
    const element = doc.getElementsByTagNameNS(namespace, tagName)[0];
    return element ? element.textContent || '' : '';
  }

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
      version: root.getAttribute('version') || '1.0',
      status: (this.getElementValue(doc, 'status', namespace) || 'tracked') as 'tracked' | 'ignored'
    };

    const requiredFields: (keyof FileMetadata)[] = ['uuid', 'registrationDate', 'lastModified'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    if (missingFields.length > 0) {
      throw new Error(`Invalid metadata XML: missing required fields: ${missingFields.join(', ')}`);
    }

    return metadata;
  }
}

class ExcelFileRegistration {
  private static readonly UUID_PROPERTY = 'ContractSmarts_UUID';
  private static readonly METADATA_XML_NAMESPACE = 'http://www.contractsmarts.ai/metadata';

  public static async registerFile(): Promise<FileMetadata> {
    try {
      return await Excel.run(async (context) => {
        const existingUuid = await this.getFileUuid(context);
        if (existingUuid) {
          const existingMetadata = await this.getFileMetadata();
          if (existingMetadata?.status === 'ignored') {
            return await this.updateFileMetadata({
              ...existingMetadata,
              status: 'tracked',
              lastModified: new Date().toISOString()
            });
          }
          throw new AlreadyRegisteredError(existingUuid);
        }

        const uuid = uuidv4();
        const metadata: FileMetadata = {
          uuid,
          registrationDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: '1.0',
          status: 'tracked'
        };

        await this.setCustomDocumentProperty(context, this.UUID_PROPERTY, uuid);
        await this.setCustomXmlPart(context, metadata);
        
        await context.sync();
        return metadata;
      });
    } catch (error) {
      if (error instanceof AlreadyRegisteredError) {
        throw error;
      }
      console.error('Error registering file:', error);
      throw this.wrapError(error);
    }
  }

  public static async ignoreFile(): Promise<FileMetadata> {
    try {
      return await Excel.run(async (context) => {
        const existingMetadata = await this.getFileMetadata();
        if (existingMetadata) {
          return await this.updateFileMetadata({
            ...existingMetadata,
            status: 'ignored',
            lastModified: new Date().toISOString()
          });
        }

        const metadata: FileMetadata = {
          uuid: uuidv4(),
          registrationDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          version: '1.0',
          status: 'ignored'
        };

        await this.setCustomDocumentProperty(context, this.UUID_PROPERTY, metadata.uuid);
        await this.setCustomXmlPart(context, metadata);
        
        await context.sync();
        return metadata;
      });
    } catch (error) {
      console.error('Error ignoring file:', error);
      throw this.wrapError(error);
    }
  }

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

  public static async getFileMetadata(): Promise<FileMetadata | null> {
    try {
      return await Excel.run(async (context) => {
        const uuid = await this.getFileUuid(context);
        if (!uuid) return null;

        const customXmlParts = context.workbook.customXmlParts;
        customXmlParts.load('items');
        await context.sync();

        for (const part of customXmlParts.items) {
          const xml = await this.getCustomXmlPartContent(part);
          try {
            const metadata = XmlHelper.parseMetadata(xml, this.METADATA_XML_NAMESPACE);
            if (metadata.uuid === uuid) {
              return metadata;
            }
          } catch (error) {
            console.warn('Error parsing XML part:', error);
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

  public static async updateFileMetadata(updates: Partial<FileMetadata>): Promise<FileMetadata> {
    try {
      return await Excel.run(async (context) => {
        const currentMetadata = await this.getFileMetadata();
        if (!currentMetadata) {
          throw new Error('File is not registered');
        }

        const updatedMetadata: FileMetadata = {
          ...currentMetadata,
          ...updates,
          lastModified: new Date().toISOString()
        };

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
            continue;
          }
        }

        await this.setCustomXmlPart(context, updatedMetadata);
        await context.sync();

        return updatedMetadata;
      });
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw this.wrapError(error);
    }
  }

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

  private static wrapError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`Excel File Registration Error: ${error.message}`, { cause: error });
    }
    return new Error(`Excel File Registration Error: ${String(error)}`);
  }
}

export { AlreadyRegisteredError, ExcelFileRegistration };
