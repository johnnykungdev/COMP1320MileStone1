const formidable = require('formidable')

function imageUpload(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true })

        form.parse(req, (err, fields, files) => {
            if (err) rejects(err)
            resolve(files)
        })
    })

}

module.exports = imageUpload

// grayScale(files.myFile.path, `${__dirname}/public/grayScaled`)
        // .then(data => {
        //     const newPath = data.replace(`${__dirname}`, 'http://localhost:8000')
        //     res.writeHead(200, { "Content-Type": "application/json" })
        //     res.write(JSON.stringify({
        //         imgSrc: newPath
        //     }))
        //     res.end()
        // })