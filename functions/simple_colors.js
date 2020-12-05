var Jimp = require('jimp');
var math = require('mathjs');

var simple_colors = function (image, grid, maxStd, doSimplify) {
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let gridWidth = grid, gridHeight = grid;
	let gridWidthBorder = width%grid, gridHeightBorder = height%grid;
	var simpleMap = [];
	for(let i = 0;i < height/grid; i++) {
		simpleMap.push([]);
	}
	for (let row = 0; row < height; row += grid) {
		if (row+grid > height) {
			gridHeight = gridHeightBorder;
		}
		for (let col = 0; col < width; col += grid) {
			if (col + grid > width)
				gridWidth = gridWidthBorder;
			let redData = [], greenData = [], blueData = [];//значения rgb в каждом пикселе плитки
			let redTot = 0, greenTot = 0, blueTot = 0;//всего цвета в 1 плитке
			image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
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
				//console.log([red,green,blue],x,y);
			});
			let devi = math.std([redData, greenData, blueData], 1);
			//console.log(devi);
			if (devi[0] < maxStd && devi[1] < maxStd && devi[2] < maxStd){
				let r = Math.floor(redTot/(gridWidth*gridHeight));
				let g = Math.floor(greenTot/(gridWidth*gridHeight));
				let b = Math.floor(blueTot/(gridWidth*gridHeight));
				simpleMap[row/grid][col/grid] = {'red':r,'green':g,'blue':b};
				//console.log (r, g, b, w*h);
				if (doSimplify){
					let hex = Jimp.rgbaToInt(r, g, b, 255);
					for (let i = row; i < row + gridHeight; i++){
						for (let j = col; j < col + gridWidth; j++){
							image.setPixelColor(hex, j, i);
						}
					}
				}
			}
			else {
				simpleMap[row/grid][col/grid] = 0;
			}
			gridWidth = grid;
		}
		gridHeight = grid;
	}
	return simpleMap;
}

module.exports = simple_colors;
