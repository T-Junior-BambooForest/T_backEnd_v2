const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('./isLogined');
const passport = require('passport');
const passportConfig = require('../passport');
const { BsmOauth, BsmOauthError, BsmOauthErrorType, BsmOauthUserRole, StudentResource, TeacherResource } = require('bsm-oauth');
require("dotenv").config();




let userInfo;
const BSM_AUTH_CLIENT_ID = process.env.CLIENT_ID ;
const BSM_AUTH_CLIENT_SECRET = process.env.CLIENT_SECRET ;
const bsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);


router.use('/', isNotLoggedIn,async (req, res, next) => {
    let resource
    await (async () => {
        try {
            const authCode = req.query.code;
            const token = await bsmOauth.getToken(authCode);
            resource = await bsmOauth.getResource(token);
        } catch (error) {
            if (error instanceof BsmOauthError) {
                switch (error.type) {
                    case BsmOauthErrorType.INVALID_CLIENT: {
                       console.log('클라이언트 정보가 올바르지 않습니다.');
                        break;
                    }
                    case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
                        console.log('인증코드를 찾을 수 없습니다.');
                        break;
                    }
                    case BsmOauthErrorType.TOKEN_NOT_FOUND: {
                        console.log('토큰을 찾을 수 없습니다.');
                        break;
                    }
                    default: {
                        console.log('알 수 없는 오류가 발생했습니다.');
                    }
                }
            }else{
                console.log('알 수 없는 오류가 발생했습니다2.');
                console.log(error);
            }

        }
    })().then(() => {
        console.log(resource.userCode);
        finduser(resource);
    });


     async function finduser(userInfo) {
         let code = userInfo.userCode;
         console.log(code);
         console.log(userInfo);
         let users = await models.Users.findOne({
             where: {code: code || userInfo.code},
             raw: true
         })
         if (users) {
             login(users)
         } else {
             register(userInfo)
         }
     }

    function login(users){
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
                //res.cookie('connect.sid', req.sessionID)
                //res.redirect('http://bsmboo.kro.kr');
                console.log('로그인 성공');
                return res.redirect('http://bsmboo.kro.kr');
            });
        })(req, res, next); //! 미들웨어 내의 미들웨어에는 콜백을 실행시키기위해 (req, res, next)를 붙인다.
    }

   async function register(userInfo) {
        let code = userInfo.userCode;
        let nickname = userInfo.nickname;
        let enrolled = userInfo.student.enrolledAt;
        let grade = userInfo.student.grade;
        let Class = userInfo.student.classNo;
        let studentNo = userInfo.student.studentNo;
        let name = userInfo.student.name;

        await models.Users.create({
            "code": code,
            "nickname": nickname,
            "enrolled": enrolled,
            "grade": grade,
            "class": Class ,
            "studentNo": studentNo,
            "name": name
        }).then(() =>{
            console.log('회원가입 성공');
            finduser(userInfo)
       })
    }

});



module.exports = router;