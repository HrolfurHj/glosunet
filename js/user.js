$(document).ready(function () {
	
	
	// Handler fyrir notanda
	$.get("/username", function (data) {
		$.post("/loadNotes",{id: data[0].id}, function (dataTwo) {
			displayUser(data[0]);
			displayData(dataTwo[0]);
		});
	});
	
	function displayUser(data) {
		var source = $(".userTemplate").html(); 
		var template = Handlebars.compile(source);
		
		$('#user').append(template(data));
	}
	
    function displayData(data) {
        var source = $(".noteTemplate").html(); 
		var template = Handlebars.compile(source);
		
		$('.noteList').append(template(data));
    }
});