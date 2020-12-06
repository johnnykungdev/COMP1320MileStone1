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
        // const grayScaledImage = document.getElementById('grayScaled')
        // grayScaledImage.src = data.imgSrc
        window.location.href = "/finish.html"
    })
    .catch(error => console.log(error))
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
    imagePreview.style.width = "100%"
    imagePreview.style.height = "100%"
    imagePreview.style.zIndex = "500"
    imageContainer.appendChild(imagePreview)
}

imageInputValue.addEventListener('change', function(e) {
    return previewImage(e)
})