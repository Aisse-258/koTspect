var ca = require('./circular_average.js');

var circularSTD = function (angles) {
	let rhos = []
		, avg = ca(angles)
		, min_rho;
	avg = avg <= 180 ? avg : 360 - avg;
	angles.forEach(angle => {
		min_rho = angle <= 180 ? angle : 360 - angle;
		rhos.push(min_rho-avg);
	});
	//console.log(avg, rhos, rhos.reduce((a, b) => a + b**2, 0));
	cSTD = Math.sqrt(rhos.reduce((a, b) => a + b**2, 0)/(angles.length-1));
	return cSTD;
}

//circularSTD([355,354,345,337,348,315,324,359,5,12,13,4,2,6,10]);

module.exports = circularSTD;
