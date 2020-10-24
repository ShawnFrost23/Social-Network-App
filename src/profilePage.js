import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions} from './options.js'

// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const handleResponse = (user) => {
    const profilePage = document.getElementById('profilePage')
    if (profilePage.hasChildNodes()) {
        while (profilePage.firstChild) {
            profilePage.removeChild(profilePage.firstChild);
        }
    }
    const userNameSection = document.createElement('div')
    userNameSection.className = "userNameSection"
    userNameSection.textContent = user.username
    profilePage.appendChild(userNameSection)

    const nameSection = document.createElement('div')
    nameSection.className = "nameSection"
    nameSection.textContent = user.name
    profilePage.appendChild(nameSection)

    const followInfo = document.createElement('div')
    followInfo.className = "followInfo"

    const numFollowers = document.createElement('div')
    numFollowers.className = "numFollowers"
    numFollowers.textContent = "Followers: " + user.followed_num
    followInfo.appendChild(numFollowers)
    
    const numFollowing = document.createElement('div')
    numFollowing.className = "numFollowing"
    numFollowing.textContent = "Following: " + user.following.length
    followInfo.appendChild(numFollowing)

    profilePage.appendChild(followInfo)

}

export default function getUserProfile(user) {
    console.log("Hey username " + user + " pressed");
    const userFeed = document.getElementById('userFeed')
    userFeed.style.display = 'none'
    const userProfile = document.getElementById('profilePage')
    userProfile.style.display = 'flex'
    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/?username=' + user, getMethodOptions)
        .then((response) => {
            console.log("User returned" + response);
            handleResponse(response)
        })
        .catch((error) => console.log(error));
}