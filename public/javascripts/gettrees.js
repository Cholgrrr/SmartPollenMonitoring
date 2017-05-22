$.get( "/test", function( data ) {
  $( ".result" ).html( data );
  alert( "Load was performed." );
});