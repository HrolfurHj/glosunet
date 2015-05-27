$(document).ready(function () {
	var followed = [];
	
	// Birta username í header
	$.get("/username", function (data) {
		displayData(data[0]);
	});
	
    function displayData(data) {
		followed = data.followed;
		console.log(followed);
        var source = $("#some-template").html(); 
		var template = Handlebars.compile(source);
		
		$('#homeName').append(template(data));
    }
	
});