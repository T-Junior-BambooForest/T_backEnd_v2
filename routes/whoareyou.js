const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');
const { auth } = require('./isLogined');
const SECRET_KEY = 'process.env.JWT_SECRET';
router.get('/', auth, (req, res) => {
    const nickname = req.decoded.nickname;
    const code = req.decoded.code;
   let  user = models.Users.findOne({
        where: {
            code: code
        }
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        result.User.profile = "https://auth.bssm.kro.kr/_next/image?url=https%3A%2F%2Fauth.bssm.kro.kr%2Fresource%2Fuser%2Fprofile%2F"+result.Usercode+".png&w=256&q=75"
        return res.status(200).json({
            code: 200,
            message: '토큰은 정상입니다.',
            data: result
     })
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })

});

module.exports = router;