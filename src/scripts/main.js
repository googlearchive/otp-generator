var speakeasy = require('speakeasy-browserify');

alert(speakeasy.totp({key: '3ZSU57HQJUX45HCA', encoding: 'base32'}));