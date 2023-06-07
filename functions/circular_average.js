var circular_average_coord = function(angles) {
	let arr_x=[], arr_y=[],
		avg_x, avg_y,
		avg_angle;
	angles.forEach(angle => {
		arr_x.push(Math.cos(angle*Math.PI/180));
		arr_y.push(Math.sin(angle*Math.PI/180));
	});
	avg_x = arr_x.reduce((a, b) => a + b, 0)/arr_x.length;
	avg_y = arr_y.reduce((a, b) => a + b, 0)/arr_y.length;

	avg_angle = 180*Math.atan2(avg_y,avg_x)/Math.PI;

	return (avg_angle >= 0 ? avg_angle : 360 + avg_angle)%360;
}

module.exports = circular_average_coord;
