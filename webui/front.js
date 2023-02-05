//активация подсказок
$('#simplify-big-areas-info').tooltip({html: 'true', placement: 'right'});
$('#simplify-areas-info').tooltip({html: 'true', placement: 'right'});
$('#grids-info').tooltip({html: 'true', placement: 'right'});
$('#do-colors-to-paper-info').tooltip({html: 'true', placement: 'right'});
$('#colors-to-paper-info').tooltip({html: 'true', placement: 'right'});
$('#divide-info').tooltip({html: 'true', placement: 'right'});
$('#simplify-treshold-info').tooltip({html: 'true', placement: 'right'});
$('#do-pixel-colors-info').tooltip({html: 'true', placement: 'right'});

//название файла рядом с кнопкой загрузки
$('#filedata').change(function(){
    var files = document.getElementById("filedata").files;
    var fileList = '| ';
    for(let i=0;i<files.length;i++){
        fileList += '   ' + files[i].name + ' (' + Math.ceil(files[i].size/1024) + ' кБ) |'
    }
    $('#loading-button').text(fileList);
});

$('#simplify-big-areas').click(function(){
    if(!document.getElementById('simplify-big-areas').checked) {
        $('#big-grid-input').children().attr('disabled','disabled')
    } else {
        $('#big-grid-input').children().removeAttr('disabled')
    }
})

$('#do-colors-to-paper').click(function(){
    if(!document.getElementById('do-colors-to-paper').checked) {
        $('#colors-to-paper-settings').find('input, textarea, button, select').attr('disabled','disabled')
    } else {
        $('#colors-to-paper-settings').find('input, textarea, button, select').removeAttr('disabled')
    }
})

$('#do-height-divide').click(function(){
    if(!document.getElementById('do-height-divide').checked) {
        $('#height-divide-input').children().attr('disabled','disabled')
    } else {
        $('#height-divide-input').children().removeAttr('disabled')
    }
})


$('#do-width-divide').click(function(){
    if(!document.getElementById('do-width-divide').checked) {
        $('#width-divide-input').children().attr('disabled','disabled')
    } else {
        $('#width-divide-input').children().removeAttr('disabled')
    }
})

$('#send-imgs').click(function(){
    document.getElementById('display-results').setAttribute('style','display:auto')
})
