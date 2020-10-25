import API from './api.js';
import {getMethodOptions, putMethodOptions} from './options.js'
import getUserFeed from './feedPage.js';
import getUserProfile from './profilePage.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const goHomeButton = document.getElementById('goHome')
goHomeButton.addEventListener('click', () => {
    const profilePage = document.getElementById('profilePage')
    profilePage.style.display = 'none'
    const userFeed = document.getElementById('userFeed')
    userFeed.style.display = 'flex'
    const editProfileButton = document.getElementById('editMyProfile')
    editProfileButton.style.display = 'none'
    getUserFeed()
})

const goToMyProfileButton = document.getElementById('myProfile')
goToMyProfileButton.addEventListener('click', () => {
    const profilePage = document.getElementById('profilePage')
    profilePage.style.display = 'flex'
    const userFeed = document.getElementById('userFeed')
    userFeed.style.display = 'none'
    const editProfileButton = document.getElementById('editMyProfile')
    editProfileButton.style.display = 'block'
    getUserProfile("", true)
    
})

const updateButtonClickHandler = () => {
    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/', getMethodOptions)
        .then(response => {
            putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
            let editProfileForm = document.forms.editProfileForm
            let newEmail = editProfileForm.elements.changeEmail.value   
            let newName = editProfileForm.elements.changeName.value 
            let newPassword = editProfileForm.elements.changePassword.value
            let newBody = {}

            if (newEmail.length != 0) {
                newBody.email = newEmail
            } 
            if (newName.length != 0) {
                newBody.name = newName
            } 
            if (newPassword.length != 0) {
                newBody.password = newPassword
            }
            
            putMethodOptions.body = JSON.stringify(newBody)
            api.makeAPIRequest('user/', putMethodOptions)
                .then(response => {
                    
                })
                .catch(error => console.log(error))
        })
}

const editMyProfileButton = document.getElementById('editMyProfile')
editMyProfileButton.addEventListener('click', () => {
    let modalContent = document.getElementById("modal-content");
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    let editProfileForm = document.createElement("form")
    editProfileForm.name = "editProfileForm"

    let changeEmail = document.createElement("input")
    changeEmail.type = 'text'
    changeEmail.name = 'changeEmail'
    changeEmail.placeholder = 'Change Your Email'
    editProfileForm.appendChild(changeEmail)

    let changeName = document.createElement("input")
    changeName.type = 'text'
    changeName.name = 'changeName'
    changeName.placeholder = 'Change Your Name'
    editProfileForm.appendChild(changeName)

    let changePassword = document.createElement("input")
    changePassword.type = 'password'
    changePassword.name = 'changePassword'
    changePassword.placeholder = 'Change Your Password'
    editProfileForm.appendChild(changePassword)

    modalContent.appendChild(editProfileForm)

    let updateButton = document.createElement('button')
    updateButton.className = 'updateButton'
    updateButton.textContent = "UPDATE"
    updateButton.addEventListener('click', () => {
        updateButtonClickHandler()
        modal.style.display = "none";
        modalWindow.style.display = 'none'
    })
    modalContent.appendChild(updateButton)
    let modal = document.getElementById('myModal')
    let span = document.getElementById('close')
    let modalWindow = document.getElementById('modalWindow')
    modalWindow.style.display = 'block'
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        modalWindow.style.display = 'none'
    }
    
})

const logOutButton = document.getElementById('logOutButton')
logOutButton.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.reload()
})