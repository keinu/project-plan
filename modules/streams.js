var objects = require("./objects.js");

module.exports =  (function() {

	var createStraam = function(streams, scene) {

		var i = 0;
		streams.forEach(function(stream) {

			var element = createRowHeader(i++, stream.title, "in");
			var header = new THREE.CSS3DObject(element);
				header.position.y = - (i * 180) + 80 + 2;
				header.position.x = - 300;

			scene.add(header);

			var element = createRowHeader(i, stream.outcome, "out");
			var header = new THREE.CSS3DObject(element);
				header.position.y = - (i * 180) + 80 + 2;
				header.position.x = 4000;

			scene.add(header);

		});

	};

	var createRowHeader = function(row, label, type) {

		var header = document.createElement("div");
			header.classList.add("row", "header", type);

		var labelTag = document.createElement("span");
			labelTag.innerHTML = label;

			header.appendChild(labelTag);

		return header;

	};

	return {

		createStraam: createStraam

	};

})();
