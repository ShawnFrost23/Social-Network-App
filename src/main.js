import API from './api.js';
// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// const data = {
//     "username": "xX_greginator_Xxb",
//     "password": "1234",
//     "email": "greg@fred.com",
//     "name": "greg"
// }
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify()
}

const handleLogin = (res) => {
    if (res.token) {
        const loginPage = document.getElementById('loginPage');
        loginPage.style.display = 'none';
        const feedPage = document.getElementById('feedPage');
        feedPage.style.display = 'flex';
    } else if (res.message) {
        const username = document.getElementsByName('usernameLogin')
        username[0].style.border = '1px solid red';
        const password = document.getElementsByName('passwordLogin')
        password[0].style.border = '1px solid red';
        const errorMessageDisplay = document.getElementById('errorMessageDisplayForLogin');
        errorMessageDisplay.textContent = res.message;
    }
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
        options.body = JSON.stringify(userInfo);
        api.makeAPIRequest('auth/login', options)
            .then(res => handleLogin(res))
            .catch(err => {
                console.log(err)
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
    const errorMessageDisplay = document.getElementById('errorMessageDisplayForRegister')
    errorMessageDisplay.textContent = "Entered passwords do not match.";
}

const handleRegister = (res) => {
    if (res.token) {
        const registerPage = document.getElementById('registerPage');
        registerPage.style.display = 'none';
        const feedPage = document.getElementById('feedPage')
        feedPage.style.display = 'flex';
    } else if (res.message) {
        const username = document.getElementsByName('usernameRegister')
        username[0].style.border = '1px solid red';
        const password = document.getElementsByName('passwordRegister')
        password[0].style.border = '';
        const passwordConfirm = document.getElementsByName('passwordConfirmRegister')
        passwordConfirm[0].style.border = '';
        const errorMessageDisplay = document.getElementById('errorMessageDisplayForRegister')
        errorMessageDisplay.textContent = res.message;
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
        options.body = JSON.stringify(userInfo)
        api.makeAPIRequest('auth/signup', options)
            .then(res => handleRegister(res))
            .catch(err => {
                console.log(err)
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