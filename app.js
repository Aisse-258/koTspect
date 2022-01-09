const http = require('http');

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid');
var Jimp = require('jimp');
const hostname = '127.0.0.1';
const port = 3000;

var childProcess = require('child_process');
const server = express();
var onloadOrig = fs.readFileSync('./webui/onload_template.html','utf-8');

server.use(express.static(__dirname));
server.use(multer({dest:"uploads"}).array("filedata"));
server.post("/upload",function(req,res,next){
	let filedata = req.files;
	//console.log(req);
	if(!filedata){
		res.send("error on load");
	}
	else {
		res.setHeader('Content-Type', 'text/html');
		for(let i = 0; i < filedata.length; i++){
			if(filedata[i].mimetype != 'application/pdf' &&
			/([^\/]+)\/[^\/]+$/.exec(filedata[i].mimetype)[1] != 'image'){
				res.send('Формат '+filedata[i].mimetype+' не поддерживается.');
				return;
			}
		}
		var onloadName = uuid.v4();
		var onload = '<html>\n'+
		'<head><meta http-equiv="refresh" content="3;http://localhost:3000/uploads/'+onloadName+'.html" /></head>\n'+
		'<body>\n'+
		'Подождите, файлы обрабатываются...'+
		'</body>\n</html>';
		fs.writeFileSync('uploads/'+onloadName+'.html', onload);
		res.send(onload);
		var simplifyAreas = req.body['simplify-areas'] == 'on' ? '' : ' --no-simplify ';
		var grid1 = req.body['simplify-areas'] == 'on' && req.body['simplify-treshold'] > 2 && req.body['simplify-big-areas'] == 'on' ? req.body.grid1 : 0,
			grid2 = req.body['simplify-areas'] == 'on' ? req.body.grid2 : req.body.grid;
		var doColorsToPaper = req.body['do-colors-to-paper'] == 'on' ? '' : ' --no-colors-to-paper';
		var treshold = req.body.treshold;
		var simplifyTreshold = req.body['simplify-areas'] == 'on' ? req.body['simplify-treshold'] : 0;
		var divH = req.body['do-height-divide'] == 'on' ? req.body.divide_height : 1,
		divW = req.body['do-width-divide'] == 'on' ? req.body.divide_width : 1;
		var doPixelColors = req.body['do-pixel-colors'] == 'on' ? '' : ' --no-pixel-colors ';
		var command = '';
		var imgsShow = '';
		if(req.body['make-archive']=='on'||req.body['make-pdf']){
			var resList = '';
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
						onload = 'Присутствуют изображения в неподдерживаемых форматах.\n'+imgs;
						fs.writeFileSync('uploads/'+onloadName+'.html', onload);
						return;
					}
				}
				filedata.splice(i,1);
			}
		}
		//console.log(filedata);
		if(filedata.length == 0){
			onload = 'Файлы не выбраны или выбранные файлы не содержат изображений.';
			fs.writeFileSync('uploads/'+onloadName+'.html', onload);
			return;
		}
		for(let i = 0; i < filedata.length; i++){
			command += 'node retry.js -t ' + treshold + ' -h ' + divH + ' -w ' + divW +
			' -G ' + grid1 + ' -g ' + grid2 + simplifyAreas + ' --simplify-treshold ' + simplifyTreshold + doColorsToPaper +
			doPixelColors + ' -- \'' + JSON.stringify(filedata[i]) + '\' & ';

			let extData = (/([^\.]+)\.([^\.]+)$/.exec(filedata[i].originalname) || 
				[0, filedata[i].originalname,
				(/[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1] == 'jpeg' ? 'jpg' : /[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1])])
				.slice(1,3);//[name,extension]
			if(req.body['make-archive']=='on'||req.body['make-pdf']){
				resList += ' ./uploads/' + extData[0] +'_mod.'+
				(extData[1].toLowerCase()=='png' ? 'png' : 'jpg');
			}
		}
		command += 'wait';
		childProcess.exec(command, function(err, stdout, stderr){
			console.log(err,stdout,stderr);
			if(!!stderr && /\/git\/koTspect\/retry\.js:46/.test(stderr)) {
				onload = 'Формат не поддерживается.';
				fs.writeFileSync('uploads/'+onloadName+'.html', onload);
				return;
			}
			for(let i = 0; i < filedata.length; i++){
				let extData = (/([^\.]+)\.([^\.]+)$/.exec(filedata[i].originalname) || 
					[0, filedata[i].originalname,
					(/[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1] == 'jpeg' ? 'jpg' : /[^\/]+\/([^\/]+)$/.exec(filedata[i].mimetype)[1])])
					.slice(1,3);//[name,extension]
				if(!fs.existsSync("./uploads/"+extData[0]+'_mod.'+ (extData[1].toLowerCase()=='png' ? 'png' : 'jpg'))) {
					childProcess.execSync('node retry.js -t ' + treshold + ' -h ' + divH + ' -w ' + divW +
					' -G ' + grid1 + ' -g ' + grid2 + simplifyAreas + ' --simplify-treshold ' + simplifyTreshold + doColorsToPaper +
					doPixelColors + ' -- \'' + JSON.stringify(filedata[i]) + '\'');
				}
				let size = Math.ceil(fs.statSync("./uploads/"+extData[0]+'_mod.'+ (extData[1].toLowerCase()=='png' ? 'png' : 'jpg')).size/1024);
				imgsShow += '<div id="img-res'+i+'">\n'+
				'<img src="../uploads/'+filedata[i].filename+'" style="max-width: 49%;">\n'+
				'<a href="../uploads/'+extData[0]+'_mod.'+
				(extData[1].toLowerCase()=='png' ? 'png' : 'jpg')+'" download="'+
				extData[0]+'_mod.'+
				(extData[1].toLowerCase()=='png' ? 'png' : 'jpg')+'">\n'+
				'<img src="../uploads/'+extData[0]+'_mod.'+
				(extData[1].toLowerCase()=='png' ? 'png' : 'jpg')+'" style="max-width: 49%;"></a><br>\n'+
				'<a href="../uploads/'+extData[0]+'_mod.'+
				(extData[1].toLowerCase()=='png' ? 'png' : 'jpg')+'" download="'+
				extData[0]+
				'_mod.'+ (extData[1].toLowerCase()=='png' ? 'png' : 'jpg')+
				'" style="margin-left: 50%;">Скачать изображение ('+size+' кБ)</a>'+
				'\n</div>\n';
			}
			if(req.body['make-archive']=='on'){
				var archieveName = uuid.v4();
				imgsShow += '<a id="download-res-archieve" href="../uploads/'+archieveName + '.zip'+
				'" download="'+archieveName + '.zip'+'">\n'+
				'<label class="btn btn-default btn-file">\nСкачать архив\n</label>\n</a>\n';
				childProcess.exec('zip ./uploads/' + archieveName + '.zip' + resList);
			}
			if(req.body['make-pdf']=='on'){
				var pdfName = uuid.v4();
				imgsShow += '<a id="download-res-pdf" href="../uploads/'+pdfName + '.pdf'+
				'" download="'+pdfName + '.pdf'+'">\n'+
				'<label class="btn btn-default btn-file">\nСкачать PDF\n</label>\n</a>\n';
				childProcess.exec('img2pdf' + resList+' -o ./uploads/' + pdfName + '.pdf');
			}
			onload = onloadOrig.replace(/insert-imgs-here/,imgsShow);
			fs.writeFileSync('uploads/'+onloadName+'.html', onload);
		});
	}
});

server.use(function (req, res, next) {
	res.status(404)
	.send('<html>'+
	'<head><meta http-equiv="refresh" content="1;URL=http://localhost:3000/webui/index.html" /></head>'+
	'<body>404: Страница не найдена. <br> Если автоматического перенаправления не произошло, нажмите <a href="./webui/index.html">сюда</a> .</body>'+
	'</html>')
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
