var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var extract = require('extract-zip')

var PORT = 8080;
var URL = '/fileupload';

var somewhere

http.createServer(function (req, res) {
    if (req.url == URL) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.file.path;
            var newpath = './uploads/' + files.file.name;
            var noext = (files.file.name).slice(0, -4); // removes the last 4 chars (".zip")
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.writeHead(200, {'Content-Type': 'text/html', "Access-Control-Allow-Origin": "http://localhost:3000"});
                res.write('File uploaded and moved!');
                res.end();

                // extract the files
                extract(newpath, {dir: (process.cwd() + "/uploads/" + noext)}, function (err) {
                    if (err){
                        console.log("Error in extraction: " + err);
                    } else {
                        console.log("Files extracted to " + noext + "/");
                    }
                    
                })
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        /*res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');*/
        return res.end();
    }
}).listen(PORT);
console.log("Listening on port " + PORT);
console.log("Files will be extracted to:")
console.log(process.cwd() + "/uploads/")

// adapted from https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp
// TODO: extract zip files
