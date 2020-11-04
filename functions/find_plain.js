var Jimp = require('jimp');
var math = require('mathjs');

var find_plain = function (image, grid, maxStd) {
	var rowPlains = [], colPlains = [];
	var redTot = 0, greenTot = 0, blueTot = 0;
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	for (let row = 0; row < width; row += grid) {
		let redData = [], greenData = [], blueData = [];
		image.scan(row, 0, grid, height, function(x, y, idx) {
			let red = this.bitmap.data[idx + 0];
			let green = this.bitmap.data[idx + 1];
			let blue = this.bitmap.data[idx + 2];
			//var alpha = this.bitmap.data[idx + 3];
			redTot += red;
			greenTot += green;
			blueTot += blue;
			redData.push(red);
			greenData.push(green);
			blueData.push(blue);
				
		});
		let devi = math.std([redData, greenData, blueData], 1);
		//console.log(devi);
		if (devi[0] < maxStd && devi[1] < maxStd && devi[2] < maxStd){
			rowPlains.push(row);
			/*let hex = Jimp.rgbaToInt(255, 255, 255, 255);
			for (let i = row; i < row + grid; i++){
				for (let j = 0; j < height; j++){
					image.setPixelColor(hex, i, j);
				}
			}*/
		}
		redTot = 0;
		greenTot = 0;
		blueTot = 0;
	}
	for (let col = 0; col < height; col += grid) {
		let redData = [], greenData = [], blueData = [];
		image.scan(0, col, width, grid, function(x, y, idx) {
			let red = this.bitmap.data[idx + 0];
			let green = this.bitmap.data[idx + 1];
			let blue = this.bitmap.data[idx + 2];
			//var alpha = this.bitmap.data[idx + 3];
			redTot += red;
			greenTot += green;
			blueTot += blue;
			redData.push(red);
			greenData.push(green);
			blueData.push(blue);
				
		});
		let devi = math.std([redData, greenData, blueData], 1);
		//console.log(devi);
		if (devi[0] < maxStd && devi[1] < maxStd && devi[2] < maxStd){
			colPlains.push(col);
			/*let hex = Jimp.rgbaToInt(255, 255, 255, 255);
			for (let i = 0; i < width; i++){
				for (let j = col; j < col + grid; j++){
					image.setPixelColor(hex, i, j);
				}
			}*/
		}
		redTot = 0;
		greenTot = 0;
		blueTot = 0;
	}
	//console.log(rowPlains, colPlains);
	for (let i = 0; i < rowPlains.length; i++){
		image.scan(rowPlains[i], 0, grid, height, function(x, y, idx) {
			this.bitmap.data[idx + 0] = 255;
			this.bitmap.data[idx + 1] = 255;
			this.bitmap.data[idx + 2] = 255;
		});
	}
	for (let i = 0; i < colPlains.length; i++){
		image.scan(0, colPlains[i], width, grid, function(x, y, idx) {
			this.bitmap.data[idx + 0] = 255;
			this.bitmap.data[idx + 1] = 255;
			this.bitmap.data[idx + 2] = 255;
		});
	}
}

module.exports = find_plain;
