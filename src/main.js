import API from './api.js';
import {postMethodOptions} from './options.js'
import {getMethodOptions} from './options.js'
import getUserFeed from './feedPage.js'
// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');


//=========================================================================================
// Code for logining in and handling all login related activites.
//=========================================================================================
const handleLogin = (res) => {
        localStorage.setItem('token', res.token)
        console.log(res.token)
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


//=========================================================================================
