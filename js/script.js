var basePath = "http://192.168.1.72:8080";
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

	var wkouts;
	var pickFrom = function (d) {
		$.each(JSON.parse(d).workouts, function(k,v){
			$("#wkouts").append("<option value=" + v.desc.replace(' ', "_") + ">" + v.desc + "</option>");
		});
	}
	var showLogs = function (d) {
		var logs = $("#loggedWk");
        if (logs.children().length > 0) {
        	logs.children().remove();
        }
		$.each(JSON.parse(d).workouts, function(k,v){
			logs.append("<li>" + v.date.split(' ')[0] + ": " + v.desc + " - "  + v.result);
		});	
		logs.listview("refresh");
	}
    
    var fetchDefinitions = function () {
		$.ajax({
			type: "GET",
			url: "/pick",
			success: function(data) { 
				pickFrom(data)
			}
		});
    };

	var getShowLogs = function () {
		$.ajax({
			type: "GET",
			url: "/show",
			success: function(data) { 
				showLogs(data)
			}
		});	
	};

	window.onhashchange = function() {
		if (location.hash === "#pick"){
			fetchDefinitions();
		}
		if (location.hash === "#show"){
			getShowLogs();
		}
	};

    $("pickLink").live("click", fetchDefinitions);
	$("#showLogs").live("click", getShowLogs);

	window.onload = function() {
		if (location.hash === "#pick"){
			$.ajax({
				type: "GET",
				url: "/pick",
				success: function(data) { 
					pickFrom(data)
				}
			});
		} else {
			$.ajax({
				type: "GET",
				url: basePath + "/getLoginUrl",
				success: function(data) {
					console.log(data);
				}
			});
		}

	};

});


