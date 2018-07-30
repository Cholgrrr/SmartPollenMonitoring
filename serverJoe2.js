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
app.listen(process.env.PORT || 3000);




// -------------------------------------------------------------
// Generation data base connection to postgres NASAWIND database

const pgp = require('pg-promise')({
    // Initialization Options 
});

const connection = {

  user: 'postgres', 																		// name of the user account
  database: 'NASAWIND_2', 																	// name of the database
  password: 'password', 																	// env var: PGPASSWORD 
  host: 'localhost', 				// Server hosting the postgres database (host: '35.187.21.114')
  port: 5432, 																				// env var: PGPORT 
  max: 10, 																					// max number of clients in the pool
  idleTimeoutMillis: 30000 																	// how long a client is allowed to remain idle before being closed

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
		
		db.result("SELECT speed, direction, in_date from wind_from_service WHERE city = 'Frankfurt' order by wind_from_service.in_date desc limit 1;", false)
		.then(result => {
			res.json(result.rows);
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
app.get('/histWindNY', function(req, res) {
	const data = req.body;
	try {
		
		db.result("SELECT speed, direction from wind_hist_test WHERE city = 'newyork' AND "  + data[0] + " ;", false)
		.then(result => {
			res.json(result.rows);
		})
		.catch(error => {
			console.log('ERROR:', error);
		});
		console.log('.../histWind successful!');
	}
	
	catch(err) {
		console.log('.../histWind failed!\n' + err);
	}
		
});
app.get('/currentWindNY', function(req, res) {
  
	try {
		
		db.result("SELECT speed, direction, in_date from wind_from_service WHERE city = 'New York' order by wind_from_service.in_date desc limit 1;", false)
		.then(result => {
			res.json(result.rows);
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

app.post('/getWindHist', function (req, res) {
 
    try {
		
        const data = req.body;
		
		// set the month
		let month = data[Object.keys(data).length-1];
 
		let query_string = "select speed, direction "; 
		query_string += " from wind_hist where city = '" + data[1] + "' AND (month='" + data[0] + "'";
		query_string += ");";  
		console.log(query_string)
		// request the data 
		db.result(query_string)
		.then(result => {
			res.json(result.rows);
		})
		.catch(error => {
			console.log('ERROR:', error);
		});			
		console.log('.../getWindHistFFM successful!');
    }
	
    catch (err) {
        console.log('.../getWindHistFFM failed!\n' + err);
    }

}); 

// -------------------------------------------------------------------------------------------
// Select the trees, which were filtered through the multi tree selection in the current view

app.post('/postTreeType', function (req, res) {

    try {
		
        const data = req.body;
		if (Object.keys(data).length > 0) { 
			
			//generate the query string
			let query_string = "select lat, lon, treetype from trees_latlon where ";
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
		
		// request the data 
		db.result("INSERT INTO trees_latlon(lat, lon, treetype, age, diameter) VALUES($1, $2, $3, $4, $5)", input_tree)
		.then(result => {
			res.json(result.rows);

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




// ----------------------------------------------------------
// Get blooming data according to the month and the tree type
// delivers an object with the selected treetypes 
// and their corresponding blooming value for the current month
// month in format integer mm

app.post('/getBlooming', function (req, res) {
 
    try {
		
        const data = req.body;
		
		// set the month
		let month;
		if (data[Object.keys(data).length-1] === '01') {
			month = 'jan';
		}
		else if (data[Object.keys(data).length-1] === '02') {
			month = 'feb';
		}
		else if (data[Object.keys(data).length-1] === '03') {
			month = 'mar';
		}
		else if (data[Object.keys(data).length-1] === '04') {
			month = 'apr';
		}
		else if (data[Object.keys(data).length-1] === '05') {
			month = 'may';
		}
		else if (data[Object.keys(data).length-1] === '06') {
			month = 'jun';
		}
		else if (data[Object.keys(data).length-1] === '07') {
			month = 'jul';
		}
		else if (data[Object.keys(data).length-1] === '08') {
			month = 'aug';
		}
		else if (data[Object.keys(data).length-1] === '09') {
			month = 'sep';
		}
		else if (data[Object.keys(data).length-1] === '10') {
			month = 'okt';
		}
		else if (data[Object.keys(data).length-1] === '11') {
			month = 'nov';
		}
		else if (data[Object.keys(data).length-1] === '12') {
			month = 'dez';
		}
		else {
			month = 'aug';
		}
 
		let query_string = "select tree_type, " + month + ' as month'; 
		query_string += " from tree_blooming where (tree_type='" + data[0] + "'";
		for (i = 1; i < Object.keys(data).length-1; i++) {
			query_string += (" or tree_type=" + "'" + data[i] + "'");
		}
		query_string += ");"; 
		
		// request the data 
		db.result(query_string)
		.then(result => {
			res.json(result.rows);

		})
		.catch(error => {
			console.log('ERROR:', error);
		});			
		console.log('.../getBlooming successful!');
    }
	
    catch (err) {
        console.log('.../getBlooming failed!\n' + err);
    }

});




// ----------------------------------------------------------
// Get blooming data according to the month and the tree type
// delivers an object with the selected treetypes 
// and their corresponding blooming value for the current month
// month in format string sss

app.post('/getBloomingHist', function (req, res) {
 
    try {
		
        const data = req.body;
		
		// set the month
		let month = data[Object.keys(data).length-1];
 
		let query_string = "select tree_type, " + month + ' as month'; 
		query_string += " from tree_blooming where (tree_type='" + data[0] + "'";
		for (i = 1; i < Object.keys(data).length-1; i++) {
			query_string += (" or tree_type=" + "'" + data[i] + "'");
		}
		query_string += ");";  
		
		// request the data 
		db.result(query_string)
		.then(result => {
			res.json(result.rows);
		})
		.catch(error => {
			console.log('ERROR:', error);
		});			
		console.log('.../getBloomingStr successful!');
    }
	
    catch (err) {
        console.log('.../getBloomingStr failed!\n' + err);
    }

}); 




// -----------------------------------------------------------
// Get blooming data for the selected tree types for all month

app.post('/getBloomingAll', function (req, res) {
 
    try {
		
        const data = req.body;
		
		let query_string = "select * from tree_blooming where (tree_type='" + data[0] + "'"; 
		for (i = 1; i < Object.keys(data).length; i++) {
			query_string += (" or tree_type=" + "'" + data[i] + "'");
		}
		query_string += ");"; 
		
		// request the data 
		db.result(query_string)
		.then(result => {
			res.json(result.rows);
		})
		.catch(error => {
			console.log('ERROR:', error);
		});			
		console.log('.../getBloomingAll successful!');
    }
	
    catch (err) {
        console.log('.../getBloomingAll failed!\n' + err);
    }

});





// -------------------------------------------
// Request route standard (without tree avoid)
	
// http://localhost:8081/routeStandard

app.post('/routeStandard', function (req, res) {
 
    try {
		
		const data = req.body;
		console.log("routeStandard Body:");
		console.log(req.body); 
		
		let query_string = "select id, round(y_coord::numeric, 8) lat, round(x_coord::numeric, 8) lon from get_route_standard('-73.99052', '40.60468', '-74.00175', '40.62804')"; 
		
		// request the data 
		db.result(query_string)
		.then(result => {
			res.json(result.rows);
		})
		.catch(error => {
			console.log('ERROR:', error);
		});			
		console.log('.../getBloomingAll successful!');
    }
	
    catch (err) {
        console.log('.../getBloomingAll failed!\n' + err);
    }

});








// ------------------------------------------------------------------------
// Insert wind datat (speed and direction) every 5 minutes in the database

let insert_interval;
let wind_data_current = [];
let wind_data_currentny = [];

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
					console.log('->  wind data were inserted!');
				})
				.catch(error => {
					// error;
				});
		}
	})
	request('http://api.openweathermap.org/data/2.5/weather?id=5128638&APPID=6639a27f3eaab1bee8fa943c7a51a302', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			wind_data_currentny[0] = body.wind.speed;
			wind_data_currentny[1] = body.wind.deg;
			wind_data_currentny[2] = body.name;
			
			db.none('INSERT INTO wind_from_service(speed, direction, city) VALUES($1, $2, $3)', wind_data_currentny)
				.then(() => {
					console.log('->  wind data NY were inserted!');
				})
				.catch(error => {
					// error;
					console.log("error NY!!")
				});
		}
	})
 
}


try {
	insert_current_wind();
	
}
catch(err) {
	console.log('->  Update of wind data successful!\n' + err);
}





// -----------------
// Server runs info

console.log('server Jojoe is running on port 3000!');




