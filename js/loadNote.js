$(document).ready(function () {
	console.log('id: ' + id)
    $.post("/loadNote", id, function (data) {
		console.log('Data: ' + data);
        var json = $.parseJSON(data);
        displayData(json);
    });

    function displayData(data) {
        var source = $(".noteTemplate").html();
        var template = Handlebars.compile(source);
		$(".noteWrap").html(template(data));
    }
});