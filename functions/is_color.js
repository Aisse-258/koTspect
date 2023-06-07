var is_color = function (colorToCheck, imageColorData, position, treshold,colorSystem) {
	if (colorSystem == 'rgb'){
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
	} else if (colorSystem == 'hsv') {
		let ctcInHSV = {hue:0,saturation:0,value:0};
		let rh = Math.floor(colorToCheck.red*100/255);//HSV
		let gh = Math.floor(colorToCheck.green*100/255);
		let bh = Math.floor(colorToCheck.blue*100/255);
		let cmin = Math.min(rh,gh,bh);
		let cmax = Math.max(rh,gh,bh);
		ctcInHSV.value=cmax;
		if (cmax == 0) {
			ctcInHSV.saturation=0;
		} else {
			let sh = Math.floor((cmax-cmin)*100/cmax);
			ctcInHSV.saturation = sh;
		}
		if (cmax == cmin) {
			ctcInHSV.hue=0;
		} else if(cmax == rh) {
			hh = Math.floor(60*((gh-bh)>=0?gh-bh:bh-gh)/(cmax-cmin));
			ctcInHSV.hue=hh;
		} else if(cmax == gh) {
			hh = Math.floor(60*(((bh-rh)>=0?bh-rh:rh-bh)/(cmax-cmin)+2));
			ctcInHSV.hue=hh;
		} else if(cmax == bh) {
			hh = Math.floor(60*(((rh-gh)>=0?rh-gh:gh-rh)/(cmax-cmin)+4));
			ctcInHSV.hue=hh;
		}
		if (ctcInHSV.hue < imageColorData.imgDevs[position[0]][position[1]].hue - treshold*imageColorData.imgDevs[position[0]][position[1]].hueStd
			|| ctcInHSV.hue > imageColorData.imgDevs[position[0]][position[1]].hue + treshold*imageColorData.imgDevs[position[0]][position[1]].hueStd
			|| ctcInHSV.saturation < imageColorData.imgDevs[position[0]][position[1]].saturation - treshold*imageColorData.imgDevs[position[0]][position[1]].saturationStd
			|| ctcInHSV.saturation > imageColorData.imgDevs[position[0]][position[1]].saturation + treshold*imageColorData.imgDevs[position[0]][position[1]].saturationStd
			|| ctcInHSV.value < imageColorData.imgDevs[position[0]][position[1]].value - treshold*imageColorData.imgDevs[position[0]][position[1]].valueStd
			|| ctcInHSV.value > imageColorData.imgDevs[position[0]][position[1]].value + treshold*imageColorData.imgDevs[position[0]][position[1]].valueStd) {
			return 1;
		}
		else {
			return 0;
		}
	}
}
module.exports = is_color;
