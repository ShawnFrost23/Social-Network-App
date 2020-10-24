import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions} from './options.js'
import getUserFeed from './feedPage.js';

// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const goHomeButton = document.getElementById('goHome')
goHomeButton.addEventListener('click', () => {
    const profilePage = document.getElementById('profilePage')
    profilePage.style.display = 'none'
    const userFeed = document.getElementById('userFeed')
    userFeed.style.display = 'flex'
    getUserFeed()
})