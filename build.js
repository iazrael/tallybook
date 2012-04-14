/**
 * make for nodejs
 */

var fs = require('fs');

var argus = process.argv.slice(2);

var source = argus[0];
var target = argus[1];

var translateFileList = argus.slice(2);
for(var i = 0, f; f = translateFileList[i]; i++){

	var file = fs.readFileSync(source + f);
	var matchList = {};
	file = file.toString().replace(/<script\s+output="([^"]+)"\s+src="([^"]+)".*?<\/script>/ig, function(m, o, s){
		if(matchList[o]){
			return '';
		}else{
			matchList[o] = 1;
			return '<script src="' + o + '"></script>';
		}
	});
	fs.writeFileSync(target + f, file);

}// end of for

console.log('done');






