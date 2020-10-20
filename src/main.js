import API from './api.js';
import {postMethodOptions} from './options.js'
import {getMethodOptions} from './options.js'
import getUserFeed from './registerPage.js'
// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');
var userToken = '';


//=========================================================================================
// Code for logining in and handling all login related activites.
//=========================================================================================
const handleLogin = (res) => {
        localStorage.setItem('token', res.token)
        const loginPage = document.getElementById('loginPage');
        loginPage.style.display = 'none';
        const feedPage = document.getElementById('feedPage');
        feedPage.style.display = 'flex';
        getUserFeed();
}

const handleFailLogin = (err) => {
    const username = document.getElementsByName('usernameLogin')
    username[0].style.border = '1px solid red';
    const password = document.getElementsByName('passwordLogin')
    password[0].style.border = '1px solid red';
    const errorMessageDisplay = document.createElement('p')
    errorMessageDisplay.textContent = err;
    errorMessageDisplay.id = 'errorMessageDisplayForLogin';
    document.getElementById('formLoginPage').appendChild(errorMessageDisplay);
}

var registerButtonForLoginPage = document.getElementById('registerButtonForLoginPage');
var loginButtonForLoginPage = document.getElementById('loginButtonForLoginPage')
let loginForm = document.forms.loginForm;

loginButtonForLoginPage.addEventListener('click', (event) => {
    event.preventDefault();
    const username = loginForm.elements.usernameLogin.value;
    const password = loginForm.elements.passwordLogin.value;

    if (username === '' || password === '') {
        alert('Please enter required fields');
    } else {
        const userInfo = {
            'username': username,
            'password': password
        }
        postMethodOptions.body = JSON.stringify(userInfo);
        api.makeAPIRequest('auth/login', postMethodOptions)
            .then(res => {
                handleLogin(res)
            })
            .catch(err => {
                handleFailLogin(err);
            })
    }
})

registerButtonForLoginPage.addEventListener('click', (event) => {
    event.preventDefault();
    const loginPage = document.getElementById('loginPage');
    loginPage.style.display = 'none';
    const registerPage = document.getElementById('registerPage')
    registerPage.style.display = 'flex'
})

//=========================================================================================
// Code for registration and handling all registration related activites.
//=========================================================================================

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
        userToken = res.token;
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
//=========================================================================================

export default function getUserToken() {
    return userToken;
}