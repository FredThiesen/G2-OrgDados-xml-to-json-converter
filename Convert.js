var XMLHttpRequest = require("xhr2")
var parseString = require("xml2js").parseString
var xhr = new XMLHttpRequest()

module.exports = async (url) => {
	console.log("buscando...")
	let convertedJson
	await xhr.open("GET", url)
	await xhr.send()

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				const converted = convertXmlToJson(xhr.responseText)
				convertedJson = converted
			} else {
				console.log("Erro: " + xhr.status)
			}
		}
	}

	const convertXmlToJson = (xml) => {
		let converted = null
		parseString(xml, (err, result) => {
			converted = result
		})
		return converted
	}

	return convertedJson
}
