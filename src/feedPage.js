import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions, deleteMethodOptions} from './options.js'
import getUserProfile from './profilePage.js';
// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const numberOfPost = localStorage.getItem('numberOfPosts')
    if (clientHeight + scrollTop >= scrollHeight - 10) {
        let isPageAtBottom = true;
        api.makeAPIRequest('user/feed?p=' + numberOfPost, getMethodOptions)
            .then(response => {
                localStorage.setItem('numberOfPosts', parseInt(numberOfPost) + 10)
                handleResponse(response, isPageAtBottom)
            })
            .catch(err => console.log(err));
    }
})


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
                modal.style.display = 'block';
                span.onclick = function() {
                    modal.style.display = "none";
                    modalWindow.style.display = 'none'
                }
            })
}

const commentButtonClickHandler = (isMyPost) => {
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
            comment.className = "formInput"
            commentForm.appendChild(comment)
            modalContent.appendChild(commentForm);
            commentForm = document.forms.commentForm
            let postComment = document.createElement('button')
            postComment.textContent = 'Post'
            postComment.className = 'postCommentButton'
            postComment.addEventListener('click', () => {
                let commentPosted = commentForm.elements.commentBox.value
                if (commentPosted) {
                    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
                    putMethodOptions.body = JSON.stringify({'comment':commentPosted});
                    api.makeAPIRequest('post/comment?id=' + newPost.id, putMethodOptions)
                        .then(response => {
                            localStorage.setItem('currentPostId', currentPostId)
                            commentButtonClickHandler(isMyPost)
                            localStorage.removeItem('currentPostId')
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
                commentDiv.className = 'commentDiv'
                let userName = document.createElement('p')
                let commentTime = document.createElement('p')
                userName.className = 'commentHeader'
                commentTime.className = 'commentHeader'
                userName.textContent = "By " + comment.author
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
                getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
                api.makeAPIRequest('post/?id=' + currentPostId, getMethodOptions)
                    .then(res => {
                        createPostDiv(res, isMyPost)
                    })
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
            if (years == 1) {
                postTimeStamp.textContent = years + " year ago";
            } else {
                postTimeStamp.textContent = years + " years ago";
            }
        } else if (days > 30) {
            let months = Math.floor(days / 30);
            if (months == 1) {
                postTimeStamp.textContent = months + " month ago";
            } else {
                postTimeStamp.textContent = months + " months ago";
            }
            postTimeStamp.textContent = months + " months ago";
        } else {
            if (days == 1) {
                postTimeStamp.textContent = days + " day ago";
            } else {
                postTimeStamp.textContent = days + " days ago";
            }
        }
    } else if (hours >= 1){
        hours = Math.ceil(hours)
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

const updateButtonClickHandler = (post) => {
    let editForm = document.forms.editForm
    let newDescription = editForm.elements.descriptionOfPost.value
    putMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    let newBody = {'description_text' : newDescription}
    putMethodOptions.body = JSON.stringify(newBody)
    api.makeAPIRequest('post/?id=' + post.id, putMethodOptions)
        .then(response => {
            getUserProfile("", true)
        })
        .catch(err => console.log(err))
}

const editPostButtonClickHandler = (post) => {
    let modalContent = document.getElementById("modal-content");
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    let editForm = document.createElement("form")
    editForm.name = "editForm"

    let descriptionText = document.createElement("input")
    descriptionText.type = 'text'
    descriptionText.name = 'descriptionOfPost'
    descriptionText.className = "formInput"
    descriptionText.placeholder = 'Change Post Description'
    editForm.appendChild(descriptionText)

    modalContent.appendChild(editForm)

    let updateButton = document.createElement('button')
    updateButton.className = 'updateButton'
    updateButton.textContent = "UPDATE"
    updateButton.addEventListener('click', () => {
        updateButtonClickHandler(post)
        modal.style.display = "none";
        modalWindow.style.display = 'none'
    })
    modalContent.appendChild(updateButton)
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

const deletePostButtonClickHandler = (post) => {
    deleteMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
    api.makeAPIRequest('post/?id=' + post.id, deleteMethodOptions)
        .then(response => {
            console.log(response);
            getUserProfile("", true)  
        })
}

export function createPostDiv(post, isMyPost) {
    const imageBox = document.getElementById(post.id);
    if (imageBox.hasChildNodes()) {
        while (imageBox.firstChild) {
            imageBox.removeChild(imageBox.firstChild);
        }
    }
    const postAuthorName = document.createElement('div');
    postAuthorName.className = 'postAuthorName';
    
    if (isMyPost) {
        const editButton = document.createElement('button')
        editButton.className = 'editPostButton'
        editButton.textContent = "Edit Post"
        editButton.addEventListener('click', () => {
            editPostButtonClickHandler(post)
        })
        postAuthorName.appendChild(editButton)

        const deleteButton = document.createElement('button')
        deleteButton.className = 'deletePostButton'
        deleteButton.textContent = "Delete Post"
        deleteButton.addEventListener('click', () => {
            deletePostButtonClickHandler(post)
        })
        postAuthorName.appendChild(deleteButton)
    } else {
        const postAuthor = document.createElement('button')
        postAuthor.className = 'postAuthor'
        postAuthor.textContent = post.meta.author;
        postAuthor.addEventListener('click', () => {
            let isMyProfile = false;
            getUserProfile(post.meta.author, isMyProfile)
        })
        postAuthorName.appendChild(postAuthor);
    }
    imageBox.appendChild(postAuthorName);

    let postDate = new Date(post.meta.published * 1000);
    let postTimeStamp = document.createElement('div');
    postTimeStamp.className = 'postTimeStamp';
    let postTime = document.createElement('span');
    postTime.className = 'postTime'
    postTime = checkTimeStampDate(postDate, postTime)
    postTimeStamp.appendChild(postTime);
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
                    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
                    api.makeAPIRequest('post/?id=' + post.id, getMethodOptions)
                    .then(res => {
                        createPostDiv(res, isMyPost)
                    })
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
                    getMethodOptions.headers.Authorization = 'Token ' + localStorage.getItem('token')
                    api.makeAPIRequest('post/?id=' + post.id, getMethodOptions)
                    .then(res => {
                        createPostDiv(res, isMyPost)
                    })
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
    numLikesButton.textContent = "See who likes this (" + post.meta.likes.length + ")"
    otherInfo.appendChild(numLikesButton);

    const commentButton = document.createElement('button');
    commentButton.className = 'commentButton';
    commentButton.textContent = "Comment (" + post.comments.length + ")";
    commentButton.addEventListener('click', () => {
        localStorage.setItem('currentPostId', post.id)
        commentButtonClickHandler(isMyPost)
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
const handleResponse = (response, isPageAtBottom) => {
    const content = document.getElementById('userFeed')
    if (!isPageAtBottom) {
        if (content.hasChildNodes()) {
            while (content.firstChild) {
                content.removeChild(content.firstChild);
            }
        }
    }
    
    response.posts.forEach(post => {
        if (post.id) {
            let imageBox = document.createElement('div')
            imageBox.className = 'imageBox'
            imageBox.id = post.id;
            content.appendChild(imageBox)
            createPostDiv(post, false);
        } else {
            // Do Nothing
        }
    })

}
export default function getUserFeed() {
    getMethodOptions.headers.Authorization = "Token " + localStorage.getItem('token');
    localStorage.setItem('numberOfPosts', 10)
    api.makeAPIRequest('user/feed', getMethodOptions)
        .then(response => handleResponse(response, false))
        .catch(err => console.log(err));
}
