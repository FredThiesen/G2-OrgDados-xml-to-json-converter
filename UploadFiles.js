const { BlobServiceClient } = require('@azure/storage-blob');
const { QueueClient } = require("@azure/storage-queue");
require('dotenv').config()

async function main() {

    //variavel abaixo deve informar a cadeia de conexao do container
    const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=contadearmazenamento42;AccountKey=uCkV1QH3yiU2zyixPXfgSvRt0sF4qIoYXW2Rkc4kTavZjWSCSI2hr8RASDG5w7jnJky2/ONJktYQ+AStkmST9g==;EndpointSuffix=core.windows.net"

    // Instantiate a QueueClient which will be used to create and manipulate a queue
    const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, 'filax');



    const receivedMessagesResponse = await queueClient.receiveMessages();

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
   



    const containerClient = blobServiceClient.getContainerClient('contoso-json');


   
   


    if (receivedMessagesResponse.receivedMessageItems.length == 1) {
        receivedMessage = receivedMessagesResponse.receivedMessageItems[0];

        // decodifica a mensagem da fila (base 64) 
        let buff = Buffer.from(receivedMessage.messageText, 'base64').toString('utf-8').replace('Processing: ','');

        //parse do objeto e retorna o link de download q vai se passado pra function convert
        console.log(JSON.parse(buff).data.url);

        // Delete the message
        const deleteMessageResponse = await queueClient.deleteMessage(
            receivedMessage.messageId,
            receivedMessage.popReceipt
        );
        console.log("\tMessage deleted, requestId:", deleteMessageResponse.requestId);
        const blobName = "arquivo" + ".json"; //<-- PRECISAMOS CRIAR UM GERADOR DE ID PARA O NOME DO ARQUIVO

        //abaixo ele salva o blob no container
        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
     
        const uploadBlobResponse = await blockBlobClient.upload(receivedMessage.messageText, receivedMessage.messageText.length);
        console.log("\nUploading to Azure storage as blob:\n\t", blobName);
    }




    

    // Upload data to the blob
    const objeto = { "nome": "tim" }

    




}

main()
    .then(() => console.log('Done'))
    .catch((ex) => console.log(ex.message));