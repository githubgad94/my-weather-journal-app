// Create a new date instance dynamically with JS
let d = new Date();
const newDate = ` ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}.`;
/******************************************** */
const postData = async (url = '', data = {}) => {
	//	console.log('client/app side postData', data);
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		credentials: 'same-origin', // include, *same-origin, omit
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	try {
		const newData = await response.json();
		//console.log(newData);
		return newData;
	} catch (error) {
		//console.log('error', error);
	}
};
/******************************************************/
const getData = async (url) => {
	const res = await fetch(url);
	try {
		const data = await res.json();
		//	console.log(data);
		return data;
	} catch (error) {
		// appropriately handle the error
	}
};
/*************************************************** */
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
	let zipCodeEntry = document.getElementById('zip').value;
	function validateZipCode(zipCodeEntry) {
		var zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
		if (zipCodePattern.test(zipCodeEntry)) {
			return zipCodeEntry;
		} else {
			alert('no valid zip code provided');
			return 'not a valid zip code!!';
		}
	}
	let zipCode = validateZipCode(zipCodeEntry);
	let userResponse = document.getElementById('feelings').value;
	postData('/newEntry', {
		zipCode: zipCode,
		date: newDate,
		userResponse: userResponse
	})
		.then(() => {
			// message for debugging.
			console.log('newEntry data was sent to server side ');
		})
		.then(updateUI);
}
/************************************************************ */
const updateUI = async () => {
	const request = await fetch('/all');
	try {
		const allData = await request.json();
		console.log(`data received from server :-\n `, allData);
		document.getElementById('date').textContent = allData.date;
		document.getElementById('temp').textContent = allData.temperature;
		document.getElementById('content').textContent = allData.userResponse;
	} catch (error) {
		console.log('error', error);
	}
};
/***************************************************** */
