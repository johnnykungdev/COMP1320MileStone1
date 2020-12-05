const imageInputValue = document.getElementById('imageInput')
const submitButton = document.getElementById('submit')

function uploadImage(e) {
    e.preventDefault()
    console.log(imageInputValue)
    console.log("123")
    const files = imageInputValue.files
    const formData = new FormData()
    formData.append("myFile", files[0])

    fetch("http://localhost:8000/api/image", {
        method: "POST",
        body: formData
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        const grayScaledImage = document.getElementById('grayScaled')
        grayScaledImage.src = data.imgSrc
    })
    .catch(error => console.log(error))
}

submitButton.addEventListener("click", function(e) {
    return uploadImage(e)
})

console.log("js")

function previewImage(e) {
    console.log(e.target.files)
    const imagePreview = document.getElementById('imagePreview')
    imagePreview.src = URL.createObjectURL(e.target.files[0])
}

imageInputValue.addEventListener('change', function(e) {
    return previewImage(e)
})