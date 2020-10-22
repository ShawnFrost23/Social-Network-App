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
    let postId = localStorage.getItem('currentPostId')
    getMethodOptions.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('post/?id=' + postId, getMethodOptions)
            .then(newPost => {
                let modalContent = document.getElementById("modal-content");
                while (modalContent.firstChild) {
                    modalContent.removeChild(modalContent.firstChild);
                }
                let header = document.createElement('p')
                let numLikes = newPost.meta.likes.length
                if (numLikes == 0) {
                    header.textContent = "This post is liked by no one yet :("
                } else if (numLikes == 1) {
                    header.textContent = "This post is liked by " + numLikes + " person"
                } else {
                    header.textContent = "This post is liked by " + numLikes + " people"
                }
                modalContent.appendChild(header)
                newPost.meta.likes.forEach(id => {
                    api.makeAPIRequest('user/?id=' + id, getMethodOptions)
                    .then(user => {
                        let userName = document.createElement('p')
                        userName.textContent = user.username
                        modalContent.appendChild(userName)
                    })
                });
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
}

const commentButtonClickHandler = () => {
    let currentPostId = localStorage.getItem('currentPostId')
    getMethodOptions.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('post/?id=' + currentPostId, getMethodOptions)
        .then(newPost => {
            let modalContent = document.getElementById("modal-content");
            while (modalContent.firstChild) {
                modalContent.removeChild(modalContent.firstChild);
            }
            let header = document.createElement('p')
            let numComments = newPost.comments.length
            if (numComments == 0) {
                header.textContent = "This post has no comment yet :("
            } else if (numComments == 1) {
                header.textContent = "This post has " + numComments + " comment"
            } else {
                header.textContent = "This post has " + numComments + " comments"
            }
            modalContent.appendChild(header)

            let commentForm = document.createElement('form')
            commentForm.name = 'commentForm'
            commentForm.id = 'commentForm'
            let comment = document.createElement('input')
            comment.placeholder = 'Type your comment here'
            comment.name = 'commentBox'
            comment.type = 'text'
            comment.classname = 'commentBox'
            commentForm.appendChild(comment)
            modalContent.appendChild(commentForm);
            commentForm = document.forms.commentForm
            let postComment = document.createElement('button')
            postComment.textContent = 'Post'
            postComment.addEventListener('click', () => {
                let commentPosted = commentForm.elements.commentBox.value
                if (commentPosted) {
                    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
                    putMethodOptions.body = JSON.stringify({'comment':commentPosted});
                    api.makeAPIRequest('post/comment?id=' + newPost.id, putMethodOptions)
                        .then(response => {
                            console.log(response);
                        })
                        .catch(err => {
                            console.log(err);                               
                        })
                }                    
            })
            modalContent.appendChild(postComment);
            let index = newPost.comments.length - 1;
            while (index >= 0) {
                let comment = newPost.comments[index];
                let commentDiv = document.createElement('div')
                let userName = document.createElement('p')
                let commentTime = document.createElement('p')
                userName.textContent = comment.author
                commentTime = checkTimeStampDate(new Date(comment.published * 1000), commentTime)
                let commentContent = document.createElement('p')
                commentContent.textContent = comment.comment
                commentDiv.appendChild(userName)
                commentDiv.appendChild(commentTime)
                commentDiv.appendChild(commentContent)
                modalContent.appendChild(commentDiv)
                index = index - 1;
            }

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
    likeButton.textContent = "Like"
    likeButton.addEventListener('click', () => {
        putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token');
        api.makeAPIRequest('post/like?id=' + post.id, putMethodOptions)
            .then(
                res => {
                    createPostDiv(post)
                })
            .catch(err => console.log(err))
    })

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
        localStorage.setItem('currentPostId', post.id)
        numLikesButtonClickHandler()
        localStorage.removeItem('currentPostId')
    })
    numLikesButton.textContent = "See who likes this"
    otherInfo.appendChild(numLikesButton);

    const commentButton = document.createElement('button');
    commentButton.className = 'commentButton';
    commentButton.textContent = "Comment";
    commentButton.addEventListener('click', () => {
        localStorage.setItem('currentPostId', post.id)
        commentButtonClickHandler()
        localStorage.removeItem('currentPostId')
    })
    otherInfo.appendChild(commentButton);

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
