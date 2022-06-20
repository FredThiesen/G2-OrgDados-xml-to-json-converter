const { BlobServiceClient } = require("@azure/storage-blob")
const { QueueClient } = require("@azure/storage-queue")
var { parseString } = require("xml2js")
require("dotenv").config()

//esse arquivo .json faz o download de todos arquivos do container g2faccat, transforma o xml para objeto e envia para a fila
async function main() {
	const AZURE_STORAGE_CONNECTION_STRING =
		"DefaultEndpointsProtocol=https;AccountName=contadearmazenamento42;AccountKey=uCkV1QH3yiU2zyixPXfgSvRt0sF4qIoYXW2Rkc4kTavZjWSCSI2hr8RASDG5w7jnJky2/ONJktYQ+AStkmST9g==;EndpointSuffix=core.windows.net"

	const blobServiceClient = BlobServiceClient.fromConnectionString(
		AZURE_STORAGE_CONNECTION_STRING
	)
	// Create a unique name for the container
	const containerName = "g2faccat"

	// Get a reference to a container
	const containerClient = blobServiceClient.getContainerClient(containerName)

	//abaixo salva todos nomes de arquivos em um array
	const nomeArquivos = []
	for await (const blob of containerClient.listBlobsFlat()) {
		nomeArquivos.push(blob.name)
		console.log(blob.name)
	}

	let xmlArray = []

	//pra cada arquivo faz uma request e faz o download do blob
	for await (const nome of nomeArquivos) {
		const blockBlobClient = containerClient.getBlockBlobClient(nome)

		const downloadBlockBlobResponse = await blockBlobClient.download(0)
		console.log("\nDownloaded blob content...")
		console.log(
			"\t",
			await streamToText(downloadBlockBlobResponse.readableStreamBody)
		)
		xmlArray.push(downloadBlockBlobResponse.readableStreamBody)
	}

	console.log(xmlArray[0])

	const convertXmlToJson = (xml) => {
		let converted = null
		parseString(xml, (err, result) => {
			converted = result
		})
		return converted
	}

	for (xml of xmlArray) {
		console.log(convertXmlToJson(xml))
	}
	//********--------------------------- */

	// AQUI VAI O CODIGO QUE TRANSFORMA O XML BAIXADO EM JSON NOVAMENTE

	//********--------------------------- */

	//enviar mensagens para a fila
	const queueClient = new QueueClient(
		AZURE_STORAGE_CONNECTION_STRING,
		"filax"
	)

	// Create the queue
	const createQueueResponse = await queueClient.createIfNotExists()

	//utilizado um array mockado para testes ate que o metodo de converter xml para json esteja pronto
	const pessoas = [
		{ nome: "luiz", idade: 36 },
		{ nome: "rodrigo", idade: 40 },
		{ nome: "reginaldo", idade: 64 },
	]

	for await (let pessoa of pessoas) {
		queueClient.sendMessage(JSON.stringify(pessoa))
	}

	//const sendMessageResponse = await queueClient.sendMessage(JSON.stringify(pessoa));

	//console.log("Messages added, requestId:", sendMessageResponse.requestId);
}
async function streamToText(readable) {
	readable.setEncoding("utf8")
	let data = ""
	for await (const chunk of readable) {
		data += chunk
	}
	return data
}

main()
	.then(() => console.log("Done"))
	.catch((ex) => console.log(ex.message))
