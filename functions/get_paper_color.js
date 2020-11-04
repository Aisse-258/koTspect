var Jimp = require('jimp');
var math = require('mathjs');

var get_paper_color = function (image) {
	var redPaper = 0, greenPaper = 0, bluePaper = 0, areaPaper = 0;//цвет бумаги
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	image.scan(0, 0, width, height, function(x, y, idx) {
		let red = this.bitmap.data[idx + 0];
		let green = this.bitmap.data[idx + 1];
		let blue = this.bitmap.data[idx + 2];
		//var alpha = this.bitmap.data[idx + 3];
		//console.log([red,green,blue],x,y);
		let bitRgbDevi = math.std([[red,green,blue]], 1);
		if (bitRgbDevi < 10 && Math.max(red, green, blue) > 120) {
			redPaper += red;
			greenPaper += green;
			bluePaper += blue;
			areaPaper++;
		}
	});
	return {
		'red': Math.floor(redPaper/areaPaper),
		'green': Math.floor(greenPaper/areaPaper),
		'blue': Math.floor(bluePaper/areaPaper)
	}
}

module.exports = get_paper_color;
