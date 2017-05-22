function postWind() {
	
	let wind = {};
	$.get("http://api.openweathermap.org/data/2.5/weather?q=Frankfurt,de&APPID=6639a27f3eaab1bee8fa943c7a51a302", function(data, status){
        //alert("Data: " + data + "\nStatus: " + status);
		console.log(data.wind);
		wind = data.wind;
		
		$.ajax({
		  type: "POST",
		  url: '/postWind',
		  data: wind
		}).done(function() {console.log('winddata was posted');});
    });
	
	
	
	
}


function getTrees() {
	
	$.get("/test", function(data, status){
        //alert("Data: " + data + "\nStatus: " + status);
		console.log(data);
    });
	
}
