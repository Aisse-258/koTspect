var Jimp = require('jimp');
var math = require('mathjs');
var mark_edges = require('./mark_edges');
var is_color = require('./is_color.js');

var colors_to_paper = function (image, imageColorData, simpleMap, grid, treshold) {
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
			let gridArea = gridWidth*gridHeight;
			colorsOnMap[r][c] = {
				'red':redTot/gridArea,
				'green':greenTot/gridArea,
				'blue':blueTot/gridArea,
				'isPaper':0
			};
			/*if (
			math.std([[colorsOnMap[r][c].red, colorsOnMap[r][c].green, colorsOnMap[r][c].blue]],1) < 2*math.std([[imageColorData.imgDevs.red, imageColorData.imgDevs.blue, imageColorData.imgDevs.green]],1)
			&&
			Math.min(colorsOnMap[r][c].red, colorsOnMap[r][c].green, colorsOnMap[r][c].blue) > 0.5*Math.max(imageColorData.imgDevs.red, imageColorData.imgDevs.blue, imageColorData.imgDevs.green)
			) {
				colorsOnMap[r][c].isPaper = 1;
				//console.log(colorsOnMap[r][c]);
			}*/
			//console.log(colorsOnMap[r][c], math.std([[colorsOnMap[r][c].red, colorsOnMap[r][c].green, colorsOnMap[r][c].blue]],1))
			colorMap[r][c] = is_color(colorsOnMap[r][c], imageColorData,treshold);
			if(!colorMap[r][c] && simpleMap[r][c]) {
				paperColor.red += simpleMap[r][c].red;
				paperColor.green += simpleMap[r][c].green;
				paperColor.blue += simpleMap[r][c].blue;
				areaPaper++;
				colorsOnMap[r][c].isPaper = 1;
			}
			/*if (colorsOnMap[r][c].red < imageColorData.imgDevs.red - treshold*imageColorData.imgDevs.redStd
			|| colorsOnMap[r][c].red > imageColorData.imgDevs.red + treshold*imageColorData.imgDevs.redStd
			|| colorsOnMap[r][c].green < imageColorData.imgDevs.green - treshold*imageColorData.imgDevs.greenStd
			|| colorsOnMap[r][c].green > imageColorData.imgDevs.green + treshold*imageColorData.imgDevs.greenStd
			|| colorsOnMap[r][c].blue < imageColorData.imgDevs.blue - treshold*imageColorData.imgDevs.blueStd
			|| colorsOnMap[r][c].blue > imageColorData.imgDevs.blue + treshold*imageColorData.imgDevs.blueStd) {
				colorMap[r][c] = 1;
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
			}*/
			gridHeight = grid;
		}
		gridWidth = grid;
	}
	paperColor.red = Math.floor(paperColor.red/areaPaper);
	paperColor.green = Math.floor(paperColor.green/areaPaper);
	paperColor.blue = Math.floor(paperColor.blue/areaPaper);
	//console.log(colorMap);
	mark_edges(colorMap);

	do {
		var changes = 0;
		for (let row = 0; row < width; row += grid) {
			if (row+grid > width) {
				gridWidth = gridWidthBorder;
			}
			for (let col = 0; col < height; col += grid) {
				if (col + grid > height)
					gridHeight = gridHeightBorder;
				r=row/grid; c=col/grid;
				if (colorMap[r][c] != 2) 
					continue;
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
					continue;
				var redSum = 0, blueSum = 0, greenSum = 0;
				for (let i=0;i<nei.length;i++){
					redSum += nei[i].red;
					greenSum += nei[i].green;
					blueSum += nei[i].blue;
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
				colorMap[r][c] = 3;
				colorsOnMap[r][c].red = red;
				colorsOnMap[r][c].green = green;
				colorsOnMap[r][c].blue = blue;
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
			r = row/grid; c = col/grid;
			if (col + grid > height)
				gridHeight = gridHeightBorder;
			if(colorMap[r][c]==2){
				image.scan(row, col, gridWidth, gridHeight, function(x, y, idx) {
					this.bitmap.data[idx + 0] = paperColor.red;
					this.bitmap.data[idx + 1] = paperColor.green;
					this.bitmap.data[idx + 2] = paperColor.blue;
				});
				colorMap[r][c] = 3;
			}
			gridHeight = grid;
		}
		gridWidth = grid;
	}
	for (let row = 0; row < width; row += grid) {
		if (row+grid > width) {
			gridWidth = gridWidthBorder;
		}
		for (let col = 0; col < height; col += grid) {
			r = row/grid; c = col/grid;
			if (col + grid > height)
				gridHeight = gridHeightBorder;
			if(colorMap[r][c]==3){
				var nei = [];
				if (colorsOnMap[r][c+1] && colorMap[r][c+1] != 3)
					nei.push([r*grid,(c+1)*grid,gridWidth,gridHeight]);
				if (colorsOnMap[r][c-1] && colorMap[r][c-1] != 3)
					nei.push([r*grid,(c-1)*grid,gridWidth,gridHeight]);
				if ((colorsOnMap[r+1]||[])[c] && (colorMap[r+1]||[])[c] != 3)
					nei.push([(r+1)*grid,c*grid,gridWidth,gridHeight]);
				if ((colorsOnMap[r-1]||[])[c] && (colorMap[r-1]||[])[c] != 3)
					nei.push([(r-1)*grid,c*grid,gridWidth,gridHeight]);
				if ((colorsOnMap[r+1]||[])[c+1] && (colorMap[r+1||[]])[c+1] != 3)
					nei.push([(r+1)*grid,(c+1)*grid,gridWidth,gridHeight]);
				if ((colorsOnMap[r+1]||[])[c-1] && (colorMap[r+1]||[])[c-1] != 3)
					nei.push([(r+1)*grid,(c-1)*grid,gridWidth,gridHeight]);
				if ((colorsOnMap[r-1]||[])[c+1] && (colorMap[r-1]||[])[c+1] != 3)
					nei.push([(r-1)*grid,(c+1)*grid,gridWidth,gridHeight]);
				if ((colorsOnMap[r-1]||[])[c-1] && (colorMap[r-1]||[])[c-1] != 3)
					nei.push([(r-1)*grid,(c-1)*grid,gridWidth,gridHeight]);
				if (nei.length == 0)
					continue;
				for (let i = 0; i < nei.length; i++) {
					image.scan(nei[i][0], nei[i][1], nei[i][2], nei[i][3], function(x, y, idx) {
						var r = this.bitmap.data[idx + 0];
						var g = this.bitmap.data[idx + 1];
						var b = this.bitmap.data[idx + 2];
						if (is_color({'red': r, 'green': g, 'blue': b}, imageColorData,treshold)) {
							this.bitmap.data[idx + 0] = paperColor.red;
							this.bitmap.data[idx + 1] = paperColor.green;
							this.bitmap.data[idx + 2] = paperColor.blue;
						}
					});
				}
			}
			gridHeight = grid;
		}
		gridWidth = grid;
	}
}

module.exports = colors_to_paper;
