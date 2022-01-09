var is_color = function (colorToCheck, imageColorData, position, treshold) {
	if (colorToCheck.red < imageColorData.imgDevs[position[0]][position[1]].red - treshold*imageColorData.imgDevs[position[0]][position[1]].redStd
		|| colorToCheck.red > imageColorData.imgDevs[position[0]][position[1]].red + treshold*imageColorData.imgDevs[position[0]][position[1]].redStd
		|| colorToCheck.green < imageColorData.imgDevs[position[0]][position[1]].green - treshold*imageColorData.imgDevs[position[0]][position[1]].greenStd
		|| colorToCheck.green > imageColorData.imgDevs[position[0]][position[1]].green + treshold*imageColorData.imgDevs[position[0]][position[1]].greenStd
		|| colorToCheck.blue < imageColorData.imgDevs[position[0]][position[1]].blue - treshold*imageColorData.imgDevs[position[0]][position[1]].blueStd
		|| colorToCheck.blue > imageColorData.imgDevs[position[0]][position[1]].blue + treshold*imageColorData.imgDevs[position[0]][position[1]].blueStd) {
		return 1;
	}
	else {
		return 0;
	}
}
module.exports = is_color;
