var Jimp = require('jimp');
var math = require('mathjs');
var simpleMap = [];
var circularSTD = require('./circularSTD.js');

var simple_colors = function (image, grid, maxStd, doSimplify, colorSystem) {
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let gridWidth = grid, gridHeight = grid;
	let gridWidthBorder = width%grid, gridHeightBorder = height%grid;
	for(let i = 0;i < height/grid; i++) {
		simpleMap.push([]);
	}
	if(colorSystem == 'rgb') {
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
				/*код для экспорта данных в csv вынесен в devs_to_csv.js*/
				if (devi[0] < maxStd[0] && devi[1] < maxStd[1] && devi[2] < maxStd[2]){
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
	} else if (colorSystem == 'hsv') {
		for (let row = 0; row < height; row += grid) {
			if (row+grid > height) {
				gridHeight = gridHeightBorder;
			}
			for (let col = 0; col < width; col += grid) {
				if (col + grid > width)
					gridWidth = gridWidthBorder;
				//let redData = [], greenData = [], blueData = [];//значения rgb в каждом пикселе плитки
				let hueData =[], saturationData = [], valueData = [];
				let redTot = 0, greenTot = 0, blueTot = 0;//всего цвета в 1 плитке
				image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
					let red = this.bitmap.data[idx + 0];
					let green = this.bitmap.data[idx + 1];
					let blue = this.bitmap.data[idx + 2];
					//var alpha = this.bitmap.data[idx + 3];
					let rh = Math.floor(red*100/255);//HSV
					let gh = Math.floor(green*100/255);
					let bh = Math.floor(blue*100/255);
					let cmin = Math.min(rh,gh,bh);
					let cmax = Math.max(rh,gh,bh);
					valueData.push(cmax);
					if (cmax == 0) {
						saturationData.push(0);
					} else {
						let sh = Math.floor((cmax-cmin)*100/cmax);
						saturationData.push(sh);
					}
					if (cmax == cmin) {
						hueData.push(0);
					} else if(cmax == rh) {
						hh = Math.floor(60*((gh-bh)>=0?gh-bh:bh-gh)/(cmax-cmin));
						hueData.push(hh);
					} else if(cmax == gh) {
						hh = Math.floor(60*(((bh-rh)>=0?bh-rh:rh-bh)/(cmax-cmin)+2));
						hueData.push(hh);
					} else if(cmax == bh) {
						hh = Math.floor(60*(((rh-gh)>=0?rh-gh:gh-rh)/(cmax-cmin)+4));
						hueData.push(hh);
					}
					redTot += red;//RGB
					greenTot += green;
					blueTot += blue;
					//redData.push(red);
					//greenData.push(green);
					//blueData.push(blue);
					//console.log([red,green,blue],x,y);
				});
				let devi = math.std([saturationData, valueData], 1);//std для hueData считать отдельно, вставить первым элементом в этот массив
				devi.unshift(circularSTD(hueData));
				//console.log(devi);
				if (devi[0] < maxStd[0] && devi[1] < maxStd[1] && devi[2] < maxStd[2]){
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
	}
	return simpleMap;
}

module.exports = simple_colors;
