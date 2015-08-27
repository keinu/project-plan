module.exports = function(startDate) {

	var startsOn = new Date(startDate);
	var day = 86400000; // 1 day worth in milliseconds
	var blockSize = 3; // 1 day = 7 px
	var tilePadding = 10; // 10 px each side
	var rowHeight = 180;

	var dateToAxis = function(date) {

		var startTime = startsOn.getTime();

		var dateTime = (new Date(date)).getTime(); // date in milliseconds

		var offset = dateTime - startTime; // offset in milliseconds since the start

		var offsetDay = offset / day; // number of days since start

		return offsetDay * blockSize;

	};

	var durationToWidth = function(start, end) {

		var startTime = (new Date(start)).getTime(); // date in milliseconds
		var endTime = (new Date(end)).getTime(); // date in milliseconds

		var offset = endTime - startTime; // offset in milliseconds since the start

		var offsetDay = offset / day; // number of days since start

		return offsetDay * blockSize;
	};

	var getTilePosition = function(options) {

		// GEt the raw width;
		var width = durationToWidth(options.start, options.end);

		// offset from the center to left edge
		return {
			x: dateToAxis(options.start) + (width / 2),
			y: - parseInt(options.row) * rowHeight + (rowHeight / 2)
		};

	};


	var getTileWidth = function(options) {

		// Raw width minus padding on each side
		return durationToWidth(options.start, options.end) - (2 * tilePadding);

	};

	var getBoxPosition = function(options, type) {

		var width = getTileWidth(options);

		var position = getTilePosition(options);

		var x;

		switch (type) {

			case 0:
				x = position.x - (width / 2) + tilePadding + 10;
				break;

			case 1:
				x = position.x - (width / 2) + (2 * tilePadding) + 20 + 10;
				break;

			case 2:
				x = position.x - (width / 2) + (3 * tilePadding) + (2 * 20) + 10;
				break;

		}

		var y = position.y + rowHeight / 2 - tilePadding - 20;

		return {
			x: x,
			y: y
		};

	};

	return {

		dateToAxis: dateToAxis,
		getTilePosition: getTilePosition,
		getTileWidth: getTileWidth,
		getBoxPosition: getBoxPosition,

	};

};
