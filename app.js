var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var { Parser } = require('json2csv');

app.get('/', async function (req, res) {
	var url = 'http://www.cpubenchmark.net/CPU_mega_page.html';
	var cpuData = [];

	request(url, function (error, response, html) {
		if (!error) {

			var $ = cheerio.load(html);

			$("tbody tr[id^=cpu]").each(function (x) {
				var $ref = $(this),
					$refExpandedContents = $ref.next().find("td div").contents();

				cpuData.push({
					name: $ref.find("td a:nth-child(2)").text() || '',
					clockSpeed: parseInt($refExpandedContents[1].data.match(/\d+(?!.*\d)/)) || 0,
					turboSpeed: parseInt($refExpandedContents[3].data.match(/\d+(?!.*\d)/)) || 0,
					physicalCores: parseInt($refExpandedContents[5].data.match(/\d+\.?\d*/)) || 0,
					logicalCores: parseInt($refExpandedContents[5].data.match(/\d+(?!.*\d)/)) || 0,
					rank: parseInt($refExpandedContents[7].data.match(/\d+(?!.*\d)/)) || 0,
					samples: parseInt($refExpandedContents[9].data.match(/\d+(?!.*\d)/)) || 0,
					price: $ref.find("td:nth-child(2)").text() || '',
					cpuMark: parseInt($ref.find("td:nth-child(3)").text()) || 0,
					cpuValue: parseInt($ref.find("td:nth-child(4)").text()) || 0,
					singleThreadMark: parseInt($ref.find("td:nth-child(5)").text()) || 0,
					singleThreadValue: parseInt($ref.find("td:nth-child(6)").text()) || 0,
					tdp: parseInt($ref.find("td:nth-child(6)").text()) || 0,
					powerPerf: parseInt($ref.find("td:nth-child(7)").text()) || 0,
					testDate: (new Date($ref.find("td:nth-child(9)").text())),
					socket: $ref.find("td:nth-child(10)").text() || '',
					category: $ref.find("td:nth-child(11)").text() || ''
				});
			});

		} else {
			console.log('Something went wrong');
		}

		const parser = new Parser();
		const csv = parser.parse(cpuData);

		res.write(csv);
		res.end();
	});
});

app.listen('8081');
console.log('Live on localhost:8081');
