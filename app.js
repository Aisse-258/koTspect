const http = require('http');

const express = require('express');
const multer = require('multer');
const fs = require('fs');
var Jimp = require('jimp');
const hostname = '127.0.0.1';
const port = 3000;

//const { JSDOM } = require( "jsdom" );
//const { window } = new JSDOM( "" );
//const $ = require( "jquery" )( window );
//var $ = require('jquery-with-bootstrap-for-browserify');
var childProcess = require('child_process');
//var main = fs.readFileSync('./webui/index.html','utf-8');
const server = express();
var onloadOrig = fs.readFileSync('./webui/onload.html','utf-8');

server.use(express.static(__dirname));
server.use(multer({dest:"uploads"}).single("filedata"));
server.post("/upload",function(req,res,next){
	let filedata = req.file;
	console.log(filedata);
	if(!filedata){
		res.send("error on load");
	}
	else {
		res.setHeader('Content-Type', 'text/html');
		var treshold = 2;//1 * $('#treshold').val();
		var divH = 1,//1 * $('#divide-height').val(),
		divW = 1;//1 * $('#divide-width').val();
		var grid1 = 16,//1 * $('#grid1').val(),
		grid2 = 32;//1 * $('#grid2').val();
		childProcess.exec('node retry.js \'' + JSON.stringify(filedata) + '\' ' +
		treshold + ' ' + divH + 'x' + divW + ' ' + grid1 + ' ' + grid2,
		function(err, stdout, stderr){
			console.log(err,stdout,stderr);
			Jimp.read(filedata.path,(err, image) => {
				var onload = onloadOrig.replace(/image-name/,filedata.filename);
				onload = onload.replace(/image-mod-name/,filedata.originalname.slice(0,-4)+'_mod.jpg');
				onload = onload.replace(/image-height/g,String(image.bitmap.height*0.3));
				onload = onload.replace(/image-width/g,String(image.bitmap.width*0.3));
				res.send(onload);
			});
		});
	}
});
/*server.get('/download',function(req, res){
	const file = `${__dirname}/upload/img.jpg`;
	res.download(file);
});
const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end(main);
});*/

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
