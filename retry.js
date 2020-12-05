var Jimp = require('jimp');
var math = require('mathjs');
var childProcess = require('child_process');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2), {
	string: ['size'],
	alias: {'treshold':'t','height-divide':'h','width-divide':'w', 'grid1':'G','grid2':'g'},
	default: {'treshold':2,'height-divide':2,'width-divide':2,'grid1':32,'grid2':16},
	unknown: (arg) => {
	console.log('Unknown option: ', arg);
	//return false;
	}
});
//console.log(args);
var img = JSON.parse(args._[0]);
var divide = [args['height-divide'], args['width-divide']];
var threshold = args.treshold;
var grid1 = args.grid1, grid2 =  args.grid2;
var fs = require('fs');

var find_plain = require('./functions/find_plain.js');
var img_color_data = require('./functions/img_color_data.js');
var get_paper_color = require('./functions/get_paper_color.js');
var colors_to_paper = require('./functions/colors_to_paper.js');
var simple_colors = require('./functions/simple_colors.js');

//var t = Date.now();
Jimp.read(img.path, (err, image) => {
if (err) throw err;
	var imageColorData = img_color_data(image, Number(divide[0]), divide[1]);
	simple_colors(image, grid1, 8);
	var simpleMap = simple_colors(image, grid2, 10);
	colors_to_paper(image, imageColorData, simpleMap, grid2, threshold);
	//find_plain(image, 8, 20);
	fs.writeFileSync('test.txt','test');
	image.write('./uploads/'+img.originalname.slice(0,-4) + '_mod.bmp', function() {
		if (img.originalname.slice(-4) == '.jpg') {
			childProcess.execSync('convert ' +'./uploads/'+ img.originalname.slice(0,-4) + '_mod.bmp -quality ' +
			childProcess.execSync('identify -format \'%Q\' ' + img.path).toString() + ' ' +'./uploads/'+ img.originalname.slice(0,-4) + '_mod.jpg');
			//console.log(Date.now()-t);
		}
		else {
			childProcess.execSync('convert ' +'./uploads/'+ img.originalname.slice(0,-4) + '_mod.bmp ' +'./uploads/'+ img.originalname.slice(0,-4) + '_mod.jpg');
			//console.log(Date.now()-t);
		}
		childProcess.execSync('rm ' +'./uploads/'+ img.originalname.slice(0,-4) + '_mod.bmp');
	});
});
