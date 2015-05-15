$(document).ready(function () {
	
	$.get("/username", function (data) {
		displayData(data[0]);
		getSearch(data[0].id);
	});
	
    function displayData(data) {
        var source = $("#some-template").html(); 
		var template = Handlebars.compile(source);
		
		$('#homeName').append(template(data));
    }
	
	function getSearch(searchID){
		console.log(searchID);
		$.post("/userNotes",{id: searchID}, function (data) {
			var json = $.parseJSON(data);
			displayMe(json);
		});
	}
	
    function displayMe(data) {
        var source = $(".noteTemplate").html();
        var template = Handlebars.compile(source);
		$.each(data, function(index, item) {
			var d = new Date(item.date);
			console.log(d.getDay());
			item.date = d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();
            $(".noteList").append(template(item));
        });
		
		$('.authorList').click(function(){
				$(".oneNote").remove();
				getSearch(this.id);
			});
    }
});