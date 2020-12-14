//активация подсказок
$('#simplify-big-areas-info').tooltip({html: 'true', placement: 'right'});
$('#simplify-areas-info').tooltip({html: 'true', placement: 'right'});
$('#grids-info').tooltip({html: 'true', placement: 'right'});
$('#do-colors-to-paper-info').tooltip({html: 'true', placement: 'right'});
$('#colors-to-paper-info').tooltip({html: 'true', placement: 'right'});
$('#divide-info').tooltip({html: 'true', placement: 'right'});
$('#simplify-treshold-info').tooltip({html: 'true', placement: 'right'});

//название файла рядом с кнопкой загрузки
$('#filedata').change(function(){
    var files = document.getElementById("filedata").files;
    var fileList = '| ';
    for(let i=0;i<files.length;i++){
        fileList += '   ' + files[i].name + ' (' + Math.ceil(files[i].size/1024) + ' кБ) |'
    }
    $('#loading-button').text(fileList);
});

$('#simplify-areas').click(function(){
    if(!document.getElementById('simplify-areas').checked) {
        document.getElementById('simplify-areas-settings').setAttribute('style','display:none');
        document.getElementById('grid-to-work').setAttribute('style','display:auto');
    } else {
        document.getElementById('simplify-areas-settings').setAttribute('style','display:auto');
        document.getElementById('grid-to-work').setAttribute('style','display:none');
    }
})

$('#simplify-big-areas').click(function(){
    if(!document.getElementById('simplify-big-areas').checked) {
        document.getElementById('big-grid-input').setAttribute('style','display:none')
    } else {
        document.getElementById('big-grid-input').setAttribute('style','display:auto')
    }
})

$('#do-colors-to-paper').click(function(){
    if(!document.getElementById('do-colors-to-paper').checked) {
        document.getElementById('colors-to-paper-settings').setAttribute('style','display:none')
    } else {
        document.getElementById('colors-to-paper-settings').setAttribute('style','display:auto')
    }
})

$('#do-height-divide').click(function(){
    if(!document.getElementById('do-height-divide').checked) {
        document.getElementById('height-divide-input').setAttribute('style','display:none')
    } else {
        document.getElementById('height-divide-input').setAttribute('style','display:auto')
    }
})


$('#do-width-divide').click(function(){
    if(!document.getElementById('do-width-divide').checked) {
        document.getElementById('width-divide-input').setAttribute('style','display:none')
    } else {
        document.getElementById('width-divide-input').setAttribute('style','display:auto')
    }
})
