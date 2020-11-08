var Jimp = require('jimp');
var math = require('mathjs');

var img_color_data = function (image) {
	var redImg = [], greenImg = [], blueImg = [];
	var bitDevs = [];
	for (let i = 0; i < image.bitmap.width; i++) {
		bitDevs.push([]);
	}
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
		let red = this.bitmap.data[idx + 0];
		let green = this.bitmap.data[idx + 1];
		let blue = this.bitmap.data[idx + 2];
		redImg.push(red);
		greenImg.push(green);
		blueImg.push(blue);
		bitDevs[x][y] = {
			'redGreenStd':Math.sqrt((red*red)/(red*red+green*green+blue*blue)),
			'redBlueStd':Math.sqrt((green*green)/(red*red+green*green+blue*blue)),
			'blueGreenStd':Math.sqrt((blue*blue)/(red*red+green*green+blue*blue))
		};
	});
	let area = image.bitmap.width*image.bitmap.height;
	var imgDevs = {
		'red': Math.floor(math.sum(redImg)/area),
		'green': Math.floor(math.sum(greenImg)/area),
		'blue': Math.floor(math.sum(blueImg)/area),
		'redGreenStd':math.std([redImg],1),
		'redBlueStd':math.std([greenImg],1),
		'blueGreenStd':math.std([blueImg],1)
	};
	//console.log(imgDevs);
	return {
		'bitDevs': bitDevs,
		'imgDevs': imgDevs
		};
}

module.exports = img_color_data;
