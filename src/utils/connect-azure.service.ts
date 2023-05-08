import { BlobSASPermissions, BlobServiceClient, BlockBlobClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } from "@azure/storage-blob";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConnectAzure{
    constructor() {
        // empty
      }

      /**
   * This function is connect to Azure storage
   *
   * @param imageName  string
   * @returns  BlockBlobClient
   */
  getBlobClient(imageName: string): BlockBlobClient {
    const azureConnection =
      'DefaultEndpointsProtocol=https;AccountName=' +
      process.env['AZURE_STORAGE_ACCOUNT_NAME'] +
      ';AccountKey=' +
      process.env['AZURE_STORAGE_ACCOUNT_KEY'] +
      ';EndpointSuffix=core.windows.net';
    const containerName = process.env['AZURE_STORAGE_CONTAINER_NAME'];
    const blobClientService =
      BlobServiceClient.fromConnectionString(azureConnection);
    const containerClient = blobClientService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  /**
   * This function is create sas token
   *
   * @param blobName string
   * @returns string[]
   */
  createSasKey(blobName: string): string[] {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      process.env['AZURE_STORAGE_ACCOUNT_NAME'],
      process.env['AZURE_STORAGE_ACCOUNT_KEY'],
    );

    const containerName = process.env['AZURE_STORAGE_CONTAINER_NAME'];
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse('racwd'), // read, add, create,  write, delete
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 10 * 60 * 1000), // 10 minutes
      },

      sharedKeyCredential,
    ).toString();

    // prepend sasToken with `?`
    const token = sasToken[0] === '?' ? sasToken : `?${sasToken}`;
    const url = `https://${process.env['AZURE_STORAGE_ACCOUNT_NAME']}.blob.core.windows.net/${process.env['AZURE_STORAGE_CONTAINER_NAME']}/${blobName}`;
    return [token, url];
  }
  
  public async connectIotHub(deviceId: string)
  {
    
  }
    
    
}