module.exports = (function() {

	var legend = document.getElementById("details");
	var types;

	var showDetails = function(details) {

		legend.innerHTML = "";

		var type = document.createElement("p");
			type.className = "type";

		var t = types.find(function(type) {

			if (type.code === details.type) {
				return true;
			}

			return false;

		});

		type.innerHTML = t.title;

		legend.appendChild(type);

		var title = document.createElement("h2");
			title.textContent = details.title;

		legend.appendChild(title);

		var description = document.createElement("p");
			description.innerHTML = details.description;

		legend.appendChild(description);



	};

	var showLegend = function() {

		legend.innerHTML = "";

		types.forEach(function(type) {

			var box = document.createElement("div");
				box.className = "box";
				box.style.backgroundColor =  "hsl(" + type.color[0] + ", " + type.color[1] + "%, " + type.color[2] + "%)";

			legend.appendChild(box);

			var title = document.createElement("div");
				title.className = "title";
				title.textContent = type.title;

			legend.appendChild(title);

		});

	};

	var setTypes = function(t) {

		types = t;

	};

	return {
		showDetails: showDetails,
		showLegend: showLegend,
		setTypes: setTypes
	};

})();

