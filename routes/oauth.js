const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');

const BSM_OAUTH_CLIENT_ID = process.env.CLIENT_ID || '75711f76';
const BSM_OAUTH_CLIENT_SECRET = process.env.CLIENT_SECRET || '8878e3b0874db365d1a9c073d4e307d7';
const GET_TOKEN_URL = 'https://bssm.kro.kr/api/oauth/token';
const GET_RESOURCE_URL ='https://bssm.kro.kr/api/oauth/resource';

console.log(`${BSM_OAUTH_CLIENT_ID} 1`)
console.log(`${BSM_OAUTH_CLIENT_SECRET} 2`)

router.use('/', async (req, res) => {
    const authcode = req.query.code;
    if (authcode === undefined) {
        return res.status(400).send('Authcode is required');
    }

    let TokenRequest;
    try {
        TokenRequest = await axios.post(GET_TOKEN_URL, {
            clientId: BSM_OAUTH_CLIENT_ID,
            clientSecret: BSM_OAUTH_CLIENT_SECRET,
            authcode
        });
    } catch (error) {
        console.log(1)
       return  res.status(400).send('Authcode is invaild');
    }
    const token = TokenRequest.data.token;
    if (token === undefined) {
        console.log(2)
        return res.status(400).send('Authcode is invaild');
    }

    let ResourceRequest;
    try {
        ResourceRequest = await axios.post(GET_RESOURCE_URL, {
            clientId: BSM_OAUTH_CLIENT_ID,
            clientSecret: BSM_OAUTH_CLIENT_SECRET,
            token
        });
    } catch (error) {
        return res.status(404).send('User not found');
    }
    const userInfo = ResourceRequest.data.user;
    if (userInfo === undefined) {
        return res.status(404).send('User not found');
    }
    console.log(userInfo);
    models.Users.create({
    email: "ryan@gmail.com",
    password: "123456",
    name: "Ryan",
    phone: "010-0000-0000"
}).then((result) => {
    console.log("저장 성공: ", result);
}).catch((err) => {
    console.log("저장 Error: ", err);
});

    res.json(userInfo)
});



module.exports = router;