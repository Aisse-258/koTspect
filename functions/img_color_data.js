var Jimp = require('jimp');
var math = require('mathjs');

var img_color_data = function (image, heightDivide, widthDivide) {
	var width = image.bitmap.width;
	var height = image.bitmap.height;
	var widthDecile = Math.floor(width*0.1);
	var heightDecile = Math.floor(height*0.1);
	var borderHeight = height%heightDivide;
	var gridHeight = (height - borderHeight)/heightDivide;
	var borderWidth = width%widthDivide;
	var gridWidth = (width - borderWidth)/widthDivide;
	var imgDevs = [];
	for (let i = 0;i < heightDivide;i++) {
		imgDevs.push([]);
	}
	for (let row = 0; row < height; row += gridHeight) {
		var r = row/gridHeight;
		if (row + 2*gridHeight > height) {
			gridHeight += borderHeight;
		}
		for(let col = 0; col < width; col += gridWidth) {
			var c = col/gridWidth;
			if (col + 2*gridWidth > height) {
				gridWidth += borderWidth;
			}
			var redImg = [], greenImg = [], blueImg = [];
			image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
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
			imgDevs[r][c] = {
				'red': Math.floor(math.sum(redImg)/area),
				'green': Math.floor(math.sum(greenImg)/area),
				'blue': Math.floor(math.sum(blueImg)/area),
				'redStd':math.std([redImg],1),
				'greenStd':math.std([greenImg],1),
				'blueStd':math.std([blueImg],1)
			};
		}
		gridWidth -= borderWidth;
	}
	gridHeight -= borderHeight;
	//console.log(imgDevs);
	return {
		'imgDevs': imgDevs
		};
}

module.exports = img_color_data;
