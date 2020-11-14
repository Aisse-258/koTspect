var Jimp = require('jimp');
var math = require('mathjs');
var img = process.argv[2];

var find_plain = require('./functions/find_plain.js');
var img_color_data = require('./functions/img_color_data.js');
var get_paper_color = require('./functions/get_paper_color.js');
var colors_to_paper = require('./functions/colors_to_paper.js');
var simple_colors = require('./functions/simple_colors.js');

Jimp.read(img, (err, image) => {
if (err) throw err;
	var imageColorData = img_color_data(image);
	var grid1 = 32, grid2 = 16
	simple_colors(image, grid1, 8);
	var simpleMap = simple_colors(image, grid2, 10);
	colors_to_paper(image, imageColorData, simpleMap, grid2);
	//find_plain(image, 8, 20);
	image.write(img.slice(0,-4) + '_mod.jpg');
});
