var Jimp = require('jimp');
var math = require('mathjs');

var colors_to_paper = function (image, imageColorData, simpleMap, grid) {
	var tr = 2;
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let gridWidth = grid, gridHeight = grid;
	let gridWidthBorder = width%grid, gridHeightBorder = height%grid;
	var colorMap = [], colorsOnMap = [];
	var paperColor = {'red':0,'green':0,'blue':0}, areaPaper = 0;
	for (let i = 0; i < width/grid; i++) {
		colorMap.push([]);
		colorsOnMap.push([]);
	}
	for (let row = 0; row < width; row += grid) {
		if (row+grid > width) {
			gridWidth = gridWidthBorder;
		}
		for (let col = 0; col < height; col += grid) {
			var r=row/grid, c=col/grid;
			if (col + grid > height)
				gridHeight = gridHeightBorder;
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
			colorsOnMap[r][c] = {
				'red':redTot/(gridWidth*gridHeight),
				'redBlueStd':greenTot/(gridWidth*gridHeight),
				'blueGreenStd':blueTot/(gridWidth*gridHeight),
				'isPaper':0
			};
			/*if (
			math.std([[colorsOnMap[r][c].red, colorsOnMap[r][c].redBlueStd, colorsOnMap[r][c].blueGreenStd]],1) < 2*math.std([[imageColorData.imgDevs.red, imageColorData.imgDevs.blue, imageColorData.imgDevs.green]],1)
			&&
			Math.min(colorsOnMap[r][c].red, colorsOnMap[r][c].redBlueStd, colorsOnMap[r][c].blueGreenStd) > 0.5*Math.max(imageColorData.imgDevs.red, imageColorData.imgDevs.blue, imageColorData.imgDevs.green)
			) {
				colorsOnMap[r][c].isPaper = 1;
				//console.log(colorsOnMap[r][c]);
			}*/
			//console.log(colorsOnMap[r][c], math.std([[colorsOnMap[r][c].red, colorsOnMap[r][c].redBlueStd, colorsOnMap[r][c].blueGreenStd]],1))
			if (colorsOnMap[r][c].red < imageColorData.imgDevs.red - tr*imageColorData.imgDevs.redGreenStd || colorsOnMap[r][c].red > imageColorData.imgDevs.red + tr*imageColorData.imgDevs.redGreenStd
			|| colorsOnMap[r][c].redBlueStd < imageColorData.imgDevs.green - tr*imageColorData.imgDevs.redBlueStd || colorsOnMap[r][c].redBlueStd > imageColorData.imgDevs.green + tr*imageColorData.imgDevs.redBlueStd
			|| colorsOnMap[r][c].blueGreenStd < imageColorData.imgDevs.blue - tr*imageColorData.imgDevs.blueGreenStd || colorsOnMap[r][c].blueGreenStd > imageColorData.imgDevs.blue + tr*imageColorData.imgDevs.blueGreenStd) {
				colorMap[r][c] = 1;
				/*for (let i = row; i < row + gridWidth; i++){
					for (let j = col; j < col + gridHeight; j++){
						image.setPixelColor(hex, i, j);
					}
				}*/
			}
			else {
				colorMap[r][c] = 0;
				if(simpleMap[r][c]){
					paperColor.red += simpleMap[r][c].red;
					paperColor.green += simpleMap[r][c].green;
					paperColor.blue += simpleMap[r][c].blue;
					areaPaper++;
					colorsOnMap[r][c].isPaper = 1;
				}
			}
			gridHeight = grid;
		}
		gridWidth = grid;
	}
	paperColor.red = Math.floor(paperColor.red/areaPaper);
	paperColor.green = Math.floor(paperColor.green/areaPaper);
	paperColor.blue = Math.floor(paperColor.blue/areaPaper);
	//console.log(colorMap);
	do {
		var changes = 0;
		for (let i = 0; i < colorMap.length; i++){
			for (let j = 0; j < colorMap[i].length; j++){
				if(colorMap[i][j] == 1 && (i*j==0 || i==colorMap.length-1 || j == colorMap[i].length-1)) {
					colorMap[i][j] = 2;
					changes = 1;
				}
				else if (colorMap[i][j] == 1 && (colorMap[i][j-1] == 2 || colorMap[i-1][j] == 2)) {
					colorMap[i][j] = 2;
					changes = 1;
				}
				else if (colorMap[i][j] == 0 && (((colorMap[i]||[])[j-1] == 2 && (colorMap[i]||[])[j+1] == 1) || ((colorMap[i-1]||[])[j] == 2 && (colorMap[i+1]||[])[j] == 2))) {
					colorMap[i][j] = 2;
					changes = 1;
				}
			}
		}
	} while (changes != 0);

	do {
		var changes = 0;
		for (let row = 0; row < width; row += grid) {
			if (row+grid > width) {
				gridWidth = gridWidthBorder;
			}
			for (let col = 0; col < height; col += grid) {
				if (col + grid > height)
					gridHeight = gridHeightBorder;
				let redTot = 0, greenTot = 0, blueTot = 0;
				r=row/grid; c=col/grid;
				if (colorMap[r][c] != 2) 
					break;
				var nei = [];
				//if (colorsOnMap[r][c] && colorsOnMap[r][c].isPaper)
				//	nei.push(colorsOnMap[r][c]);
				var rad = 1;
				do {
					if (colorsOnMap[r][c+rad] && (colorsOnMap[r][c+rad]||{'isPaper':0}).isPaper && colorMap[r][c+rad] != 2)
						nei.push(colorsOnMap[r][c+rad]);
					if (colorsOnMap[r][c-rad] && (colorsOnMap[r][c-rad]||{'isPaper':0}).isPaper && colorMap[r][c-rad] != 2)
						nei.push(colorsOnMap[r][c-rad]);
					if ((colorsOnMap[r+rad]||[])[c] && ((colorsOnMap[r+rad]||[])[c]||{'isPaper':0}).isPaper && (colorMap[r+rad]||[])[c] != 2)
						nei.push(colorsOnMap[r+rad][c]);
					if ((colorsOnMap[r-rad]||[])[c] && ((colorsOnMap[r-rad]||[])[c]||{'isPaper':0}).isPaper && (colorMap[r-rad]||[])[c] != 2)
						nei.push(colorsOnMap[r-rad][c]);
					if ((colorsOnMap[r+rad]||[])[c+rad] && ((colorsOnMap[r+rad]||[])[c+rad]||{'isPaper':0}).isPaper && (colorMap[r+rad||[]])[c+rad] != 2)
						nei.push(colorsOnMap[r+rad][c+rad]);
					if ((colorsOnMap[r+rad]||[])[c-rad] && ((colorsOnMap[r+rad]||[])[c-rad]||{'isPaper':0}).isPaper && (colorMap[r+rad]||[])[c-rad] != 2)
						nei.push(colorsOnMap[r+rad][c-rad]);
					if ((colorsOnMap[r-rad]||[])[c+rad] && ((colorsOnMap[r-rad]||[])[c+rad]||{'isPaper':0}).isPaper && (colorMap[r-rad]||[])[c+rad] != 2)
						nei.push(colorsOnMap[r-rad][c+rad]);
					if ((colorsOnMap[r-rad]||[])[c-rad] && ((colorsOnMap[r-rad]||[])[c-rad]||{'isPaper':0}).isPaper && (colorMap[r-rad]||[])[c-rad] != 2)
						nei.push(colorsOnMap[r-rad][c-rad]);
					rad++;
				} while (nei.length == 0 && rad < 4);

				//console.log(r,c,nei);
				if (nei.length == 0)
					break;
				var redSum = 0, blueSum = 0, greenSum = 0;
				for (let i=0;i<nei.length;i++){
					redSum += nei[i].red;
					greenSum += nei[i].redBlueStd;
					blueSum += nei[i].blueGreenStd;
				}
				var red = Math.floor(redSum/nei.length);
				var green = Math.floor(greenSum/nei.length); 
				var blue = Math.floor(blueSum/nei.length);
				image.scan(row, col, gridWidth, gridHeight, function(x, y, idx) {
					this.bitmap.data[idx + 0] = red;
					this.bitmap.data[idx + 1] = green;
					this.bitmap.data[idx + 2] = blue;
				});
				colorsOnMap[r][c].isPaper = 1;
				colorMap[r][c] = 1;
				colorsOnMap[r][c].red = red;
				colorsOnMap[r][c].redBlueStd = green;
				colorsOnMap[r][c].blueGreenStd = blue;
				changes = 1;
				//console.log(r, c);
				gridHeight = grid;
			}
			gridWidth = grid;
		}
	} while (changes !=0);

	for (let row = 0; row < width; row += grid) {
			if (row+grid > width) {
				gridWidth = gridWidthBorder;
			}
			for (let col = 0; col < height; col += grid) {
				r=row/grid; c=col/grid;
				if (col + grid > height)
					gridHeight = gridHeightBorder;
				if(colorMap[r][c]==2){
					image.scan(row, col, gridWidth, gridHeight, function(x, y, idx) {
						this.bitmap.data[idx + 0] = paperColor.red;
						this.bitmap.data[idx + 1] = paperColor.green;
						this.bitmap.data[idx + 2] = paperColor.blue;
					});
				}
				gridHeight = grid;
			}
			gridWidth = grid;
		}
}

module.exports = colors_to_paper;
