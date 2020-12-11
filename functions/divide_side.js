var divide_side = function(sideLength, partCount) {
    if(partCount > sideLength) {
        return [0,sideLength];
    }
    var points = [0];
    var s=0;
    for(let i=0;i<partCount;i++){
        s+=Math.floor(sideLength/partCount);
        //console.log(s);
        points.push(s);
    }
    points[points.length-1]+=sideLength%partCount;
    return points;
}

module.exports = divide_side;
