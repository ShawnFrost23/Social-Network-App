/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
const getJSON = (path, options) => {
    return new Promise((resolve, reject) => {
        fetch(path, options)
        .then(res =>  {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                res.json().then(decodedData => {
                    reject(decodedData.message)
                }).catch(err => console.log('Catch error:' + err))
            }
        })
        .catch(err => console.warn(`API_ERROR: ${err.message}`));
    })
}
    
/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
    /** @param {String} url */
    constructor(url) {
        this.url = url;
    } 

    /** @param {String} path */
    makeAPIRequest(path, options) {
        return getJSON(`${this.url}/${path}`, options);
    }
}
