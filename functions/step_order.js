//var h = Number(process.argv[2]), w = Number(process.argv[3]);

var step_order = function (height, width) {
    var stepOrder = [];
    var mas = [];
    for (let i = 0; i < height;i++){
        mas[i] = [];
        for (let j = 0; j < width;j++){
            mas[i][j] = 0;
        }
    }
    var center = find_center(mas);
    for (let i = 0;i < height;i++){
        //console.log(mas[i].join(', '))
    }
    //console.log(center);

    snail(mas, center[0], center[1], stepOrder);
    for (let i = 0;i < height;i++){
        //console.log(mas[i].join(', '))
    }
    return stepOrder.slice(0,-1);
}

//var stepOrder = step_order(h, w);
//console.log(stepOrder);

function find_center (mas) {
    var h = mas.length, w = mas[0].length;
    if (h%2 === 0 && w%2 === 0) {
        let centerH1 = h/2, centerH2 = h/2-1;
        let centerW1 = w/2, centerW2 = w/2-1;
        mas[centerH1][centerW1] = 1;
        mas[centerH1][centerW2] = 1;
        mas[centerH2][centerW1] = 1;
        mas[centerH2][centerW2] = 1;
        if (h > w) {
            let n = (h - w)/2;
            for(let i = centerH1 + 1, j = centerH2 - 1; i < centerH1 + 1 + n; i++) {
                mas[i][centerW1] = 1;
                mas[j][centerW1] = 1;
                mas[i][centerW2] = 1;
                mas[j][centerW2] = 1;
                j--;
            }
        }
        else if (h < w) {
            let n = (w - h)/2;
            for(let i = centerW1 + 1, j = centerW2 - 1; i < centerW1 + 1 + n; i++) {
                mas[centerH1][i] = 1;
                mas[centerH1][j] = 1;
                mas[centerH2][i] = 1;
                mas[centerH2][j] = 1;
                j--;
            }
        }
    }
    else if (h%2 != 0 && w%2 === 0) {
        let centerH = (h - 1)/2;
        let centerW1 = w/2, centerW2 = w/2-1;
        mas[centerH][centerW1] = 1;
        mas[centerH][centerW2] = 1;
        if (h > w) {
            let n = (h - w + 1)/2;
            for(let i = centerH + 1, j = centerH - 1; i < centerH + 1 + n; i++) {
                mas[i][centerW1] = 1;
                mas[j][centerW1] = 1;
                mas[i][centerW2] = 1;
                mas[j][centerW2] = 1;
                j--;
            }
        }
        else if (h < w) {
            let n = (w - h - 1)/2;
            for(let i = centerW1 + 1, j = centerW2 - 1; i < centerW1 + 1 + n; i++) {
                mas[centerH][i] = 1;
                mas[centerH][j] = 1;
                j--;
            }
        }
    }
    else if (h%2 === 0 && w%2 != 0) {
        let centerW = (w - 1)/2;
        let centerH1 = h/2, centerH2 = h/2-1;
        mas[centerH1][centerW] = 1;
        mas[centerH2][centerW] = 1;
        if (h > w) {
            let n = (h - w - 1)/2;
            for(let i = centerH1 + 1, j = centerH2 - 1; i < centerH1 + 1 + n; i++) {
                mas[i][centerW] = 1;
                mas[j][centerW] = 1;
                j--;
            }
        }
        else if (h < w) {
            let n = (w - h + 1)/2;
            for(let i = centerW + 1, j = centerW - 1; i < centerW + 1 + n; i++) {
                mas[centerH1][i] = 1;
                mas[centerH1][j] = 1;
                mas[centerH2][i] = 1;
                mas[centerH2][j] = 1;
                j--;
            }
        }
    }
    else if (h%2 != 0 && w%2 != 0) {
        let centerW = (w - 1)/2;
        let centerH = (h - 1)/2;
        mas[centerH][centerW] = 1;
        if (h > w) {
            let n = (h - w)/2;
            for(let i = centerH + 1, j = centerH - 1; i < centerH + 1 + n; i++) {
                mas[i][centerW] = 1;
                mas[j][centerW] = 1;
                j--;
            }
        }
        else if (h < w) {
            let n = (w - h)/2;
            for(let i = centerW + 1, j = centerW - 1; i < centerW + 1 + n; i++) {
                mas[centerH][i] = 1;
                mas[centerH][j] = 1;
                j--;
            }
        }
    }
    var centerArea = [];
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (mas[i][j] === 1) {
                centerArea[0] = i;
                centerArea[1] = j;
                return centerArea;
            }
        }
    }
}

function snail (mas, x, y, stepOrder) {
    var num = 2;
    do {
        do {
            mas[x-1][y] = num;
            stepOrder.push([x-1,y]);
            //console.log(x-1,y);
            num++;
            y++;
        } while (mas[x][y-1] != 0);
        //console.log(mas,'\n');
        do {
            mas[x][y-1] = num;
            stepOrder.push([x,y-1]);
            //console.log(x,y);
            num++;
            x++;
        } while (mas[x-1][y-2] != 0 && mas[x-1] != undefined);
        //console.log(mas,'\n');
        
        do {
            mas[x-1][y-2] = num;
            stepOrder.push([x-1,y-2]);
            //console.log(x,y-1);
            num++;
            y--;
        } while ((mas[x-3] || [])[y-1] != 0 && mas[x-3] != undefined);
        //console.log(mas,'\n');
        
        do {
            (mas[x-2] || [])[y-1] = num;
            stepOrder.push([x-2,y-1]);
            //console.log(x-1,y);
            num++;
            x--;
        } while ((mas[x-1] || [])[y] != 0 && mas[x-1] != undefined);
        //console.log(mas,'\n');

        //console.log('e: '+ x + ' ' + y);
    } while (x>0 && y>0);
}

module.exports = step_order;
