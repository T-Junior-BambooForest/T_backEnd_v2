const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('./isLogined');
const passport = require('passport');
const passportConfig = require('../passport');
const e = require("express");



const BSM_OAUTH_CLIENT_ID = process.env.CLIENT_ID || '75711f76';
const BSM_OAUTH_CLIENT_SECRET = process.env.CLIENT_SECRET || '8878e3b0874db365d1a9c073d4e307d7';
const GET_TOKEN_URL = 'https://bssm.kro.kr/api/oauth/token';
const GET_RESOURCE_URL ='https://bssm.kro.kr/api/oauth/resource';

console.log(`${BSM_OAUTH_CLIENT_ID} 1`)
console.log(`${BSM_OAUTH_CLIENT_SECRET} 2`)

router.use('/', isNotLoggedIn,async (req, res, next) => {
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
    try {
        let users = await models.Users.findOne({
            where: {code: userInfo.code}
        })

        if(users){
            console.log(users)
            passport.authenticate('local', (authError, user, info) => {
                if (authError) {
                    console.error(authError);
                    return res.status(404).send('err'); // 에러처리 미들웨어로 보낸다.
                }
                return req.login(users, loginError => {
                    //? loginError => 미들웨어는 passport/index.js의 passport.deserializeUser((id, done) => 가 done()이 되면 실행하게 된다.
                    // 만일 done(err) 가 됬다면,
                    if (loginError) {
                        console.error(loginError);
                        return res.send('err2');
                    }
                    // done(null, user)로 로직이 성공적이라면, 세션에 사용자 정보를 저장해놔서 로그인 상태가 된다.
                    return res.redirect('/');
                });
            })(req, res, next); //! 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
        } else {
            let code = userInfo.code;
            let nickname = userInfo.nickname;
            let enrolled = userInfo.enrolled;
            let grade = userInfo.grade;
            let Class = userInfo.classNo;
            let studentNo = userInfo.studentNo;
            let name = userInfo.name;
            console.log(code,nickname,enrolled,grade,Class,studentNo,name);
            await models.Users.create({
                "code": code,
                "nickname": nickname,
                "enrolled": enrolled,
                "grade": grade,
                "class": Class ,
                "studentNo": studentNo,
                "name": name
            })
        }
    } catch (error){
        console.error(error);
        return res.status(500).send('Server Error');
        }

            //회원가입
});



module.exports = router;