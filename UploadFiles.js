const { BlobServiceClient } = require("@azure/storage-blob")
const { QueueClient } = require("@azure/storage-queue")
const { convertXmlToJson } = require("./Convert")
const { randomUUID } = require("crypto")
require("dotenv").config()

async function main() {
	let i = 0
	//variavel abaixo deve informar a cadeia de conexao do container
	const AZURE_STORAGE_CONNECTION_STRING =
		"DefaultEndpointsProtocol=https;AccountName=contadearmazenamento42;AccountKey=uCkV1QH3yiU2zyixPXfgSvRt0sF4qIoYXW2Rkc4kTavZjWSCSI2hr8RASDG5w7jnJky2/ONJktYQ+AStkmST9g==;EndpointSuffix=core.windows.net"

	// Instantiate a QueueClient which will be used to create and manipulate a queue

	while (true) {
		const queueClient = new QueueClient(
			AZURE_STORAGE_CONNECTION_STRING,
			"filax"
		)
		const receivedMessagesResponse = await queueClient.receiveMessages()

		const blobServiceClient = BlobServiceClient.fromConnectionString(
			AZURE_STORAGE_CONNECTION_STRING
		)

		const containerClient =
			blobServiceClient.getContainerClient("contoso-json")

		if (receivedMessagesResponse.receivedMessageItems.length) {
			receivedMessage = receivedMessagesResponse.receivedMessageItems[0]

			// decodifica a mensagem da fila (base 64)
			let buff = Buffer.from(receivedMessage.messageText, "base64")
				.toString("utf-8")
				.replace("Processing: ", "")

			//parse do objeto e retorna o link de download q vai se passado pra function convert
			let url = JSON.parse(buff).data.url
			convertXmlToJson(url).then((json) => {
				const blobName = `arquivo-${i}${i + 1}${i + 2}${i + 3}.json` //<-- PRECISAMOS CRIAR UM GERADOR DE ID PARA O NOME DO ARQUIVO

				//abaixo ele salva o blob no container
				// Get a block blob client
				const blockBlobClient =
					containerClient.getBlockBlobClient(blobName)

				blockBlobClient.upload(
					JSON.stringify(json),
					JSON.stringify(json).length
				)

				console.log(
					"\nUploading to Azure storage as blob:\n\t",
					blobName
				)
				console.log(
					"\nUploaded blob size:",
					JSON.stringify(json).length
				)
			})
		} else {
			console.log("\n\tNão há mensagens na fila")
		}
		//sleep for 15s
		await new Promise((resolve) => setTimeout(resolve, 5000))
		console.log("i", i)
		i++
	}
}

main()
	.then(() => console.log("Done"))
	.catch((ex) => console.log(ex.message))
