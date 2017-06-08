// -----------------------------------------------------------------------
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


// ------------------------------------------------------------------------------
// EXAMPLE: require object to reference to the url: 
// http://localhost:3000/treerequest/....(e.g.trees) => see routes.treerequest.js
const treereq = require('./routes/treerequest');
app.use('/treerequest', treereq);



// ------------------------------------------------------------------------
// EXAMPLE: Do anything through calling an url (http://localhost:3000/baum)

app.get('/baum', function(req, res) {
  //res.send(obje);
  console.log('baum!')
});



// ---------------------------------------------------------
// EXAMPLE: Generate data base connection to postgres

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



// -----------------------------------------------------------------------
// EXAMPLE: Request data through url call (http://localhost:3000/test)
	
app.get('/test', function(req, res) {
  
	try {
		db.result("select * from trees_latlong where gid <= 200", false)
		.then(result => {
			// rowCount = number of rows affected by the query
			res.json(result.rows);
			//res.send('guery was done!')
			console.log(result.rows[0]); // print how many records were deleted;
		})
		.catch(error => {
			console.log('ERROR:', error);
		});
	}
	catch(err) {
		console.log('..../test failed!')
	}
		
});



// ---------------------------------------------------------------------------
// EXAMPLE: Insert single wind data through url call (http://localhost:3000/postWind)

app.post('/postWind', function(req, res) {
	
	try {
		const data = req.body; 
		console.log(data);
		const wind = [data.speed, data.deg];
		

		db.none('INSERT INTO wind_from_service(speed, direction) VALUES($1, $2)', wind)
			.then(() => {
				console.log('success');
			})
			.catch(error => {
				// error;
			});
	}
	catch(err) {
		console.log('..../postWind failed!')
	}
		
});



// ---------------------------------------------------------------------------------
// EXAMPLE: Insert wind datat (speed and direction) every 5 minutes in the database

let insert_interval;
let wind_data_current = [];

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
			
			console.log('speed: ' + wind_data_current[0]);
			console.log('direction: ' + wind_data_current[1]);
			console.log('city: ' + wind_data_current[2]);

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
}
catch(err) {
		console.log('execution of function insert_current_wind failde!')
}

// -------------------------------------------------------------------------------------




console.log('server is running on port 3000!')





