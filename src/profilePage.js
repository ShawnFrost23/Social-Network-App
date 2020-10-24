import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions} from './options.js'
import { createPostDiv } from './feedPage.js';


// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const followButtonClickHandler = (user) => {
    console.log("Follow button clicked for " + user.username);
    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/follow?username=' + user.username, putMethodOptions)
        .then(response => {
            console.log("Follow: " + response);
            getFollowingInfo(user)
        })
}

const unfollowButtonClickHandler = (user) => {
    console.log("Unfollow button clicked for " + user.username);
    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/unfollow?username=' + user.username, putMethodOptions)
        .then(response => {
            console.log("Unfollow: " + response);
            getFollowingInfo(user)
        })
    
}

const getFollowingInfo = (user) => {

    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/?username=' + user.username, getMethodOptions)
        .then((response) => {
            const numFollowers = document.getElementById('numFollowers')
            numFollowers.textContent = "Followers: " + response.followed_num
    
            const numFollowing = document.getElementById('numFollowing')
            numFollowing.textContent = "Following: " + response.following.length
        })
        .catch((error) => console.log(error));
}

const handleResponse = (user, isMyProfile) => {
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
    numFollowers.id = "numFollowers"
   
    const numFollowing = document.createElement('div')
    numFollowing.id = "numFollowing"

    getFollowingInfo(user)
    followInfo.appendChild(numFollowers)
    followInfo.appendChild(numFollowing)

    profilePage.appendChild(followInfo)
    if (!isMyProfile) {
        const followTheUser = document.createElement('div')
        followTheUser.className = 'followTheUser'

        const followButton = document.createElement('button')
        followButton.className = 'followButton'
        followButton.textContent = 'Follow'
        followButton.addEventListener('click', () => {
            followButtonClickHandler(user)
        })
        followTheUser.appendChild(followButton)

        const unfollowButton = document.createElement('button')
        unfollowButton.className = 'unfollowButton'
        unfollowButton.textContent = 'Unfollow'
        unfollowButton.addEventListener('click', () => {
            unfollowButtonClickHandler(user)
        })
        followTheUser.appendChild(unfollowButton)

        profilePage.appendChild(followTheUser)

    }

    const content = document.createElement('div')
    content.className = 'content'
    content.id = 'userProfile'
    profilePage.appendChild(content)
    if (user.posts.length == 0) {
        content.textContent = "Make you first post to see it here."
    }
    user.posts.forEach(postId => {
        getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
        api.makeAPIRequest('post/?id=' + postId, getMethodOptions)
            .then(response => {
                console.log(response);
                let content = document.getElementById('userProfile')
                let imageBox = document.createElement('div')
                imageBox.className = 'imageBox'
                imageBox.id = response.id;
                content.appendChild(imageBox)
                createPostDiv(response);
            })
    })
    
}

export default function getUserProfile(user, isMyProfile) {
    console.log("Hey username " + user + " pressed");
    const userFeed = document.getElementById('userFeed')
    if (userFeed.hasChildNodes()) {
        while (userFeed.firstChild) {
            userFeed.removeChild(userFeed.firstChild);
        }
    }
    userFeed.style.display = 'none'

    const userProfile = document.getElementById('profilePage')
    userProfile.style.display = 'flex'
    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/?username=' + user, getMethodOptions)
        .then((response) => {
            handleResponse(response, isMyProfile)
        })
        .catch((error) => console.log(error));
}