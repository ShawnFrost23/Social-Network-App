import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions} from './options.js'
import { createPostDiv } from './feedPage.js';


// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const followButtonClickHandler = (user) => {
    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/follow?username=' + user.username, putMethodOptions)
        .then(response => {
            getFollowingInfo(user)
        })
}

const unfollowButtonClickHandler = (user) => {
    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('user/unfollow?username=' + user.username, putMethodOptions)
        .then(response => {
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

const removePrefix = (string) => {
    if (string.includes("jpeg")) {
        return string.replace('data:image/jpeg;base64,', '')
    } else if (string.includes("png")) {
        return string.replace('data:image/png;base64,', '')
    } else if (string.includes("jpg")) {
        return string.replace('data:image/jpg;base64,', '')
    }
}

const postButtonClickHandler = () => {
    let postForm = document.forms.postAddingForm
    let uploadedImage = postForm.elements.uploadFile.files[0];
    let newPromise = fileToDataUrl(uploadedImage)
    newPromise
        .then(
            response=> {
                let newUrl = removePrefix(response)
                let postDescription = postForm.elements.descriptionOfPost.value
                postMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
                let newBody = {
                    'description_text': postDescription,
                    'src': newUrl
                }
                postMethodOptions.body = JSON.stringify(newBody)
                api.makeAPIRequest('post/' , postMethodOptions)
                    .then(response => {
                        getUserProfile("", true)
                    })
                    .catch(error => console.log(error))
            })
}

const newPostButtonClickHandler = () => {
    let modalContent = document.getElementById("modal-content");
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    let postAddingForm = document.createElement("form")
    postAddingForm.name = "postAddingForm"
    postAddingForm.id = "postAddingForm"

    let descriptionText = document.createElement("input")
    descriptionText.type = 'text'
    descriptionText.name = 'descriptionOfPost'
    descriptionText.className = "formInput"
    descriptionText.placeholder = 'Post Description'
    postAddingForm.appendChild(descriptionText)

    let uploadFile = document.createElement('input')
    uploadFile.type = 'file'
    uploadFile.name = 'uploadFile'
    postAddingForm.appendChild(uploadFile)

    modalContent.appendChild(postAddingForm)

    let postButton = document.createElement('button')
    postButton.className = 'postButton'
    postButton.textContent = "POST"
    postButton.addEventListener('click', () => {
        postButtonClickHandler()
        modal.style.display = "none";
        modalWindow.style.display = 'none'
    })
    modalContent.appendChild(postButton)
    let modal = document.getElementById('myModal')
    let span = document.getElementById('close')
    let modalWindow = document.getElementById('modalWindow')
    modalWindow.style.display = 'block'
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        modalWindow.style.display = 'none'
    }
}

const handleResponse = (user, isMyProfile) => {
    const profilePage = document.getElementById('profilePage')
    if (profilePage.hasChildNodes()) {
        while (profilePage.firstChild) {
            profilePage.removeChild(profilePage.firstChild);
        }
    }
    const nameSection = document.createElement('div')
    nameSection.className = "nameSection"
    nameSection.textContent = user.name
    profilePage.appendChild(nameSection)

    const userNameSection = document.createElement('div')
    userNameSection.className = "userNameSection"
    userNameSection.textContent = "@" + user.username
    profilePage.appendChild(userNameSection)

    const emailSection = document.createElement('div')
    emailSection.className = "emailSection"
    emailSection.textContent = user.email
    profilePage.appendChild(emailSection)

    

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

    } else if (isMyProfile) {
        const uploadANewPost = document.createElement('div')
        uploadANewPost.className = 'uploadANewPost'

        const newPostButton = document.createElement('button')
        newPostButton.className = 'newPostButton'
        newPostButton.textContent = 'New Post'
        newPostButton.addEventListener('click', () => {
            newPostButtonClickHandler()
        })
        uploadANewPost.appendChild(newPostButton)

        profilePage.appendChild(uploadANewPost)
    }

    const content = document.createElement('div')
    content.className = 'content'
    content.id = 'userProfile'
    profilePage.appendChild(content)
    if (user.posts.length == 0) {
        if (isMyProfile) {
            content.textContent = "Make your first post to see it here."
        } else {
            content.textContent = "User has not posted their first post yet!"
        }
        
    }
    user.posts.forEach(postId => {
        getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
        api.makeAPIRequest('post/?id=' + postId, getMethodOptions)
            .then(response => {
                let content = document.getElementById('userProfile')
                let imageBox = document.createElement('div')
                imageBox.className = 'imageBox'
                imageBox.id = response.id;
                content.appendChild(imageBox)
                createPostDiv(response, isMyProfile);
            })
    })
    
}

export default function getUserProfile(user, isMyProfile) {
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