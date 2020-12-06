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
var onloadOrig = fs.readFileSync('./webui/onload_template.html','utf-8');

server.use(express.static(__dirname));
server.use(multer({dest:"uploads"}).array("filedata"));
server.post("/upload",function(req,res,next){
	let filedata = req.files;
	console.log(req);
	if(!filedata){
		res.send("error on load");
	}
	else {
		res.setHeader('Content-Type', 'text/html');
		var treshold = req.body.treshold;
		var divH = req.body.divide_height,
		divW = req.body.divide_width;
		var simplifyAreas = req.body['simplify-areas'] == 'on' ? '' : ' --no-simplify ';
		var grid1 = req.body['simplify-areas'] == 'on' && req.body['simplify-big-areas'] == 'on' ? req.body.grid1 : 0,
		grid2 = req.body['simplify-areas'] == 'on' ? req.body.grid2 : req.body.grid;
		var command = '';
		var imgsShow = '';
		for(let i = 0; i < filedata.length; i++){
			command += 'node retry.js -t ' + treshold + ' -h ' + divH + ' -w ' + divW +
			' -G ' + grid1 + ' -g ' + grid2 + simplifyAreas +
			' -- \'' + JSON.stringify(filedata[i]) + '\' & ';

			imgsShow += '<div id="img-res'+i+'">\n'+
			'<img src="../uploads/'+filedata[i].filename+'" style="max-width: 49%;">\n'+
			'<a href="'+filedata[i].originalname.slice(0,-4)+'_mod.jpg" download="'+
			filedata[i].originalname.slice(0,-4)+'_mod.jpg">\n'+
			'<img src="../uploads/'+filedata[i].originalname.slice(0,-4)+'_mod.jpg'+'" style="max-width: 49%;"></a><br>\n'+
			'<a href="'+filedata[i].originalname.slice(0,-4)+'_mod.jpg" download="'+
			filedata[i].originalname.slice(0,-4)+
			'_mod.jpg">Скачать изображение</a>'+
			'\n</div>\n';
		}
		command += 'wait';
		childProcess.exec(command, function(err, stdout, stderr){
			console.log(err,stdout,stderr);
			var onload = onloadOrig.replace(/insert-imgs-here/,imgsShow);
			//fs.writeFileSync('./webui/onload.html',onload);
			res.send(onload);
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
