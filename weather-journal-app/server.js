// Setup empty JS object to act as endpoint for all routes
projectData = {};
/* Global Variables */
const api_key = '6cdf5d8ab5c003761b28f34088efc6ad';
// Setup Server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('https');
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/* Initialize the main project folder*/
app.use(express.static('website'));
/* Spin up the server*/
const port = 3000;
const server = app.listen(port, listening);
function listening() {
	console.log(`running on localhost: ${port}`);
}
/****************************************************/
// GET /all from server side
app.get('/all', sendData);
function sendData(request, response, next) {
	response.send(projectData);
	console.log('\n projectData=', projectData);
	next();
}

/****************************************************/
// POST /newEntry from client side and store it in projectData
app.post('/newEntry', receiveData);

async function receiveData(request, response) {
	newEntry = {
		zipCode: request.body.zipCode,
		date: request.body.date,
		userResponse: request.body.userResponse
	};
	newZip = newEntry.zipCode;
	//check whether the user entered a valid zipCode before calling the api
	let temperature =
		newZip === 'not a valid zip code!!'
			? 'no temperature data'
			: await weatherAPI(newZip, api_key); //we called this to get the temperature from online api
	newEntry['temperature'] = await temperature;
	Object.assign(projectData, newEntry);
	//	console.log('\n this is weatherAPI output :- \n', temperature);
	console.log('\n server (newEntry) is :- \n', newEntry);
	response.end();
}
/*****************************************************/
/*****************************************************/
//the API DATA that we get from the online weather api ,
//is sent to the server side.
const weatherAPI = async function (zipCode, api_Key) {
	function httpRequest(options, postData) {
		return new Promise(function (resolve, reject) {
			var req = http.request(options, function (res) {
				// reject on bad status
				if (res.statusCode < 200 || res.statusCode >= 300) {
					return reject('wrong zip code ,status Code= ' + res.statusCode);
				}
				// cumulate data
				var chunks = [];
				res.on('data', function (chunk) {
					chunks.push(chunk);
				});
				// resolve on end
				res.on('end', function () {
					try {
						body = JSON.parse(Buffer.concat(chunks).toString());
						temperature = body.main.temp;
					} catch (e) {
						reject(e);
					}
					resolve(temperature); //this is how to get temperature from api documentation
				});
			});
			// reject on request error
			req.on('error', function (err) {
				// This is not a "Second reject", just a different sort of failure
				reject(err);
			});
			if (postData) {
				req.write(postData);
			}
			// IMPORTANT
			req.end();
		});
	}

	const options = {
		method: 'GET',
		hostname: 'api.openweathermap.org',
		port: null,
		path: `/data/2.5/weather?zip=${zipCode},us&appid=${api_Key}&units=metric`,
		headers: {
			'Content-type': 'application/json'
		}
	};

	const apiResponse = await httpRequest(options)
		.then(function (body) {
			tempFromAPI = body;
			return tempFromAPI;
		})
		.catch((error) => {
			return error;
		});

	//console.log('\n this is API Response', apiResponse);
	return apiResponse;
};
