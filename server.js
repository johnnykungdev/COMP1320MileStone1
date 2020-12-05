const http = require("http")
const fs = require('fs')
const formidable = require('formidable')
const { grayScale } = require("./IOhandler")
const path = require('path')

const savedImageFolder = `${__dirname}/grayScaled`

const serveStaticFile = require('./src/serveStaticFile')
const imageUpload = require('./src/imageUpload')

const contentTypeList = [
    {type: ".html", contentType: "text/html"},
    {type: ".css", contentType: "text/css"},
    {type: ".js", contentType: "text/javascript"},
    {type: ".png", contentType: "image/gif"}
]

const server = http.createServer((req, res) => {
    const path = req.url
    const pathArray = req.url.split('/')
    const typeFile = pathArray[pathArray.length - 1]

    if (path === "/" && req.method.toLowerCase() === "get") {
        serveStaticFile(res, "./public/index.html", "text/html", 200)
    } 
    else if (path ==="/api/image" && req.method.toLowerCase() === "post") {
        imageUpload(req)
        .then(data => {
            return grayScale(data.myFile.path, `${__dirname}/public/grayScaled`)
        })
        .then(data => {
            const newPath = data.replace(`${__dirname}`, 'http://localhost:8000')
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(JSON.stringify({
                imgSrc: newPath
            }))
            res.end()
        })
        .catch(err => {
            res.writeHead(500, { "Content-Type": "plain/text" })
            res.write("Internal Sever Error")
            res.end()
        })
        // const form = formidable({ multiples: true })
        
        // form.parse(req, (err, fields, files) => {
        //     grayScale(files.myFile.path, `${__dirname}/public/grayScaled`)
        //     .then(data => {
        //         const newPath = data.replace(`${__dirname}`, 'http://localhost:8000')
        //         res.writeHead(200, { "Content-Type": "application/json" })
        //         res.write(JSON.stringify({
        //             imgSrc: newPath
        //         }))
        //         res.end()
        //     })
        // })
    } 
    else if (path.includes('.png')) {
        const matchedContentType = contentTypeList.find(fileType => typeFile.includes(fileType.type))
        if (matchedContentType) {
            serveStaticFile(res, `${__dirname}/${req.url}`, matchedContentType, 200)
        }
    }
    else {
        const matchedContentType = contentTypeList.find(fileType => typeFile.includes(fileType.type))
        if (matchedContentType) {
            serveStaticFile(res, `${__dirname}/public/${req.url}`, matchedContentType, 200)
        }
    }
})

server.listen(8000)