var Jimp = require('jimp');
var math = require('mathjs');

var colors_to_paper = function (image, paperColor, grid) {
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let gridWidth = grid, gridHeight = grid;
	let gridWidthBorder = width%grid, gridHeightBorder = height%grid;
	for (let row = 0; row < width; row += grid) {
		if (row+grid > width) {
			gridWidth = gridWidthBorder;
		}
		for (let col = 0; col < height; col += grid) {
			if (col + grid > height) gridHeight = gridHeightBorder;
			let redTot = 0, greenTot = 0, blueTot = 0;
			image.scan(row, col, gridWidth, gridHeight, function(x, y, idx) {
				let red = this.bitmap.data[idx + 0];
				let green = this.bitmap.data[idx + 1];
				let blue = this.bitmap.data[idx + 2];
				//var alpha = this.bitmap.data[idx + 3];
				redTot += red;
				greenTot += green;
				blueTot += blue;
			});
			let rgbDevi = math.std([[redTot/(gridWidth*gridHeight), greenTot/(gridWidth*gridHeight), blueTot/(gridWidth*gridHeight)]], 1);
			//console.log(rgb_devi); эксперименты с разбросом ргб
			if (rgbDevi > 10) {
				let hex = Jimp.rgbaToInt(paperColor.red, paperColor.green, paperColor.blue, 255);
				for (let i = row; i < row + gridWidth; i++){
					for (let j = col; j < col + gridHeight; j++){
						image.setPixelColor(hex, i, j);
					}
				}
			}
			gridHeight = grid;
		}
	}
}

module.exports = colors_to_paper;
