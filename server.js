// npm modules/dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var data = true;

// set up express
// =============================================================
var app = express();
var PORT = 3000;

// set express to handle data parsing 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// empty arrays for reserved table (DATA)
// =============================================================
var tables = [];
var waitList = [];

// Routes
// route that sends the user first to the AJAX Page
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
})

// route that sends user to the reservation page (which has reservation table)
app.get('/reserve', function(req, res){
	res.sendFile(path.join(__dirname, 'reserve.html'));

})

// route that sends user to the table page, which shows all reserved/waitlisted tables
app.get('/tables', function(req, res){
	res.sendFile(path.join(__dirname, 'table.html'));
	
})

// creates JSON object for tables
app.get('/api/tables', function(req, res){	
		res.json(tables);
})

// creates JSON object for reservations
app.get('/api/waitList', function(req, res){	
		res.json(waitList);
})

app.post('/api/tables', function(req, res){
	// console.log(req.body); -- shows the json object
	var newTable = req.body
	newTable.customerID = newTable.customerName.replace(/\s+/g, '').toLowerCase();

	data = arraySelector(newTable, res);
	// console.log(data); -- true/false boolean that controls table/wailist logic (see arraySelector function below);
	res.json(data);
})

app.post('/api/clear', function(req,res){
	tables = [];
	waitlist = [];
})

// tells server to begin listening 
// =============================================================
app.listen(PORT, function(){
	console.log('App listening on PORT ' + PORT);
})

// array selector function that determines table/waitlist posting
function arraySelector(newTable, res){
	if (tables.length >= 5) {
		var wait = newTable;
		waitList.push(wait);
		data = false;
	} else {
		var getASeat = newTable;
		tables.push(getASeat);
	}
	return data;
}

// function to clear tables. non-functional - need to fix
function clearTables() {
	tables = [];
	waitList = [];
	data = true;
};