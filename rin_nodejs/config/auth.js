// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1531115463872992',
        'clientSecret'  : '8aa29b2a3e34e28f07c8319adac5d0f5',
        'callbackURL'   : 'http://ec2-54-164-223-242.compute-1.amazonaws.com:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://ec2-54-164-223-242.compute-1.amazonaws.com:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : 'your-secret-clientID-here',
        'clientSecret'     : 'your-client-secret-here',
        'callbackURL'      : 'http://ec2-54-164-223-242.compute-1.amazonaws.com:3000/auth/google/callback'
    }

};
