$(document).ready(function () {
	
	// Handlebars handler fyrir heimasíðu
	
	// Ná í notendanafn og glósur
	$.get("/username", function (data) {
		displayData(data[0]);
		getSearch(data[0].id);
		getSearchF(data[0].following);
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
	
	function getSearchF(searchID){
		$.post("/userFollowed", {id: searchID}, function(data) {
			var json = $.parseJSON(data);
			displayFollow(json);
		});
	}
	
    function displayMe(data) {
        var source = $(".noteTemplate").html();
        var template = Handlebars.compile(source);
		$.each(data, function(index, item) {
			var d = new Date(item.date);
			console.log(d.getDay());
			item.date = d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();
            $(".myNoteList").append(template(item));
        });
		
		$('.authorList').click(function(){
			$(".oneNote").remove();
			getSearch(this.id);
		});
    }
	
	function displayFollow(data){
		var source = $(".FNoteTemplate").html();
        var template = Handlebars.compile(source);
		
		$.each(data, function(index, item) {
			var d = new Date(item.date);
			console.log(d.getDay());
			item.date = d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();
			$(".savedNoteList").append(template(item));
        });
		
		$('.authorList').click(function(){
			$(".oneNote").remove();
			getSearch(this.id);
		});
		
		$('.throw').click(function(){
			console.log('throw clicked');
			$.post("/unFollowNote",{id: this.id});
			$( this ).parent().remove();
		});
	}
});