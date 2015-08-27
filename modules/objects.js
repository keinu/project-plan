module.exports = (function() {

	var HORIZONTAL = 1;
	var VERTICAL = 2;

	var types;

	var getLine = function(orientation, types) {

		var line = document.createElement('div');
			line.classList.add('line');

		if (types) {

			if (typeof types === 'string') {

				types = [types];

			}

			types.forEach(function(type) {

				line.classList.add(type);

			});

		}

		if (orientation === HORIZONTAL) {

			line.classList.add('horizontal');

			return new THREE.CSS3DObject(line);

		}

		if (orientation === VERTICAL) {

			line.classList.add('vertical');

			return new THREE.CSS3DObject(line);

		}

	};

	var getTile = function(options) {

		var element = document.createElement('div');
			element.className = 'element';

		var type = types.find(function(type) {

			if (type.code === options.type) {
				return type;
			}
			return false;

		});

		var end = (new Date(options.end)).getTime();
		var start = (new Date(options.start)).getTime();
		var now = (new Date()).getTime();
		var isPast = now > end;
		var isNow = end > now && start < now;

		if (!type) {
			element.style.backgroundColor = 'hsla(0, 100%, 100%, ' + ( Math.random() * 0.5 + 0.25 ) + ')';
		} else if (isPast) {
			element.style.backgroundColor = "hsl(" + type.color[0] + ", " + type.color[1] + "%, " + (type.color[2] * 0.7) + "%)";
		} else if (isNow) {
			element.style.backgroundColor = "hsl(" + type.color[0] + ", " + 100 + "%, " + type.color[2] + "%)";
		} else {
			element.style.backgroundColor = "hsl(" + type.color[0] + ", " + (type.color[1] * 0.9) + "%, " + type.color[2] + "%)";
		}

		var number = document.createElement( 'div' );
			number.className = 'number';
			number.textContent = options.number || 0;

		element.appendChild(number);

		var symbol = document.createElement( 'div' );
			symbol.className = 'title';
			symbol.textContent = options.title;

		element.appendChild( symbol );

		var details = document.createElement( 'div' );
			details.className = 'description';
			details.innerHTML = options.description;

		element.appendChild( details );

		var tile = new THREE.CSS3DObject( element );

		// Use element.parent to access the CSS3D object
		tile.element.parent = tile;

		return tile;

	};

	var getBox = function(value, type) {

		var colors = ["red", "green", "blue"];

		var	box = new THREE.MeshLambertMaterial({
			color: colors[type],
			shading: THREE.SmoothShading,
			vertexColors: THREE.FaceColors,
			side: THREE.DoubleSide,
			overdraw: 0.5
		});

		var boxGeometry = new THREE.BoxGeometry( 20, 20, 20 );
			boxGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 10 ) );

		var cube = new THREE.Mesh(boxGeometry, box );
			cube.receiveShadow = true;
			cube.castShadow = true;

		cube.scale.z = value / 4;

		return cube;

	};

	var getLabel = function(text, style) {

		var label = document.createElement("span");
			label.className = "label";
			label.innerHTML = text;

		return new THREE.CSS3DObject(label);

	};

	var setTileTypes = function(t) {

		types = t;

	};

	return {

		HORIZONTAL: HORIZONTAL,
		VERTICAL: VERTICAL,
		getLine: getLine,
		getTile: getTile,
		getBox: getBox,
		getLabel: getLabel,
		setTileTypes: setTileTypes

	};

})();