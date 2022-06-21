var { convertXmlToJson } = require("./Convert")
const url1 =
	"https://contadearmazenamento42.blob.core.windows.net/container-faccat/book.xml"
const url2 = "https://w3schools.com/xml/note.xml"

const result1 = convertXmlToJson(url1).then((result) => {
	console.log(result)
})

const result2 = convertXmlToJson(url2).then((result) => {
	console.log(result)
})

// console.log(result1, result2)
