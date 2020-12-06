const formidable = require('formidable')

function imageUpload(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true })

        form.parse(req, (err, fields, files) => {
            if (err) rejects(err)
            console.log('fields', fields)
            resolve({
                fields,
                files
            })
        })
    })

}

module.exports = imageUpload