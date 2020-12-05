//активация подсказок
$('#simplify-big-areas-info').tooltip({html: 'true', placement: 'right'});
$('#simplify-areas-info').tooltip({html: 'true', placement: 'right'});
$('#grids-info').tooltip({html: 'true', placement: 'right'});

//название файла рядом с кнопкой загрузки
$('#filedata').change(function(){
    var name = document.getElementById("filedata").files[0].name;
    var size = Math.ceil(document.getElementById("filedata").files[0].size/1024);
    $('#loading-button').text('  ' + name + ' ' + size + ' кБ');
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
