/**
 * Author: Yilun Fu
 */

var FACEBOOK_ACCOUNTS = [
    {
        id: "168124950207443",
        secret: "80c2f9f02ac1200f335a2d62fe303264",
        url: "http://localhost:3000/auth/facebook/callback"
    },
];
exports.FACEBOOK_APP_ID = FACEBOOK_ACCOUNTS[choice].id;
exports.FACEBOOK_APP_SECRET = FACEBOOK_ACCOUNTS[choice].secret;
exports.CALLBACK_URL = FACEBOOK_ACCOUNTS[choice].url;