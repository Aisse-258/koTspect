var math = require('mathjs');
var angle_add = function (angle, num) {
	sum = angle + num;
	if (sum < 360) {
		return sum;
	} else {
		return sum%360;
	}
}
var circularSTD = function (angles) {
	let angleclone = angles.slice(0);
	angleclone.sort(function (a,b) {return b-a;});
	let mindev = math.std([angleclone], 1)[0];
	//console.log(angleclone[0],mindev);
	for (let i=0; i<angleclone.length;i++) {
		let shift = 360 - angleclone[i];
		if (shift == 360) {
			continue;
		}
		for (let j=0;j<angleclone.length;j++) {
			angleclone[j] = angle_add(angleclone[j],shift);
		}
		mindev = Math.min(mindev,math.std([angleclone], 1)[0]);
		if (mindev == 0) {
			break;
		}
		//console.log(angleclone[0],mindev);
	}
	return mindev;
}

//circularSTD([355,354,345,337,348,315,324,359,5,12,13,4,2,6,10]);

module.exports = circularSTD;
