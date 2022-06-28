const { BlobServiceClient } = require("@azure/storage-blob")
const { QueueClient } = require("@azure/storage-queue")
const { convertXmlToJson } = require("./Convert")
require("dotenv").config()

//start time counter
let i = 1

async function main() {
	let uploaded = false
	//variavel abaixo deve informar a cadeia de conexao do container
	const AZURE_STORAGE_CONNECTION_STRING =
		"DefaultEndpointsProtocol=https;AccountName=contadearmazenamento42;AccountKey=uCkV1QH3yiU2zyixPXfgSvRt0sF4qIoYXW2Rkc4kTavZjWSCSI2hr8RASDG5w7jnJky2/ONJktYQ+AStkmST9g==;EndpointSuffix=core.windows.net"
	timeTotal = 0
	// Instantiate a QueueClient which will be used to create and manipulate a queue

	while (true) {
		let start
		const queueClient = new QueueClient(
			AZURE_STORAGE_CONNECTION_STRING,
			"filax"
		)
		const receivedMessagesResponse = await queueClient.receiveMessages()

		const blobServiceClient = BlobServiceClient.fromConnectionString(
			AZURE_STORAGE_CONNECTION_STRING
		)

		const containerClient =
			blobServiceClient.getContainerClient("contoso-json2")

		if (receivedMessagesResponse.receivedMessageItems.length) {
			start = new Date().getTime()
			receivedMessage = receivedMessagesResponse.receivedMessageItems[0]

			// decodifica a mensagem da fila (base 64)
			let buff = Buffer.from(receivedMessage.messageText, "base64")
				.toString("utf-8")
				.replace("Processing: ", "")

			//parse do objeto e retorna o link de download q vai se passado pra function convert
			let url = JSON.parse(buff).data.url
			await convertXmlToJson(url)
				.then((json) => {
					const blobName = `arquivo-${Math.random()}${Math.random()}${
						i + 2
					}${i + 3}.json`

					//abaixo ele salva o blob no container
					// Get a block blob client
					const blockBlobClient =
						containerClient.getBlockBlobClient(blobName)

					queueClient
						.deleteMessage(
							receivedMessage.messageId,
							receivedMessage.popReceipt
						)
						.then(() => {
							blockBlobClient
								.upload(
									JSON.stringify(json),
									JSON.stringify(json).length
								)
								.then(() => {
									uploaded = true
									console.log(
										"\nFazendo upload do arquivo:\n\t",
										blobName
									)
									console.log("arquivo: ", i)
									i++
								})
								.catch(() => "erro ao fazer upload")
						})
						.catch(() => console.log("erro ao deletar msg"))
				})
				.catch(() => "erro ao ler evento")
		} else {
			console.log("\n\tNão há mensagens na fila:")
			if (uploaded) {
				break
			}
		}
		if (uploaded) {
			const end = new Date().getTime()
			const timeDiff = end - start
			console.log(
				"\n\n",
				timeDiff / 1000 + " segundos para fazer o upload"
			)
			timeTotal = timeTotal + timeDiff / 1000
			console.log("\n\ntempo total: ", timeTotal)
		}

		await new Promise((resolve) => setTimeout(resolve, 50))
	}
}

main().then(() => {
	console.log("Done! Arquivos: ", i)
})
