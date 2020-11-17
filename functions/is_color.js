var is_color = function (colorToCheck, imageColorData,treshold) {
	if (colorToCheck.red < imageColorData.imgDevs.red - treshold*imageColorData.imgDevs.redStd
		|| colorToCheck.red > imageColorData.imgDevs.red + treshold*imageColorData.imgDevs.redStd
		|| colorToCheck.green < imageColorData.imgDevs.green - treshold*imageColorData.imgDevs.greenStd
		|| colorToCheck.green > imageColorData.imgDevs.green + treshold*imageColorData.imgDevs.greenStd
		|| colorToCheck.blue < imageColorData.imgDevs.blue - treshold*imageColorData.imgDevs.blueStd
		|| colorToCheck.blue > imageColorData.imgDevs.blue + treshold*imageColorData.imgDevs.blueStd) {
			return 1;
		}
	else {
		return 0;
	}
}
module.exports = is_color;
