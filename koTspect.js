//node koTspect.js [-t treshold] [-h divH] [-w divW]  [-G grid1] [-g grid2] [simplifyAreas] [--simplify-treshold simplifyTreshold] [doColorsToPaper] [doPixelColors] -f 'file1.jpg file2.jpg'
const fs = require('fs');
const uuid = require('uuid');
var childProcess = require('child_process');
function getMimeFromPath(filePath) {
    const mimeType = childProcess.execSync('file --mime-type -b "' + filePath + '"').toString();
    return mimeType.trim();
}
const minimist = require('minimist');
const { exit } = require('process');
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
		'pixel-colors':'pixel-colors',
		'dir-to-save':'d',
		'files':'f',
		'mk-pdf':'mk-pdf',
		'mk-zip':'mk-zip'
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
		'pixel-colors': true,
		'dir-to-save': './uploads/',
		'files': undefined,
		'mk-pdf':false,
		'mk-zip':false
	},
	unknown: (arg) => {
	console.log('Unknown option: ', arg);
	//return false;
	}
});
if (!args.f) {
	console.log("Error: files required.");
	exit(1);
}
console.log(args);

var simplifyAreas = args.s ? '' : ' --no-simplify ';
var grid1 = args.s ? (args.G >= 0 ? args.G - args.G%1 : 0) : 0,
	grid2 = args.g >=8 ? args.g - args.g%1 : 8;
var doColorsToPaper = args['colors-to-paper'] ? '' : ' --no-colors-to-paper';
var treshold = args.t;
var simplifyTreshold = args.s ? args['simplify-treshold'] : 0;
var divH = args.h >=1 ? args.h - args.h%1 : 1,
	divW = args.w >=1 ? args.w - args.w%1 : 1;
var doPixelColors = args['pixel-colors'] ? '' : ' --no-pixel-colors ';
if(args['mk-zip'] || args['mk-pdf']){
	var resList = '';
}
var command = '';

var filedata = [], filepaths = args.f.split(' '), reg = /\/[^/]+$/;
for(let i=0;i<filepaths.length;i++){
	if(!fs.existsSync(filepaths[i])) {
		console.log('Error: file' + filepaths[i] + ' not found. File names must not contain spaces.');
		exit(1);
	}
	filedata.push({
		fieldname: 'filedata',
		originalname: reg.exec(filepaths[i])[0].slice(1),
		encoding: '7bit',
		mimetype: getMimeFromPath(filepaths[i]),
		destination: 'uploads',//проверить важность элемента
		filename: reg.exec(filepaths[i])[0].slice(1),
		path: filepaths[i],
		size: fs.statSync(filepaths[i]).size
	});
}

//TODO: Переписать асинхронно
for(let i = 0; i < filedata.length; i++){
	if(filedata[i].mimetype == 'application/pdf'){
		childProcess.execSync('pdfimages -all ' + filedata[i].path + ' ' + filedata[i].path);
		let imgQ = childProcess.execSync('pdfimages -list ' + filedata[i].path + ' | wc -l') - 2;
		for (let j=0; j<imgQ;j++) {
			var num='';
			if (j == 0) {
				num='000'
			}
			else if (j<10) {
				num = '00'+j;
			}
			else if (j<100){
				num = '0'+j;
			}
			else {
				num = j;
			}
			if (fs.existsSync(filedata[i].path + '-'+num + '.ppm')) {
				childProcess.execSync('convert ' + filedata[i].path + '-'+num + '.ppm ' + filedata[i].path + '-'+num + '.png');
				childProcess.execSync('rm ' + filedata[i].path + '-'+num + '.ppm');
				filedata.push({
					fieldname: 'filedata',
					originalname:  filedata[i].filename+'-'+num+'.png',
					encoding: '7bit',
					mimetype: 'image/png',
					destination: 'uploads',
					filename: filedata[i].filename+'-'+num+'.png',
					path: filedata[i].path+'-'+num+'.png',
					size: fs.statSync(filedata[i].path+'-'+num+'.png').size
				});
			}
			else if (fs.existsSync(filedata[i].path + '-'+num + '.png')) {
				filedata.push({
					fieldname: 'filedata',
					originalname:  filedata[i].filename+'-'+num+'.png',
					encoding: '7bit',
					mimetype: 'image/png',
					destination: 'uploads',
					filename: filedata[i].filename+'-'+num+'.png',
					path: filedata[i].path+'-'+num+'.png',
					size: fs.statSync(filedata[i].path+'-'+num+'.png').size
				});
			}
			else if (fs.existsSync(filedata[i].path + '-'+num + '.jpg')) {
				filedata.push({
					fieldname: 'filedata',
					originalname:  filedata[i].filename+'-'+num+'.jpg',
					encoding: '7bit',
					mimetype: 'image/jpeg',
					destination: 'uploads',
					filename: filedata[i].filename+'-'+num+'.jpg',
					path: filedata[i].path+'-'+num+'.jpg',
					size: fs.statSync(filedata[i].path+'-'+num+'.jpg').size
				});
			}
			else {
				let imgs = childProcess.execSync('ls -l '+filedata[i].path+'-*');
				console.log('Error(145): There are images in non-supported formats. Use only JPEG, PNG or PDF.');
				exit(1);
			}
		}
		filedata.splice(i,1);
	}
}
//console.log(filedata);
if(filedata.length == 0){
	console.log('Error: Choosen files are not containing images.');
	exit(1);
}
for(let i = 0; i < filedata.length; i++){
	command += 'node retry.js -t ' + treshold + ' -h ' + divH + ' -w ' + divW + ' -d ' + args.d +
	' -G ' + grid1 + ' -g ' + grid2 + simplifyAreas + ' --simplify-treshold ' + simplifyTreshold + doColorsToPaper +
	doPixelColors + ' -- \'' + JSON.stringify(filedata[i]) + '\' & ';

	let extData = (/([^\.]+)\.([^\.]+)$/.exec(filedata[i].originalname) || 
		[0, filedata[i].originalname,
		(/[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1] == 'jpeg' ? 'jpg' : /[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1])])
		.slice(1,3);//[name,extension]
	if(args['mk-zip']||args['mk-pdf']){
		resList += ' '+ args.d + extData[0] +'_mod.'+
		(extData[1].toLowerCase()=='png' ? 'png' : 'jpg');
	}
}
command += 'wait';
childProcess.exec(command, function(err, stdout, stderr){
	console.log(err,stdout,stderr);
	if(!!stderr && /\/git\/koTspect\/retry\.js:47/.test(stderr)) {
		console.log('Error(181): There are images in non-supported formats. Use only JPEG, PNG or PDF.');
		exit(1);
	}
	for(let i = 0; i < filedata.length; i++){
		let extData = (/([^\.]+)\.([^\.]+)$/.exec(filedata[i].originalname) || 
			[0, filedata[i].originalname,
			(/[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1] == 'jpeg' ? 'jpg' : /[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1])])
			.slice(1,3);//[name,extension]
		if(!fs.existsSync(args.d+extData[0]+'_mod.'+ (extData[1].toLowerCase()=='png' ? 'png' : 'jpg'))) {
			childProcess.execSync('node retry.js -t ' + treshold + ' -h ' + divH + ' -w ' + divW + ' -d ' + args.d +
			' -G ' + grid1 + ' -g ' + grid2 + simplifyAreas + ' --simplify-treshold ' + simplifyTreshold + doColorsToPaper +
			doPixelColors + ' -- \'' + JSON.stringify(filedata[i]) + '\'');
		}
		let size_before = Math.ceil(filedata[i].size)/1024;
		let size_arter = Math.ceil(fs.statSync(args.d+extData[0]+'_mod.'+ (extData[1].toLowerCase()=='png' ? 'png' : 'jpg')).size/1024);
		console.log('File '+filedata[i].path+' compressed from '+size_before+'Kb to '+size_arter+'Kb.');
		console.log('Path to result: ' + args.d+extData[0]+'_mod.'+ (extData[1].toLowerCase()=='png' ? 'png' : 'jpg'));
	}
	if(args['mk-zip']){
		var archieveName = uuid.v4();
		childProcess.exec('zip ' + args.d + archieveName + '.zip' + resList);
		console.log('Archieve created: '+ args.d + archieveName + '.zip .')
	}
	if(args['mk-pdf']){
		var pdfName = uuid.v4();
		childProcess.exec('img2pdf' + resList+' -o ' + args.d + pdfName + '.pdf');
		console.log('PDF-file created: ' + args.d + pdfName + '.pdf .');
	}
});
