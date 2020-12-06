const http = require("http")
const fs = require('fs')
const formidable = require('formidable')
const { grayScale } = require("./IOhandler")
const path = require('path')

const savedImageFolder = `${__dirname}/grayScaled`

const serveStaticFile = require('./src/serveStaticFile')
const imageUpload = require('./src/imageUpload')

let cachedImages = []
let cachedImage, cachedGrayScaled

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
        console.log(cachedImage, cachedGrayScaled)
        serveStaticFile(res, "./public/index.html", "text/html", 200)
    } 
    else if (path ==="/api/image" && req.method.toLowerCase() === "post") {
        imageUpload(req)
        .then(result => {
            cachedImage = result.fields.imageSrc
            return grayScale(result.files.myFile.path, `${__dirname}/public/grayScaled`)
        })
        .then(data => {``
            const newPath = data.replace(`${__dirname}`, 'http://localhost:8000')
            cachedGrayScaled = newPath
            cachedImages.push({cachedImage, cachedGrayScaled})
            cachedImage = undefined
            cachedGrayScaled = undefined
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(JSON.stringify({
                imgSrc: newPath,
            }))
            res.end()
        })
        .catch(err => {
            res.writeHead(500, { "Content-Type": "plain/text" })
            res.write("Internal Sever Error")
            res.end()
        })
    } 
    else if (path.includes('.png')) {
        const matchedContentType = contentTypeList.find(fileType => typeFile.includes(fileType.type))
        if (matchedContentType) {
            serveStaticFile(res, `${__dirname}/${req.url}`, matchedContentType, 200)
        }
    } else if (path === "/api/imageComparison" && req.method.toLowerCase() === "post") {
        let body
        req.on('data', chunk => {
            body = JSON.parse(chunk.toString())

            if (body.grayImgSrc) {
                const matchedImage = cachedImages.find(image => image.cachedGrayScaled === body.grayImgSrc)
                if (matchedImage) {
                    res.writeHead(200, { "Content-Type": "application/json" })
                    res.write(JSON.stringify({
                        originalImgSrc: matchedImage.cachedImage,
                        grayScaledImgSrc: matchedImage.cachedGrayScaled
                    }))
                    res.end()
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" })
                    res.write(JSON.stringify({
                        status: "error"
                    }))
                    res.end()
                }
            } else {
                res.writeHead(200, { "Content-Type": "application/json" })
                res.write(JSON.stringify({
                    status: "error"
                }))
                res.end()
            }
        })
    }
    else {
        const matchedContentType = contentTypeList.find(fileType => typeFile.includes(fileType.type))
        if (matchedContentType) {
            const contentType = matchedContentType.contentType
            serveStaticFile(res, `${__dirname}/public/${req.url}`, contentType, 200)
        }
    }
})

server.listen(8000)