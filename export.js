// resume-cli has no way of exporting with a local theme yet, export it manually

var fs = require('fs');

if (process.argv.length === 2) {
    var file = `${process.cwd()}/resume.json`;
} else {
    var file = process.argv[2];
}

fs.readFile(file, function(err, resumeJson) {
    var resumeJson;
    if (err) {
        console.log('resume.json does not exist');
        return;
    } else {
        resumeJson = JSON.parse(resumeJson);
    }
    var render = require(process.cwd() + '/index').render;
    fs.writeFileSync(process.cwd() + '/index.html', render(resumeJson));
});