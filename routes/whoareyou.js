const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('./isLogined');
const passport = require('passport');
const passportConfig = require('../passport');
const e = require("express");


router.use('/', isLoggedIn,async (req, res, next) => {
    let user = req.user;
   // console.log(user);
    if(user === undefined){
        res.status(500).send('User not found');
    }
    res.send(user);

    //회원가입
});



module.exports = router;