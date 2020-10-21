import API from './api.js';
import {postMethodOptions} from './options.js'

const api = new API('http://localhost:5000');


var registerButtonForRegisterPage = document.getElementById('registerButtonForRegisterPage')
var loginButtonForRegisterPage = document.getElementById('loginButtonForRegisterPage')
const registerForm = document.forms.registerForm

const handleNotEqualPasswords = () => {
    const username = document.getElementsByName('usernameRegister')
    username[0].style.border = ""
    const password = document.getElementsByName('passwordRegister')
    password[0].style.border = '1px solid red';
    password[0].textContent = ""
    const passwordConfirm = document.getElementsByName('passwordConfirmRegister')
    passwordConfirm[0].style.border = '1px solid red';
    passwordConfirm[0].textContent = '';
    if (document.getElementById('errorMessageDisplayForRegister')) {
        const errorMessageDisplay = document.getElementById('errorMessageDisplayForRegister');
        errorMessageDisplay.textContent = errorMessageDisplay.textContent = "Entered passwords do not match.";
    } else {
        const errorMessageDisplay = document.createElement('p');
        errorMessageDisplay.textContent = "Entered passwords do not match.";
        errorMessageDisplay.id = 'errorMessageDisplayForRegister'
        document.getElementById('formRegisterPage').appendChild(errorMessageDisplay);
    }
}

const handleRegister = (res) => {
        const registerPage = document.getElementById('registerPage');
        registerPage.style.display = 'none';
        const feedPage = document.getElementById('feedPage')
        feedPage.style.display = 'flex';
}

const handleFailRegister = (err) => {
    const username = document.getElementsByName('usernameRegister')
    username[0].style.border = '1px solid red';
    const password = document.getElementsByName('passwordRegister')
    password[0].style.border = '';
    const passwordConfirm = document.getElementsByName('passwordConfirmRegister')
    passwordConfirm[0].style.border = '';
    if (document.getElementById('errorMessageDisplayForRegister')) {
        const errorMessageDisplay = document.getElementById('errorMessageDisplayForRegister');
        errorMessageDisplay.textContent = err;
    } else {
        const errorMessageDisplay = document.createElement('p');
        errorMessageDisplay.textContent = err;
        errorMessageDisplay.id = 'errorMessageDisplayForRegister'
        document.getElementById('formRegisterPage').appendChild(errorMessageDisplay);
    }
}
registerButtonForRegisterPage.addEventListener('click', (event) => {
    event.preventDefault()
    const username = registerForm.elements.usernameRegister.value
    const password = registerForm.elements.passwordRegister.value;
    const passwordConfirm = registerForm.elements.passwordConfirmRegister.value;
    const email = registerForm.elements.emailRegister.value;
    const name = registerForm.elements.nameRegister.value;
    if (username === '' || password === '' || passwordConfirm === '' || email === '' || name === '') {
        alert('Please enter required fields')
    } else if (password !== passwordConfirm) {
        handleNotEqualPasswords();
    } else {
        const userInfo = {
            username: username,
            password: password,
            email: email,
            name: name
        }
        postMethodOptions.body = JSON.stringify(userInfo)
        api.makeAPIRequest('auth/signup', postMethodOptions)
            .then(res => handleRegister(res))
            .catch(err => {
                handleFailRegister(err)
            })
    }
})

loginButtonForRegisterPage.addEventListener('click', (event) => {
    event.preventDefault()
    const registerPage = document.getElementById('registerPage');
    registerPage.style.display = 'none'
    const loginPage = document.getElementById('loginPage');
    loginPage.style.display = 'flex'
})