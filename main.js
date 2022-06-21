const convert = require("./Convert")

// console.log(convertXmlToJson("https://www.w3schools.com/xml/cd_catalog.xml"))
const url2 =
	"https://contadearmazenamento42.blob.core.windows.net/container-faccat/book.xml"

convert(url2).then((result) => {
	console.log(result)
})
// console.log(response)
