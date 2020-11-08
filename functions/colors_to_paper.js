var Jimp = require('jimp');
var math = require('mathjs');

var colors_to_paper = function (image, imageColorData, paperColor, grid) {
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let gridWidth = grid, gridHeight = grid;
	let gridWidthBorder = width%grid, gridHeightBorder = height%grid;
	var colorMap = [], colorsOnMap = [];
	for (let i = 0; i < width; i++) {
		colorMap.push([]);
		colorsOnMap.push([]);
	}
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
			colorsOnMap[row/grid][col/grid] = {
				'redGreenStd':redTot/(gridWidth*gridHeight),
				'redBlueStd':greenTot/(gridWidth*gridHeight),
				'blueGreenStd':blueTot/(gridWidth*gridHeight),
				'isPaper':0
			};
			if (
			math.std([[colorsOnMap[row/grid][col/grid].redGreenStd, colorsOnMap[row/grid][col/grid].redBlueStd, colorsOnMap[row/grid][col/grid].blueGreenStd]],1)<10
			&&
			Math.min(colorsOnMap[row/grid][col/grid].redGreenStd, colorsOnMap[row/grid][col/grid].redBlueStd, colorsOnMap[row/grid][col/grid].blueGreenStd) > Math.max(imageColorData.imgDevs.red, imageColorData.imgDevs.blue, imageColorData.imgDevs.green)
			) {
				colorsOnMap[row/grid][col/grid].isPaper = 1;
				//console.log(colorsOnMap[row/grid][col/grid]);
			}
			//console.log(colorsOnMap[row/grid][col/grid], math.std([[colorsOnMap[row/grid][col/grid].redGreenStd, colorsOnMap[row/grid][col/grid].redBlueStd, colorsOnMap[row/grid][col/grid].blueGreenStd]],1))
			if (colorsOnMap[row/grid][col/grid].redGreenStd < imageColorData.imgDevs.red - imageColorData.imgDevs.redGreenStd || colorsOnMap[row/grid][col/grid].redGreenStd > imageColorData.imgDevs.red + 1.5*imageColorData.imgDevs.redGreenStd
			|| colorsOnMap[row/grid][col/grid].redBlueStd < imageColorData.imgDevs.green - imageColorData.imgDevs.redBlueStd || colorsOnMap[row/grid][col/grid].redBlueStd > imageColorData.imgDevs.green + 1.5*imageColorData.imgDevs.redBlueStd
			|| colorsOnMap[row/grid][col/grid].blueGreenStd < imageColorData.imgDevs.blue - imageColorData.imgDevs.blueGreenStd || colorsOnMap[row/grid][col/grid].blueGreenStd > imageColorData.imgDevs.blue + 1.5*imageColorData.imgDevs.blueGreenStd) {
				colorMap[row/grid][col/grid] = 1;
				/*for (let i = row; i < row + gridWidth; i++){
					for (let j = col; j < col + gridHeight; j++){
						image.setPixelColor(hex, i, j);
					}
				}*/
			}
			else {
				colorMap[row/grid][col/grid] = 0;
			}
			gridHeight = grid;
		}
		gridWidth = grid;
	}
	//console.log(colorMap);
	do {
		var changes = 0;
		for (let i=0; i<colorMap.length; i++){
			for (let j=0; j<colorMap[i].length; j++){
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
	}
	while (changes != 0)
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
				var r=row/grid, c=col/grid;
				if (colorMap[r][c] != 2) 
					break;
				var nei = [];
				//if (colorsOnMap[r][c] && colorsOnMap[r][c].isPaper)
				//	nei.push(colorsOnMap[r][c]);
				if (colorsOnMap[r][c+1] && (colorsOnMap[r][c+1]||{'isPaper':0}).isPaper && colorMap[r][c+1] != 2)
					nei.push(colorsOnMap[r][c+1]);
				if (colorsOnMap[r][c-1] && (colorsOnMap[r][c-1]||{'isPaper':0}).isPaper && colorMap[r][c-1] != 2)
					nei.push(colorsOnMap[r][c-1]);
				if ((colorsOnMap[r+1]||[])[c] && ((colorsOnMap[r+1]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r+1]||[])[c] != 2)
					nei.push(colorsOnMap[r+1][c]);
				if ((colorsOnMap[r-1]||[])[c] && ((colorsOnMap[r-1]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r-1]||[])[c] != 2)
					nei.push(colorsOnMap[r-1][c]);
				//console.log(r,c,nei);
				if (nei.length == 0){
				if (colorsOnMap[r][c+2] && (colorsOnMap[r][c+2]||{'isPaper':0}).isPaper && colorMap[r][c+2] != 2)
					nei.push(colorsOnMap[r][c+2]);
				if (colorsOnMap[r][c-2] && (colorsOnMap[r][c-2]||{'isPaper':0}).isPaper && colorMap[r][c-2] != 2)
					nei.push(colorsOnMap[r][c-2]);
				if ((colorsOnMap[r+2]||[])[c] && ((colorsOnMap[r+2]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r+2]||[])[c] != 2)
					nei.push(colorsOnMap[r+2][c]);
				if ((colorsOnMap[r-2]||[])[c] && ((colorsOnMap[r-2]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r-2]||[])[c] != 2)
					nei.push(colorsOnMap[r-2][c]);
				}
				if (nei.length == 0){
				if (colorsOnMap[r][c+3] && (colorsOnMap[r][c+2]||{'isPaper':0}).isPaper && colorMap[r][c+3] != 2)
					nei.push(colorsOnMap[r][c+3]);
				if (colorsOnMap[r][c-3] && (colorsOnMap[r][c-3]||{'isPaper':0}).isPaper && colorMap[r][c-3] != 2)
					nei.push(colorsOnMap[r][c-3]);
				if ((colorsOnMap[r+3]||[])[c] && ((colorsOnMap[r+2]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r+3]||[])[c] != 2)
					nei.push(colorsOnMap[r+3][c]);
				if ((colorsOnMap[r+3]||[])[c+1] && ((colorsOnMap[r+2]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r+3]||[])[c+1] != 2)
					nei.push(colorsOnMap[r+3][c+1]);
				if ((colorsOnMap[r+3]||[])[c-1] && ((colorsOnMap[r+2]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r+3]||[])[c-1] != 2)
					nei.push(colorsOnMap[r+3][c-1]);
				if ((colorsOnMap[r-3]||[])[c] && ((colorsOnMap[r-2]||[])[c]||{'isPaper':0}).isPaper && (colorsOnMap[r-3]||[])[c] != 2)
					nei.push(colorsOnMap[r-3][c]);
				}
				if (nei.length == 0) break;
				var redSum = 0, blueSum = 0, greenSum = 0;
				for (let i=0;i<nei.length;i++){
					redSum += nei[i].redGreenStd;
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
				colorsOnMap[r][c].redGreenStd = red;
				colorsOnMap[r][c].redBlueStd = green;
				colorsOnMap[r][c].blueGreenStd = blue;
				changes = 1;
				//console.log(r, c);
				gridHeight = grid;
			}
			gridWidth = grid;
		}
	}
	while (changes !=0)
	for (let row = 0; row < width; row += grid) {
			if (row+grid > width) {
				gridWidth = gridWidthBorder;
			}
			for (let col = 0; col < height; col += grid) {
				if (col + grid > height)
					gridHeight = gridHeightBorder;
				if(colorMap[row/grid][col/grid]==2){
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
