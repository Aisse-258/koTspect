var Jimp = require('jimp');
var math = require('mathjs');

var img_color_data = function (image) {
	var redImg = 0, greenImg = 0, blueImg = 0;
	var bitDevs = [];
	for (let i = 0; i < image.bitmap.width; i++) {
		bitDevs.push([]);
	}
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
		let red = this.bitmap.data[idx + 0];
		let green = this.bitmap.data[idx + 1];
		let blue = this.bitmap.data[idx + 2];
		redImg += red;
		greenImg += green;
		blueImg += blue;
		bitDevs[x][y] = {
			'redGreenStd':math.std([[red,green]],1),
			'redBlueStd':math.std([[red,blue]],1)
		};
	});
	let area = image.bitmap.width*image.bitmap.height;
	var imgDevs = {
		'red': Math.floor(redImg/area),
		'green': Math.floor(greenImg/area),
		'blue': Math.floor(blueImg/area),
		'redGreenStd':math.std([[Math.floor(redImg/area),Math.floor(greenImg/area)]],1),
		'redBlueStd':math.std([[Math.floor(redImg/area),Math.floor(blueImg/area)]],1)
	};
	//console.log(imgDevs);
	return {
		'bitDevs': bitDevs,
		'imgDevs': imgDevs
		};
}

module.exports = img_color_data;
