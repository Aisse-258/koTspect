var Jimp = require('jimp');
var math = require('mathjs');
var childProcess = require('child_process');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2), {
	string: ['size'],
	alias: {
		'treshold':'t',
		'height-divide':'h',
		'width-divide':'w',
		'grid1':'G',
		'grid2':'g',
		'simplify':'s',
		'colors-to-paper':'colors-to-paper',
		'pixel-colors':'pixel-colors'
	},
	default: {
		'treshold':2,
		'height-divide':2,
		'width-divide':2,
		'grid1':32,
		'grid2':16,
		'simplify': true,
		'simplify-treshold': 10,
		'colors-to-paper': true,
		'pixel-colors': true
	},
	unknown: (arg) => {
	console.log('Unknown option: ', arg);
	//return false;
	}
});
//console.log(args);
var img = JSON.parse(args._[0]);
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
	if (grid1 > 0){
		simple_colors(image, grid1, args['simplify-treshold']-2, args.simplify);
	}
	var simpleMap = simple_colors(image, grid2, args['simplify-treshold'], args.simplify);
	if (args['colors-to-paper']) {
		var divide = [args['height-divide'], args['width-divide']];
		var threshold = args.treshold;
		var imageColorData = img_color_data(image, Number(divide[0]), divide[1]);
		colors_to_paper(image, imageColorData, simpleMap, grid2, threshold, args.simplify, args['pixel-colors']);
	}
	//find_plain(image, 8, 20);
	var extData = /([^\.]+)\.([^\.]+)$/.exec(img.originalname).slice(1,3);//[name,extension]
	if (extData[1].toLowerCase() == 'png'){
		image.write('./uploads/'+extData[0] + '_mod.png', function() {
			childProcess.execSync('convert -depth 24 -define png:compression-level=9 ' +'./uploads/'+ extData[0] + '_mod.png ' +'./uploads/'+ extData[0] + '_mod.png');
		});
	}
	else {
		image.write('./uploads/'+extData[0] + '_mod.bmp', function() {
			if (extData[1].toLowerCase() == 'jpg' || extData[1].toLowerCase() == 'jpeg') {
				childProcess.execSync('convert ' +'./uploads/'+ extData[0] + '_mod.bmp -quality ' +
				childProcess.execSync('identify -format \'%Q\' ' + img.path).toString() + ' ' +'./uploads/'+ extData[0] + '_mod.jpg');
				//console.log(Date.now()-t);
			}
			else {
				childProcess.execSync('convert ' +'./uploads/'+ extData[0] + '_mod.bmp ' +'./uploads/'+ extData[0] + '_mod.jpg');
				//console.log(Date.now()-t);
			}
			childProcess.execSync('rm ' +'./uploads/'+ extData[0] + '_mod.bmp');
		});
	}
});
