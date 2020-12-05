var Jimp = require('jimp');
var math = require('mathjs');
var mark_edges = require('./mark_edges');
var is_color = require('./is_color.js');
var step_order = require('./step_order.js');
var simplify_area = require('./simplify_area.js');

var colors_to_paper = function (image, imageColorData, simpleMap, grid, treshold, doSimplify) {
	let width = image.bitmap.width;
	let height = image.bitmap.height;
	let gridWidth = grid, gridHeight = grid;
	let gridWidthBorder = width%grid, gridHeightBorder = height%grid;
	var colorMap = [], colorsOnMap = [];
	var paperColor = {'red':0,'green':0,'blue':0}, areaPaper = 0;
	for (let i = 0; i < height/grid; i++) {
		colorMap.push([]);
		colorsOnMap.push([]);
	}
	for (let row = 0; row < height; row += grid) {
		if (row+grid > height) {
			gridHeight = gridHeightBorder;
		}
		for (let col = 0; col < width; col += grid) {
			var r=row/grid, c=col/grid;
			if (col + grid > width)
				gridWidth = gridWidthBorder;
			let redTot = 0, greenTot = 0, blueTot = 0;
			image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
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
			colorMap[r][c] = is_color(colorsOnMap[r][c], imageColorData,
				color_data_position(row,col,height,width,imageColorData.imgDevs.length,
				imageColorData.imgDevs[0].length),treshold);
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
			gridWidth = grid;
		}
		gridHeight = grid;
	}
	paperColor.red = Math.floor(paperColor.red/areaPaper);
	paperColor.green = Math.floor(paperColor.green/areaPaper);
	paperColor.blue = Math.floor(paperColor.blue/areaPaper);
	//console.log(colorMap);
	mark_edges(colorMap);
	var stepOrder = step_order((height-gridHeightBorder)/grid, (width-gridWidthBorder)/grid);
	for (let i = 0; i < stepOrder.length; i++) {
		let r = stepOrder[i][0];
		let c = stepOrder[i][1];
		if (r*grid+grid > height) {
			gridHeight = gridHeightBorder;
		}
		if (c*grid + grid > width) {
			gridWidth = gridWidthBorder;
		}
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
		image.scan(c*grid, r*grid, gridWidth, gridHeight, function(x, y, idx) {
			this.bitmap.data[idx + 0] = red;
			this.bitmap.data[idx + 1] = green;
			this.bitmap.data[idx + 2] = blue;
		});
		colorsOnMap[r][c].isPaper = 1;
		colorMap[r][c] = 3;
		colorsOnMap[r][c].red = red;
		colorsOnMap[r][c].green = green;
		colorsOnMap[r][c].blue = blue;
		gridWidth = grid;
		gridHeight = grid;
	}

	for (let row = 0; row < height; row += grid) {
		if (row+grid > height) {
			gridHeight = gridHeightBorder;
		}
		for (let col = 0; col < width; col += grid) {
			r = row/grid; c = col/grid;
			if (col + grid > width)
				gridWidth = gridWidthBorder;
			if(colorMap[r][c]==2){
				image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
					this.bitmap.data[idx + 0] = paperColor.red;
					this.bitmap.data[idx + 1] = paperColor.green;
					this.bitmap.data[idx + 2] = paperColor.blue;
				});
				colorMap[r][c] = 3;
			}
			gridWidth = grid;
		}
		gridHeight = grid;
	}
	for (let row = 0; row < height; row += grid) {
		if (row+grid > height) {
			gridHeight = gridHeightBorder;
		}
		for (let col = 0; col < width; col += grid) {
			r = row/grid; c = col/grid;
			if (col + grid > width)
				gridWidth = gridWidthBorder;
			if(colorMap[r][c]==3){
				var nei = [];
				if (colorsOnMap[r][c+1] && colorMap[r][c+1] != 3)
					nei.push([(c+1)*grid,r*grid,
						grid_width((c+1)*grid, width, grid, gridWidthBorder),
						grid_width(r*grid, height, grid, gridHeightBorder)]);
				if (colorsOnMap[r][c-1] && colorMap[r][c-1] != 3)
					nei.push([(c-1)*grid,r*grid,
						grid_width((c-1)*grid, width, grid, gridWidthBorder),
						grid_width(r*grid, height, grid, gridHeightBorder)]);
				if ((colorsOnMap[r+1]||[])[c] && (colorMap[r+1]||[])[c] != 3)
					nei.push([c*grid,(r+1)*grid,
						grid_width(c*grid, width, grid, gridWidthBorder),
						grid_width((r+1)*grid, height, grid, gridHeightBorder)]);
				if ((colorsOnMap[r-1]||[])[c] && (colorMap[r-1]||[])[c] != 3)
					nei.push([c*grid,(r-1)*grid,
						grid_width(c*grid, width, grid, gridWidthBorder),
						grid_width((r-1)*grid, height, grid, gridHeightBorder)]);
				if ((colorsOnMap[r+1]||[])[c+1] && (colorMap[r+1||[]])[c+1] != 3)
					nei.push([(c+1)*grid,(r+1)*grid,
						grid_width((c+1)*grid, width, grid, gridWidthBorder),
						grid_width((r+1)*grid, height, grid, gridHeightBorder)]);
				if ((colorsOnMap[r+1]||[])[c-1] && (colorMap[r+1]||[])[c-1] != 3)
					nei.push([(c-1)*grid,(r+1)*grid,
						grid_width((c-1)*grid, width, grid, gridWidthBorder),
						grid_width((r+1)*grid, height, grid, gridHeightBorder)]);
				if ((colorsOnMap[r-1]||[])[c+1] && (colorMap[r-1]||[])[c+1] != 3)
					nei.push([(c+1)*grid,(r-1)*grid,
						grid_width((c+1)*grid, width, grid, gridWidthBorder),
						grid_width((r-1)*grid, height, grid, gridHeightBorder)]);
				if ((colorsOnMap[r-1]||[])[c-1] && (colorMap[r-1]||[])[c-1] != 3)
					nei.push([(c-1)*grid,(r-1)*grid,
						grid_width((c-1)*grid, width, grid, gridWidthBorder),
						grid_width((r-1)*grid, height, grid, gridHeightBorder)]);
				if (nei.length == 0)
					continue;
				for (let i = 0; i < nei.length; i++) {
					image.scan(nei[i][0], nei[i][1], nei[i][2], nei[i][3], function(x, y, idx) {
						let red = this.bitmap.data[idx + 0];
						let green = this.bitmap.data[idx + 1];
						let blue = this.bitmap.data[idx + 2];
						if (is_color({'red': red, 'green': green, 'blue': blue}, imageColorData,
						color_data_position(y,x,height,width,imageColorData.imgDevs.length,
							imageColorData.imgDevs[0].length),treshold)) {
							this.bitmap.data[idx + 0] = colorsOnMap[r][c].red;
							this.bitmap.data[idx + 1] = colorsOnMap[r][c].green;
							this.bitmap.data[idx + 2] = colorsOnMap[r][c].blue;
						}
					});
					if (doSimplify){
						simplify_area(image, nei[i][0], nei[i][1], grid, nei[i][2], nei[i][3], 10, simpleMap);
					}
				}
			}
			gridWidth = grid;
		}
		gridHeight = grid;
	}
}

function grid_width (RowCol, HeightWidth, grid, border) {
	if (RowCol + grid > HeightWidth)
		return border;
	else
		return grid;
}

function color_data_position (row, col, height, width, heightDivide, widthDivide) {
	var borderHeight = height%heightDivide;
	var gridHeight = (height - borderHeight)/heightDivide;
	var borderWidth = width%widthDivide;
	var gridWidth = (width - borderWidth)/widthDivide;
	for (let i = 0; i < heightDivide; i++) {
		for (let j = 0; j < widthDivide; j++){
			if (i == heightDivide - 1 && j == widthDivide -1 && row >= i*gridHeight && col >= j*gridWidth) {
				return [i,j];
			}
			else if (i == heightDivide - 1 && row >= i*gridHeight && col >= j*gridWidth && col < (j+1)*gridWidth) {
				return [i,j];
			}
			else if (j == widthDivide -1 && col >= j*gridWidth && row >= i*gridHeight && row < (i+1)*gridHeight) {
				return [i,j];
			}
			else if (row >= i*gridHeight && row < (i+1)*gridHeight && col >= j*gridWidth && col < (j+1)*gridWidth) {
				return [i,j];
			}
		}
	}
}

module.exports = colors_to_paper;
