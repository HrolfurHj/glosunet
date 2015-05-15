$(document).ready(function () {
	$.get("/username", function (data) {
		displayData(data[0]);
	});
	
    function displayData(data) {
        var source = $("#some-template").html(); 
		var template = Handlebars.compile(source);
		
		$('#homeName').append(template(data));
    }
	
});