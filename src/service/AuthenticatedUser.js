import axios from 'axios'
function applyToken(token) {
    if(token) {
        axios.defaults.headers = {
            Authorization : `${token}`
        }
    }
}
export {
    applyToken
}