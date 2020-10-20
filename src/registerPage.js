import API from './api.js';
import {postMethodOptions, getMethodOptions} from './options.js'
// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

const createPostDiv = (post) => {
    console.log(post);
    const imageBox = document.createElement('div');
    imageBox.className = 'imageBox';

    const postAuthorName = document.createElement('div');
    postAuthorName.className = 'postAuthorName';
    postAuthorName.textContent = post.meta.author;
    imageBox.appendChild(postAuthorName);

    let date = new Date(post.meta.published * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    
    const postTimeStamp = document.createElement('div');
    postTimeStamp.className = 'postTimeStamp';
    postTimeStamp.textContent = hours + " hours ago";
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
    const numLikes = document.createElement('div');
    numLikes.className = 'numLikes';
    numLikes.textContent = "Likes " + post.meta.likes.length;
    postInfo.appendChild(numLikes);
    const numComments = document.createElement('div');
    numComments.className = 'numComments';
    numComments.textContent = "Comments " + post.comments.length;
    postInfo.appendChild(numComments);
    imageBox.appendChild(postInfo);
    
    const postDescription = document.createElement('div');
    postDescription.className = 'postDescription'
    postDescription.textContent = post.meta.description_text;
    imageBox.appendChild(postDescription);

    const content = document.getElementsByClassName('content');
    content[0].appendChild(imageBox);
}
const handleResponse = (response) => {
    response.posts.forEach(post => {
        createPostDiv(post);
    })
}
export default function getUserFeed() {
    getMethodOptions.headers.Authorization = "Token " + localStorage.getItem('token');
    api.makeAPIRequest('user/feed', getMethodOptions)
        .then(response => handleResponse(response))
        .catch(err => console.log(err));
}
