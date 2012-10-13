
		$(document).one("pageinit", function() {

				
		$("#generateWkout").on("vclick", function() {
				var wkout = $("#workout").val();
				var logBy = $("#logBy").val();
				var workout = {};
				workout.workout = wkout;
				workout.logBy = logBy;

				$.ajax({
					type: "GET",
					url: "/define",
					data: workout,
					success: function() {
						$("#workout").val("");
						$("#wkouts").append("<option value='" + workout.workout + "'> " + workout.workout + "</option>");
					}
				});
				return false;
			});
		
			$("#storeWkout").on( "vclick", function() {
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
						//location.href = "/";
						var li = "<li class='well'><h3>" + wkout + "</h3><p>" + result + "</p><p class='ui-li-aside'>" + date + "</p></li>";
						$("#loggedWk").prepend(li);
						$("#loggedWk").listview("refresh");
						$.mobile.changePage("#history");
					}
				});
				return false;
			});


		});
