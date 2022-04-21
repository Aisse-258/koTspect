var circular_average = function (angles) {
	let average = angles[0];
	for (let i=1;i<angles.length;i++) {
		if (Math.abs(angles[i]-average)<=180) {
			average = Math.min(average,angles[i]) + (Math.max(average,angles[i])-Math.min(average,angles[i]))/2.;
		} else {
			average = (Math.max(average,angles[i])+(Math.min(average,angles[i])+360-Math.max(average,angles[i]))/2.)%360;
		}
	}
	return average;
}

module.exports = circular_average;
