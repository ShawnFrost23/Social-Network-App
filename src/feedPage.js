import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions} from './options.js'
// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');
const likeButtonClickHandler = (post) => {

}

const numLikesButtonClickHandler = () => {

}

const checkTimeStampDate = (postDate, postTimeStamp) => {
    let dateNow =new Date (Date.now());
    let hours = Math.abs(dateNow - postDate) / (60 * 60 * 1000);
    if (hours > 24) {
        let days = Math.floor(hours / 24);
        if (days > 365) {
            let years = Math.floor(days / 365);
            postTimeStamp.textContent = years + " years ago";
        } else if (days > 30) {
            let months = Math.floor(days / 30);
            postTimeStamp.textContent = months + " months ago";
        } else {
            postTimeStamp.textContent = days + " days ago";
        }
    } else if (hours >= 1){
        if (hours == 1) {
            postTimeStamp.textContent = hours + " hour ago";
        } else {
            postTimeStamp.textContent = hours + " hours ago";
        }
    } else {
        let minutes = Math.ceil(hours * 60);
        if (minutes == 1) {
            postTimeStamp.textContent = minutes + " minute ago";
        } else {
            postTimeStamp.textContent = minutes + " minutes ago";
        }
    }

    return postTimeStamp;
}
const createPostDiv = (post) => {
    const imageBox = document.getElementById(post.id);
    if (imageBox.hasChildNodes()) {
        while (imageBox.firstChild) {
            imageBox.removeChild(imageBox.firstChild);
        }
    }
    const postAuthorName = document.createElement('div');
    postAuthorName.className = 'postAuthorName';
    postAuthorName.textContent = post.meta.author;
    imageBox.appendChild(postAuthorName);

    let postDate = new Date(post.meta.published * 1000);
    let postTimeStamp = document.createElement('div');
    postTimeStamp.className = 'postTimeStamp';
    postTimeStamp = checkTimeStampDate(postDate, postTimeStamp)
    imageBox.appendChild(postTimeStamp);

    const image = document.createElement('div');
    image.className = 'image';
    const imageSrc = document.createElement('img');
    imageSrc.src = "data:image/png;base64," + post.src;
    imageSrc.alt = "Image added by " + post.meta.author;
    image.appendChild(imageSrc);
    imageBox.appendChild(image);

    const postInfo = document.createElement('div');
    postInfo.className = 'postInfo'

    const likeInfo = document.createElement('div');
    likeInfo.className = 'likeInfo'

    const likeButton = document.createElement('button')
    likeButton.className = 'likeButton'
    likeButton.addEventListener('click', () => {
        putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token');
        api.makeAPIRequest('post/like?id=' + post.id, putMethodOptions)
            .then(
                res => {
                    createPostDiv(post)
                })
            .catch(err => console.log(err))
    })
    likeButton.textContent = "Like"
    likeInfo.appendChild(likeButton);
    
    const unlikeButton = document.createElement('button')
    unlikeButton.className = 'unlikeButton'
    unlikeButton.addEventListener('click', () => {
        putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
        api.makeAPIRequest('post/unlike?id=' + post.id, putMethodOptions)
            .then(
                res => {
                    createPostDiv(post)
                }
            )
            .catch(err => console.log(err))
    })
    unlikeButton.textContent = "Unlike"
    likeInfo.appendChild(unlikeButton);

    postInfo.appendChild(likeInfo)

    const otherInfo = document.createElement('div');
    otherInfo.className = 'otherInfo'

    const numLikesButton = document.createElement('button');
    numLikesButton.className = 'numLikesButton';
    numLikesButton.addEventListener('click', () => {
        let modal = document.getElementById("myModal");
        let span = document.createElement('span');
        span.className = 'close'
        span.textContent = '&times;'
        let modalContent = document.createElement('div')
        modalContent.appendChild(span)
        getMethodOptions.Authorization = 'Token ' + localStorage.getItem('token')
        post.meta.likes.forEach(id => {
            api.makeAPIRequest('user/?id=' + id, getMethodOptions)
            .then(user => {
                let userName = document.createElement('p')
                userName.textContent = user.username
                modalContent.appendChild(userName)
            })
        });
        modal.appendChild(modalContent)
        
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
        }
          
          // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
        }
    })
    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('post/?id=' + post.id, getMethodOptions)
        .then(response => {
            numLikesButton.textContent = "Likes " + response.meta.likes.length;
        })
        .catch(err => console.log(err))
    otherInfo.appendChild(numLikesButton);

    const numComments = document.createElement('div');
    numComments.className = 'numComments';
    numComments.textContent = "Comments " + post.comments.length;
    otherInfo.appendChild(numComments);

    postInfo.appendChild(otherInfo);

    imageBox.appendChild(postInfo);
    
    const postDescription = document.createElement('div');
    postDescription.className = 'postDescription'
    postDescription.textContent = post.meta.description_text;
    imageBox.appendChild(postDescription);
}
const handleResponse = (response) => {
    const content = document.getElementsByClassName('content')

    response.posts.forEach(post => {
        let imageBox = document.createElement('div')
        imageBox.className = 'imageBox'
        imageBox.id = post.id;
        content[0].appendChild(imageBox)
        createPostDiv(post);
    })
}
export default function getUserFeed() {
    getMethodOptions.headers.Authorization = "Token " + localStorage.getItem('token');
    api.makeAPIRequest('user/feed', getMethodOptions)
        .then(response => handleResponse(response))
        .catch(err => console.log(err));
}
