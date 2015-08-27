
var camera, scene, CSSrenderer, GLrenderer, glScene;
var controls;

var tiles = [], cubes = [];
var iniTiles = [], iniCubes = [];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var data;
var xhr = new XMLHttpRequest();
	xhr.addEventListener('load', function() {

		data = JSON.parse(this.responseText);

		objects.setTileTypes(data.types);

		legend.setTypes(data.types);

		init();

		animate();

	});
	xhr.open("get", "data.json");
	xhr.send();


var scale = require("./modules/scale.js")("2014-10-01");

var objects = require("./modules/objects.js");

var streams = require("./modules/streams.js");

var legend = require("./modules/legend.js");

var initial = {
	target: {
		x: 2000,
		y: -1000,
		z: 0
	},
	camera: {
		x: 2000,
		y: -1000,
		z: 5000
	}
};

function createGLScene() {

	glScene = new THREE.Scene();

	GLrenderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

	GLrenderer.setSize( window.innerWidth, window.innerHeight );
	GLrenderer.setPixelRatio( window.devicePixelRatio );
	GLrenderer.setClearColor(0x000000, 0);
	GLrenderer.domElement.style.position = "absolute";
	GLrenderer.domElement.style.top = 0;
	GLrenderer.domElement.style.zIndex = 0;


	document.getElementById( 'container' ).appendChild( GLrenderer.domElement );

	var light = new THREE.AmbientLight( 0x4c4c4c ); // soft white light

	glScene.add( light );

	var light = new THREE.PointLight( 0xffffff, 1, 0);
	    light.position.set(3000, -3000, 3000);

    glScene.add(light);

}

function createCSSScene() {

	scene = new THREE.Scene();

	CSSrenderer = new THREE.CSS3DRenderer({alpha: true, antialias: true});
	CSSrenderer.setSize( window.innerWidth, window.innerHeight );
	// CSSrenderer.setPixelRatio( window.devicePixelRatio );
	CSSrenderer.domElement.style.position = 'absolute';
	CSSrenderer.domElement.style.top = 0;
	CSSrenderer.domElement.className = "DOMContainer";
	document.getElementById( 'container' ).appendChild( CSSrenderer.domElement );

}

function setControls() {

	controls = new THREE.OrbitControls( camera, CSSrenderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = initial.camera.z;
	controls.autoRotate = false;
	controls.minAzimuthAngle = - Math.PI / 4 + .2; // radians
	controls.maxAzimuthAngle = Math.PI / 4 - .2; // radians

	controls.minPolarAngle = Math.PI / 2; // radians
	controls.maxPolarAngle = Math.PI - .4; // radians

	controls.target.x = initial.target.x;
	controls.target.y = initial.target.y;

	controls.addEventListener( 'change', render );

}

function createTimeline() {

	// var line = objects.getLine(objects.HORIZONTAL, "thickest");
	// 	line.position.y = 0;
	// scene.add(line);

	// var line = objects.getLine(objects.VERTICAL, "thickest");
	// 	line.position.x = 0;
	// scene.add(line);

	var createMarker = function(date) {

		var label;

		if (date.getMonth() === 0 && date.getDate() === 1) { // first of jan

			line = objects.getLine(objects.VERTICAL, "thick");
			label = objects.getLabel(months[date.getMonth()] + " " + date.getFullYear());

		} else if (date.getMonth() === 6 && date.getDate() === 1) { // first of July

			line = objects.getLine(objects.VERTICAL, ["thickest", "mid"]);
			label = objects.getLabel(months[date.getMonth()] + " " + date.getFullYear());

		} else if (date.getDay() === 1) { // every monday

			line = objects.getLine(objects.VERTICAL);

		} else {

			return;

		}

		line.position.x = scale.dateToAxis(date);
		line.position.z = -10;

		if (label) {

			label.position.x = scale.dateToAxis(date);
			label.position.y = 40;
			scene.add(label);

		}

		scene.add(line);

	};

	var startDate = new Date(2014, 6, 1);
	var movingDate = new Date(2014, 6, 1);

	for (var i = 0; i < 1300; i++) {

		movingDate.setDate(movingDate.getDate() + 1);
		createMarker(movingDate);

	}

	streams.createStraam(data.streams, scene);

}


function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.x = initial.camera.x;
	camera.position.y = initial.camera.y;
	camera.position.z = initial.camera.z;

	createCSSScene();

	createGLScene();

	setControls();

	createTiles();

	createTimeline();

	render();

	legend.showLegend();

	window.addEventListener("resize", onWindowResize, false );

	document.addEventListener("dblclick", function(e) {

		legend.showLegend();

		e.preventDefault();
		new TWEEN.Tween( camera.position )
			.to( {
				x: initial.camera.x,
				y: initial.camera.y,
				z: initial.camera.z
			}, 2000 )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( controls.target )
			.to( {
				x: initial.target.x,
				y: initial.target.y,
				z: initial.target.z
			}, 2000 )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( controls.object.up )
			.to( {
				x: 0,
				y: 1,
				z: 0
			}, 2000 )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( this )
			.to( {}, 1000 )
			.onUpdate( render )
			.start();

	});



}


function createTiles() {

	data.tiles.forEach(function(params) {

		var tilePosition = scale.getTilePosition(params);

		var tile = objects.getTile(params);
			tile.element.style.width = scale.getTileWidth(params) + "px";
			tile.position.x = tilePosition.x;
			tile.position.y = tilePosition.y;

			tile.element.addEventListener("click", function(e) {

				e.preventDefault();
				e.stopPropagation();

				legend.showDetails(params);

				new TWEEN.Tween( camera.position )
					.to( {
						x: this.parent.position.x,
						y: this.parent.position.y - 200,
						z: this.parent.position.z + 200
					}, 2000 )
					.easing( TWEEN.Easing.Exponential.InOut )
					.start();

				new TWEEN.Tween( controls.object.up )
					.to( {
						x: 0,
						y: 1,
						z: 0
					}, 2000 )
					.easing( TWEEN.Easing.Exponential.InOut )
					.start();

				new TWEEN.Tween( controls.target )
					.to( {
						x: this.parent.position.x,
						y: this.parent.position.y,
						z: this.parent.position.z
					}, 2000 )
					.easing( TWEEN.Easing.Exponential.InOut )
					.start();

				return false;

			});

		scene.add(tile);

		var box = objects.getBox(params.value[0].environmental, 0);
			box.position.x = scale.getBoxPosition(params, 0).x;
			box.position.y = scale.getBoxPosition(params, 0).y;

		glScene.add(box);

		box = objects.getBox(params.value[1].human, 1);
		box.position.x = scale.getBoxPosition(params, 1).x;
		box.position.y = scale.getBoxPosition(params, 1).y;

		glScene.add(box);

		box = objects.getBox(params.value[2].economical, 2);
		box.position.x = scale.getBoxPosition(params, 2).x;
		box.position.y = scale.getBoxPosition(params, 2).y;

		glScene.add(box);

	});

}

function transform( objects, targets, duration ) {

	//TWEEN.removeAll();

	for ( var i = 0; i < targets.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	CSSrenderer.setSize( window.innerWidth, window.innerHeight );
	GLrenderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();

	controls.update();

}

function render() {

	GLrenderer.render( glScene, camera );
	CSSrenderer.render( scene, camera );

}






// Polyfill
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}