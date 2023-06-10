const Jimp = require('jimp');
const math = require('mathjs');
const divide_side = require('./divide_side.js');
const circular_average = require('./circular_average');
const circularSTD = require('./circularSTD.js');

var img_color_data = function (image, heightDivide, widthDivide, colorSystem, deciles) {
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let leftDecile = Math.floor(width*deciles[0])
	  , rightDecile = Math.floor(width*deciles[1])
	  , topDecile = Math.floor(height*deciles[2])
	  , bottomDecile = Math.floor(height*deciles[3]);
	let imgDevs = [];
	for (let i = 0;i < heightDivide;i++) {
		imgDevs.push([]);
	}
	let widthPoints = divide_side(width, widthDivide);
	let heightPoints = divide_side(height, heightDivide);
	if (colorSystem == 'rgb'){
		for (let w = 1; w < widthDivide+1; w++) {
			for (let h = 1; h < heightDivide+1; h++){
				let redImg = [], greenImg = [], blueImg = [];
				image.scan(widthPoints[w-1], heightPoints[h-1], widthPoints[w], heightPoints[h], function(x, y, idx) {
					let red = this.bitmap.data[idx + 0];
					let green = this.bitmap.data[idx + 1];
					let blue = this.bitmap.data[idx + 2];
					if (y >= topDecile && y < height - bottomDecile && x >= leftDecile && x < width - rightDecile) {
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
	} else if (colorSystem == 'hsv') {
		for (let w = 1; w < widthDivide+1; w++) {
			for (let h = 1; h < heightDivide+1; h++){
				//var redImg = [], greenImg = [], blueImg = [];
				var hueImg = [], saturationImg = [], valueImg = [];
				image.scan(widthPoints[w-1], heightPoints[h-1], widthPoints[w], heightPoints[h], function(x, y, idx) {
					let red = this.bitmap.data[idx + 0];
					let green = this.bitmap.data[idx + 1];
					let blue = this.bitmap.data[idx + 2];
					let rh = Math.floor(red*100/255);//HSV
					let gh = Math.floor(green*100/255);
					let bh = Math.floor(blue*100/255);
					if (y >= topDecile && y < height - bottomDecile && x >= leftDecile && x < width - rightDecile) {
						let cmin = Math.min(rh,gh,bh);
						let cmax = Math.max(rh,gh,bh);
						valueImg.push(cmax);
						if (cmax == 0) {
							saturationImg.push(0);
						} else {
							let sh = Math.floor((cmax-cmin)*100/cmax);
							saturationImg.push(sh);
						}
						if (cmax == cmin) {
							hueImg.push(0);
						} else if(cmax == rh) {
							hh = Math.floor(60*((gh-bh)>=0?gh-bh:bh-gh)/(cmax-cmin));
							hueImg.push(hh);
						} else if(cmax == gh) {
							hh = Math.floor(60*(((bh-rh)>=0?bh-rh:rh-bh)/(cmax-cmin)+2));
							hueImg.push(hh);
						} else if(cmax == bh) {
							hh = Math.floor(60*(((rh-gh)>=0?rh-gh:gh-rh)/(cmax-cmin)+4));
							hueImg.push(hh);
						}
					}
				});
				let area = hueImg.length;
				let r = heightPoints[h-1]/heightPoints[1];
				let c = widthPoints[w-1]/widthPoints[1];
				imgDevs[r][c] = {
					'hue': Math.floor(circular_average(hueImg)),
					'saturation': Math.floor(math.sum(saturationImg)/area),
					'value': Math.floor(math.sum(valueImg)/area),
					'hueStd': circularSTD(hueImg),
					'saturationStd':math.std([saturationImg],1)[0],
					'valueStd':math.std([valueImg],1)[0]
				};
				//console.log(imgDevs[r][c].hueStd);
			}
		}
	}

	//console.log(imgDevs);
	return {
		'imgDevs': imgDevs
	};
}

module.exports = img_color_data;
