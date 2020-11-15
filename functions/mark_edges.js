var mark_edges =  function (colorMap) {
	do {
		var changes = 0;
		for (let i = 0; i < colorMap.length; i++){
			for (let j = 0; j < colorMap[i].length; j++){
				if(colorMap[i][j] == 1 && (i*j==0 || i==colorMap.length-1 || j == colorMap[i].length-1)) {
					colorMap[i][j] = 2;
					changes = 1;
				}
				else if (colorMap[i][j] == 1 && ((colorMap[i+1]||[])[j] == 2 || (colorMap[i-1]||[])[j] == 2)) {
					colorMap[i][j] = 2;
					changes = 1;
				}
				else if (colorMap[i][j] == 0 && ((colorMap[i][j-1] == 2 && colorMap[i][j+1] == 1) || ((colorMap[i-1]||[])[j] == 2 && (colorMap[i+1]||[])[j] == 2))) {
					colorMap[i][j] = 2;
					changes = 1;
				}
			}
		}
    } while (changes != 0);
}
module.exports = mark_edges;
