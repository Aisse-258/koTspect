var Jimp = require('jimp');
var math = require('mathjs');
var divide_side = require('./divide_side.js');

var img_color_data = function (image, heightDivide, widthDivide) {
	var width = image.bitmap.width;
	var height = image.bitmap.height;
	var widthDecile = Math.floor(width*0.1);
	var heightDecile = Math.floor(height*0.1);
	var imgDevs = [];
	for (let i = 0;i < heightDivide;i++) {
		imgDevs.push([]);
	}
	var widthPoints = divide_side(width, widthDivide);
	var heightPoints = divide_side(height, heightDivide);
	for (let w = 1; w < widthDivide+1; w++) {
		for (let h = 1; h < heightDivide+1; h++){
			var redImg = [], greenImg = [], blueImg = [];
			image.scan(widthPoints[w-1], heightPoints[h-1], widthPoints[w], heightPoints[h], function(x, y, idx) {
				let red = this.bitmap.data[idx + 0];
				let green = this.bitmap.data[idx + 1];
				let blue = this.bitmap.data[idx + 2];
				if (y >= heightDecile && y < height - heightDecile && x >= widthDecile && x < width - widthDecile) {
					redImg.push(red);
					greenImg.push(green);
					blueImg.push(blue);
				}
			});
			let area = redImg.length;
			let r = heightPoints[h-1]/heightPoints[1];
			let c = widthPoints[w-1]/widthPoints[1];
			imgDevs[r][c] = {
				'red': Math.floor(math.sum(redImg)/area),
				'green': Math.floor(math.sum(greenImg)/area),
				'blue': Math.floor(math.sum(blueImg)/area),
				'redStd':math.std([redImg],1)[0],
				'greenStd':math.std([greenImg],1)[0],
				'blueStd':math.std([blueImg],1)[0]
			};
			//console.log(imgDevs[r][c].redStd);
		}
	}

	//console.log(imgDevs);
	return {
		'imgDevs': imgDevs
	};
}

module.exports = img_color_data;
