var test_args = function (args) {
	if (!args.f) {
		console.log("Error: files required.");
		return false;
	}
	//-t (--treshold)
	if(typeof(args.treshold) != 'object') {
		console.log('Error 1: -t (--treshold) option must be an Array');
		return false;
	}
	else if (args.treshold.length != 3) {
		console.log('Error 2: -t (--treshold) option must contain 3 values');
		return false;
	}
	else if (typeof(args.treshold[0]) != 'number' || typeof(args.treshold[1]) != 'number' || typeof(args.treshold[2]) != 'number') {
		console.log('Error 3: -t (--treshold) option must contain only numbers');
		return false;
	}
	//--simplify-treshold
	if(typeof(args['simplify-treshold']) != 'object') {
		console.log('Error 4: --simplify-treshold option must be an Array');
		return false;
	}
	else if (args['simplify-treshold'].length != 3) {
		console.log('Error 5: --simplify-treshold option must contain 3 values');
		return false;
	}
	else if (typeof(args['simplify-treshold'][0]) != 'number' || typeof(args['simplify-treshold'][1]) != 'number' || typeof(args['simplify-treshold'][2]) != 'number') {
		console.log('Error 6: --simplify-treshold option must contain only numbers');
		return false;
	}

	return true;
}

module.exports = test_args;
