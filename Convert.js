var parseString = require("xml2js").parseString
var request = require("request")

function convertXmlToJson(url) {
	return new Promise((resolve, reject) => {
		request(url, (err, response, body) => {
			if (err) {
				reject(err)
			}
			parseString(body, (err, result) => {
				resolve(result)
			})
		})
	})
}

module.exports = { convertXmlToJson }
