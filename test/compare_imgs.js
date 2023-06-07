var Jimp = require('jimp');

Jimp.read(process.argv[2], (err, image1) => {
	if (err) throw err;
	Jimp.read(process.argv[3], (err, image2) => {
		if (err) throw err;
		for (let i=0;i<image1.bitmap.data.length;i++) {
			if (image1.bitmap.data[i] != image2.bitmap.data[i]) {
				console.log('false');
				return false;
			}
		}
		console.log('true');
		return true;
	});
});
