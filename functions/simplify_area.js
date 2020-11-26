var Jimp = require('jimp');
var math = require('mathjs');
var simplify_area = function (image, col, row, grid, gridWidth, gridHeight, maxStd, simpleMap) {
    var redData = [], greenData = [], blueData = [];//значения rgb в каждом пикселе плитки
    var redTot = 0, greenTot = 0, blueTot = 0;//всего цвета в 1 плитке
    image.scan(col, row, gridWidth, gridHeight, function(x, y, idx) {
        let red = this.bitmap.data[idx + 0];
        let green = this.bitmap.data[idx + 1];
        let blue = this.bitmap.data[idx + 2];
        redTot += red;
        greenTot += green;
        blueTot += blue;
        redData.push(red);
        greenData.push(green);
        blueData.push(blue);
    });
    let devi = math.std([redData, greenData, blueData], 1);
    if (devi[0] < maxStd && devi[1] < maxStd && devi[2] < maxStd){
        let r = Math.floor(redTot/(gridWidth*gridHeight));
        let g = Math.floor(greenTot/(gridWidth*gridHeight));
        let b = Math.floor(blueTot/(gridWidth*gridHeight));
        simpleMap[row/grid][col/grid] = {'red':r,'green':g,'blue':b};
        let hex = Jimp.rgbaToInt(r, g, b, 255);
        for (let i = row; i < row + gridHeight; i++){
            for (let j = col; j < col + gridWidth; j++){
                image.setPixelColor(hex, j, i);
            }
        }
    }
    else {
        simpleMap[row/grid][col/grid] = 0;
    }
}

module.exports = simplify_area;
