/******************************************************************************

Input: no parameter is required
Output: json object with the following info of the new inserted point:
		- koordinates latlon
		- treetype
		- tree age
		- tree diameter

This function reads the value of the entered tree, combine it in a json object 
and post it to the server/database

******************************************************************************/
 
function insert_tree() {

	try {
		
		let in_tree = {
					   lat : 50.1586236986, 
					   lon : 8.6274, 
					   treetype : 'Ahorn', 
					   age : 50, 
					   diameter : 4
					   }

		console.log(in_tree);
		
		$.ajax({
            type: "POST",
            url: '/insertTree',
            data: in_tree,
        }).done(function() {});
	
	}
	catch(err) {
		console.log('delivering of the inserted tree data to the server failed!');
	}
	
}



