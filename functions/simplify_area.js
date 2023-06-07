var Jimp = require('jimp');
var math = require('mathjs');
var circularSTD = require('./circularSTD.js');

var simplify_area = function (image, col, row, grid, gridWidth, gridHeight, maxStd, simpleMap,colorSystem) {
	if(colorSystem == 'rgb') {
		var redData = [], greenData = [], blueData = [];//значения rgb в каждом пикселе плитки
		var redTot = 0, greenTot = 0, blueTot = 0;//всего цвета в 1 плитке
		image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
			let red = this.bitmap.data[idx + 0];
			let green = this.bitmap.data[idx + 1];
			let blue = this.bitmap.data[idx + 2];
			redTot += red;
			greenTot += green;
			blueTot += blue;
			redData.push(red);
			greenData.push(green);
			blueData.push(blue);
		});
		let devi = math.std([redData, greenData, blueData], 1);
		if (devi[0] < maxStd && devi[1] < maxStd && devi[2] < maxStd){
			let r = Math.floor(redTot/(gridWidth*gridHeight));
			let g = Math.floor(greenTot/(gridWidth*gridHeight));
			let b = Math.floor(blueTot/(gridWidth*gridHeight));
			simpleMap[row/grid][col/grid] = {'red':r,'green':g,'blue':b};
			let hex = Jimp.rgbaToInt(r, g, b, 255);
			for (let i = row; i < row + gridHeight; i++){
				for (let j = col; j < col + gridWidth; j++){
					image.setPixelColor(hex, j, i);
				}
			}
		}
		else {
			simpleMap[row/grid][col/grid] = 0;
		}
	}
	else if (colorSystem == 'hsv') {
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
		});
		let devi = math.std([saturationData, valueData], 1);//std для hueData считать отдельно, вставить первым элементом в этот массив
		devi.unshift(circularSTD(hueData));
		if (devi[0] < maxStd && devi[1] < maxStd && devi[2] < maxStd){
			let r = Math.floor(redTot/(gridWidth*gridHeight));
			let g = Math.floor(greenTot/(gridWidth*gridHeight));
			let b = Math.floor(blueTot/(gridWidth*gridHeight));
			simpleMap[row/grid][col/grid] = {'red':r,'green':g,'blue':b};
			let hex = Jimp.rgbaToInt(r, g, b, 255);
			for (let i = row; i < row + gridHeight; i++){
				for (let j = col; j < col + gridWidth; j++){
					image.setPixelColor(hex, j, i);
				}
			}
		}
		else {
			simpleMap[row/grid][col/grid] = 0;
		}
	}
}

module.exports = simplify_area;
