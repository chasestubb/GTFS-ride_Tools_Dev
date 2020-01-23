var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

var PORT = 8080;
var URL = '/fileupload';

http.createServer(function (req, res) {
    if (req.url == URL) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.file.path;
            var newpath = './uploads/' + files.file.name.toString();
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "http://localhost:3000"});
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(PORT);

// adapted from https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp
// TODO: extract zip files
