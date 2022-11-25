const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');
const { auth } = require('./isLogined');
const SECRET_KEY = 'process.env.JWT_SECRET';
let Manager = [66,45,43]
router.get('/', auth, (req, res) => {
    const code = req.decoded.code;
    models.Users.findOne({
        where: {
            code: code
        }
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        if(Manager.includes(result.code)) result.isManager = true;
        return res.status(200).json({
            code: 200,
            message: '토큰은 정상입니다.',
            data: result
     })
    }).catch((err) => {
        return res.status(401).send('Not Authorized');
    })

});

module.exports = router;