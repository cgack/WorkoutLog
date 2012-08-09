
$(document).ready(function() {

		
	$("#generateWkout").click(function() {
		var wkout = $("#workout").val();
		var logBy = $("#logBy").val();
		var workout = {};
		workout.workout = wkout;
		workout.logBy = logBy;

		$.ajax({
			type: "POST",
			url: "/generate",
			data: workout,
			success: function() {
				$("#workout").val("");
			}
		});
		return false;
	});

	$("#storeWkout").click(function() {
		var wkout = $("#wkouts option:selected").html();
		var result = $("#results").val();
		var date = $("#date").val() + " 00:00:00";
		var workout = {};
		workout.workout = wkout;
		workout.result = result;
		workout.date = date;
		$.ajax({
			type: "POST",
			url: "/store",
			data: workout,
			success: function() {
				location.href = "/";
			}
		});
		return false;
	});


});


