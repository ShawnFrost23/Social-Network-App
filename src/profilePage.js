import API from './api.js';
import {postMethodOptions, getMethodOptions, putMethodOptions} from './options.js'

// A helper you may want to use when uploading new images to the server.
// import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');


export default function getUserProfile(user) {
    console.log("Hey username " + user + " pressed");
    
}