$(document).ready(function () {
	getSearch('all');
	
	function getSearch(searchID){
		console.log(searchID);
		$.post("/loadNotes",{id: searchID}, function (data) {
			console.log('post loadnotes');
			var json = $.parseJSON(data);
			console.log(json);
			displayData(json);
			//displayData(data);
		});
	}
	
    function displayData(data) {
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
	
	$('#pressSearch').click(function(){
			$(".oneNote").remove();
			var search = $('#search').val();
			getSearch(search);
			console.log(search);
		});
	
});