$(document).ready(function () {
	getSearch('all');
	
	// Handler til að ná í glósur af server
	
	function getSearch(searchID){
		console.log(searchID);
		$.post("/loadNotes",{id: searchID}, function (data) {
			var json = $.parseJSON(data);
			displayData(json);
			//displayData(data);
		});
	}
	
    function displayData(data) {
        var source = $(".noteTemplate").html();
        var template = Handlebars.compile(source);
		$.each(data, function(index, item) {
			
			var d = new Date(item.date);
			item.date = d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();
            
			$(".noteList").append(template(item));
        });
		
		$('.authorList').click(function(){
			$(".oneNote").remove();
			getSearch(this.id);
		});
		
		$('.followed').click(function(){
			if($(this).is(':checked')){
				$.post("/followNote",{id: this.id});
			}
			else{
				$.post("/unFollowNote",{id: this.id});
			}
		});
		
		$('.unFollowed').click(function(){
			console.log('unfollowed clicked');
		});
		
		var checkboxes = document.querySelectorAll('input[type=checkbox]')
				$(checkboxes).click(function()
									{for (i = 0; i < checkboxes.length; i++) {
									localStorage.setItem(checkboxes[i].value, checkboxes[i].checked); 
									}
									})
				for (j = 0; j < checkboxes.length; j++) {
				checkboxes[j].checked = localStorage.getItem(checkboxes[j].value) === 'true' ? true:false;
				}
    }
	
	$('#pressSearch').click(function(){
		$(".oneNote").remove();
		var search = $('#search').val();
		getSearch(search);
		console.log(search);
	});
	
});
