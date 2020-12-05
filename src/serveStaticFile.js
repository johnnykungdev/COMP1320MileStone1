const fs = require('fs')

function serveStaticFile(res, path, contentType, httpCode) {
    fs.readFile(path, (error, result) => {
        if (error) {
            res.writeHead(404)
            res.write('Contents not found!')
            res.end()
        } else {    
            res.writeHead(httpCode, { 'Content-Type': contentType })
            res.write(result)
            res.end()
        }
    })
}

module.exports = serveStaticFile