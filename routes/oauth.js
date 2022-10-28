const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { isLoggedIn, isNotLoggedIn } = require('./isLogined');
const passport = require('passport');
const passportConfig = require('../passport');
const jwt = require('jsonwebtoken');
const { BsmOauth, BsmOauthError, BsmOauthErrorType, BsmOauthUserRole, StudentResource, TeacherResource } = require('bsm-oauth');
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;



let userInfo;
const BSM_AUTH_CLIENT_ID = process.env.CLIENT_ID ;
const BSM_AUTH_CLIENT_SECRET = process.env.CLIENT_SECRET ;
const bsmOauth = new BsmOauth(BSM_AUTH_CLIENT_ID, BSM_AUTH_CLIENT_SECRET);


router.use('/', async (req, res) => {
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
         if (users != null) {
             login(req,res,users)
         } else {
             register(userInfo)
         }
     }

    function login(req,res,users){
        const code = users.code;
        const nickname = users.nickname;
        let token = ""
        token = jwt.sign({
            code: code
        }, jwtSecret, {
            expiresIn: '15m',
            issuer: 'bsmboo'
        });
        res.cookie('token', token)
        return res.redirect('/')
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