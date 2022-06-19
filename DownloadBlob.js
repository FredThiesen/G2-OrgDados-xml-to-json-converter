const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config()

async function main() {

    const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=contadearmazenamento42;AccountKey=uCkV1QH3yiU2zyixPXfgSvRt0sF4qIoYXW2Rkc4kTavZjWSCSI2hr8RASDG5w7jnJky2/ONJktYQ+AStkmST9g==;EndpointSuffix=core.windows.net"

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    // Create a unique name for the container
    const containerName = "g2faccat"

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

        //abaixo salva todos nomes de arquivos em um array
    const nomeArquivos=[];
    for await (const blob of containerClient.listBlobsFlat()) {
        nomeArquivos.push(blob.name);
        console.log(blob.name);
    }

    //pra cada arquivo faz uma request e faz o download do blob
    for await (const nome of nomeArquivos) {
        const blockBlobClient = containerClient.getBlockBlobClient(nome);

        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        console.log("\nDownloaded blob content...");
        console.log(
        "\t",
        await streamToText(downloadBlockBlobResponse.readableStreamBody)
        );
    }


}
async function streamToText(readable) {
    readable.setEncoding('utf8');
    let data = '';
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
  }

main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));