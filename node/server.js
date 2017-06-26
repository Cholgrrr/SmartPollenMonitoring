// ----------------------------------------------------
// required variables, dependencies and initialisation 

const http = require('http');
const fs = require('fs');
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
const request = require('ajax-request');

app.use(express.static('public'));
app.listen(3000);


// --------------------------------------------
// Generation data base connection to postgres

const pgp = require('pg-promise')({
    // Initialization Options 
});

const connection = {
  user: 'postgres', 			// name of the user account
  database: 'NASAWIND', 		// name of the database
  password: 'postgres', 		// env var: PGPASSWORD 
  host: 'localhost', 			// Server hosting the postgres database 
  port: 5432, 					// env var: PGPORT 
  max: 10, 						// max number of clients in the pool
  idleTimeoutMillis: 30000 		// how long a client is allowed to remain idle before being closed
}

const db = pgp(connection);
console.log('successful connected to DB: NASAWIND!')


// -----------------------------------
// Request tree data (simple / single)
	
app.get('/treeLoad', function(req, res) {
  
	try {
		db.result("select * from trees_latlon where gid <= 100", false)
		.then(result => {
			// rowCount = number of rows affected by the query
			res.json(result.rows);
			//res.send('guery was done!')
			console.log(result.rows[0]); // print how many records were deleted;
		})
		.catch(error => {
			console.log('ERROR:', error);
		});
		console.log('.../treeLoad successful!')
	}
	catch(err) {
		console.log('.../treeLoad failed!\n' + err);
	}
		
});


// -----------------------------
// Select the current wind datat 

app.get('/currentWind', function(req, res) {
  
	try {
		
		db.result("SELECT speed, direction, in_date from wind_from_service order by wind_from_service.in_date desc limit 1;", false)
		.then(result => {
			// rowCount = number of rows affected by the query
			res.json(result.rows);
			//res.send('guery was done!')
			console.log(result.rows); // print how many records were deleted;
		})
		.catch(error => {
			console.log('ERROR:', error);
		});
		console.log('.../currentWind successful!');
	}
	
	catch(err) {
		console.log('.../currentWind failed!\n' + err);
	}
		
});


// -------------------------------------------------------------------------------------------
// Select the trees, which were filtered through the multi tree selection in the current view

app.post('/postTreeType', function (req, res) {
    console.log('angekommen')
    try {
		
        const data = req.body;
		if (Object.keys(data).length > 0) { 
			
			//generate the query string
			let query_string = "select lat, lon from trees_latlon where ";
			query_string += ("lat>" + data[0] + " and lat<" + data[1] + " and lon>" + data[2] + " and lon< " + data[3]);
			query_string += " and (";
			query_string += ("treetype=" + "'" + data[4] + "'");
			for (i = 5; i < Object.keys(data).length; i++) {
				query_string += (" or treetype=" + "'" + data[i] + "'");
			}
			query_string += ");"; 

			db.result(query_string)
			.then(result => {
				res.json(result.rows);
			})
			.catch(error => {
				console.log('ERROR:', error);
			});
			console.log('.../postTreeData successful!')	
		}
    
	}
    catch (err) {
        console.log('.../postTreeData failed!\n' + err);
    }

});


// ----------------------------------------------------------------------
// Select the trees, which were filtered through the multi tree selection
app.post('/insertTree', function (req, res) {
 
    try {
		
        const data = req.body;
        
		input_tree = [];
		input_tree[0] = data.lat;
		input_tree[1] = data.lon;
		input_tree[2] = data.treetype;
		input_tree[3] = data.age;
		input_tree[4] = data.diameter;
		console.log(input_tree);
		
		// request the data 
		db.result("INSERT INTO trees_latlon(lat, lon, treetype, age, diameter) VALUES($1, $2, $3, $4, $5)", input_tree)
		.then(result => {
			res.json(result.rows);
			//console.log(result.rows)
		})
		.catch(error => {
			console.log('ERROR:', error);
		});			
		console.log('.../insertTree successful!');
    }
	
    catch (err) {
        console.log('.../insertTree failed!\n' + err);
    }

});


// ------------------------------------------------------------------------
// Insert wind datat (speed and direction) every 5 minutes in the database

let insert_interval;
let wind_data_current = [];

// insert all 3 minutes new wind data
function insert_current_wind() {
    insert_interval = setInterval(insertFunc, 30000);
}

function insertFunc() {
  
	request('http://api.openweathermap.org/data/2.5/weather?q=Frankfurt,de&APPID=6639a27f3eaab1bee8fa943c7a51a302', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			wind_data_current[0] = body.wind.speed;
			wind_data_current[1] = body.wind.deg;
			wind_data_current[2] = body.name;

			db.none('INSERT INTO wind_from_service(speed, direction, city) VALUES($1, $2, $3)', wind_data_current)
				.then(() => {
					console.log('wind data were inserted!');
				})
				.catch(error => {
					// error;
				});
		}
	})
 
}

try {
	insert_current_wind();
	console.log('Update of wind data successful!');
}
catch(err) {
		console.log('Update of wind data successful!\n' + err);
}



// -----------------
// Server runs info
console.log('server is running on port 3000!');





