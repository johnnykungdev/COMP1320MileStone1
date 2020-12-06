const imageInputValue = document.getElementById('imageInput')
const submitButton = document.getElementById('submit')

function uploadImage(e) {
    e.preventDefault()
    const uploadedImage = document.getElementById('imageInput').files[0]
    const imagePreview = document.getElementById('imagePreview')
    if (uploadedImage) {
        console.log(uploadedImage)
        console.log("123")
        const formData = new FormData()
        formData.append("myFile", uploadedImage)
        formData.append("imageSrc", imagePreview.src)
    
        fetch("http://localhost:8000/api/image", {
            method: "POST",
            body: formData
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            // const grayScaledImage = document.getElementById('grayScaled')
            // grayScaledImage.src = data.imgSrc
            state = data
            localStorage.setItem('grayImgSrc', data.imgSrc)
            window.location.href = "/finish.html"
        })
        .catch(error => console.log(error))
    }
}

submitButton.addEventListener("click", function(e) {
    return uploadImage(e)
})

console.log("js")

function previewImage(e) {
    console.log(e.target.files)
    const imageContainer = document.querySelector('.imageContainer')
    const imagePreview = document.createElement('img')
    imagePreview.src = URL.createObjectURL(e.target.files[0])
    console.log(URL.createObjectURL(e.target.files[0]))
    imagePreview.style.width = "100%"
    imagePreview.style.height = "100%"
    imagePreview.style.zIndex = "500"
    imagePreview.id = "imagePreview"
    imageContainer.appendChild(imagePreview)
}

imageInputValue.addEventListener('change', function(e) {
    return previewImage(e)
})

function fetchImages() {
    const grayImgSrc = localStorage.getItem('grayImgSrc')
    fetch('http://localhost:8000/api/imageComparison', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grayImgSrc })
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        if (data.status !== "error") {
            let imagePreview = document.getElementById('imagePreview')
            const grayScaledPreview = document.getElementById('grayScaled')
            if (imagePreview) {
                imagePreview.src = data.originalImgSrc
                grayScaledPreview.src = data.grayScaleImgSrc
            } else {
                const imageContainer = document.querySelector('.imageContainer')
                imagePreview = document.createElement('img')
                imagePreview.src = data.originalImgSrc
                imagePreview.style.width = "100%"
                imagePreview.style.height = "100%"
                imagePreview.style.zIndex = "500"
                imagePreview.id = "imagePreview"
                imageContainer.appendChild(imagePreview)
                grayScaledPreview.src = data.grayScaledImgSrc
            }
        }
    })
    .catch(error => console.log(error))
}

fetchImages()