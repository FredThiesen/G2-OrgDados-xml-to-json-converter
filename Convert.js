var XMLHttpRequest = require("xhr2")
var parseString = require("xml2js").parseString
var xhr = new XMLHttpRequest()

const convertXmlToJson = (url) => {
	xhr.open("GET", url)
	xhr.send()

	const handleLogConverted = (converted) => {
		converted.map((book) => {
			console.log("LIVRO")
			console.log("----------------")
			console.log("\n")
			console.log("Livro: ", book.title[0])
			console.log("Genero: ", book.genre[0])
			console.log("Autor: ", book.author[0].name[0])
			console.log("Preço: ", book.price[0])
			console.log("Descrição: ", book.description[0])
			console.log("\n\n\n")
		})
	}

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const converted = convertXmlToJson(xhr.responseText)
				handleLogConverted(converted)
			} else {
				console.log("Erro: " + xhr.status)
			}
		}
	}

	const convertXmlToJson = (xml) => {
		let converted = null
		parseString(xml, (err, result) => {
			converted = result.catalog
		})
		return converted.book
	}
}

module.exports = {
	convertXmlToJson,
}
