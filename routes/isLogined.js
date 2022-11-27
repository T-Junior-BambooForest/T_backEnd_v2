const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;
const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser())
//console.log(SECRET_KEY)
function NotManger(message) {
    this.message = message;
    this.name = 'NotManger';
}
exports.auth = (req, res, next) => {
    try {
        //console.log(req.cookies.token)
        req.decoded = jwt.verify(req.cookies.token, SECRET_KEY);
        return next();
    }
    catch (error) {
        // 유효시간이 초과된 경우
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }
        // 토큰의 비밀키가 일치하지 않는 경우
        if (error.name === 'JsonWebTokenError') {
            //console.log(error)
            return res.status(401).json({
                code: 401,
                message: '유효하지 않은 토큰입니다.'
            });
        }
    }
}
exports.authManage = (req, res, next) => {
    // 인증 완료
    try {
        req.decoded = jwt.verify(req.cookies.token, SECRET_KEY);
        if(req.decoded.Newbie) {return
            throw new NotManger('관리자가 아닙니다')
        };
        if(req.decoded.code === 66 || req.decoded.code === 45 || req.decoded.code === 43) {
            return next();
        } else {
            throw new NotManger('관리자만 접근 가능합니다.');
        }
    }
        // 인증 실패
    catch (error) {
        // 유효시간이 초과된 경우
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }
        // 토큰의 비밀키가 일치하지 않는 경우
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: 401,
                message: '유효하지 않은 토큰입니다.'
            });
        }
        if(err.name == 'NotManger') {
            return res.status(403).json({
                code: 403,
                message: '관리자만 접근 가능합니다.'
            });
        }
    }
}

exports.Noauth = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.cookies.token, SECRET_KEY);
        return res.status(403).send('이미 로그인 되어있습니다');
    }
    catch (error) {
        return next();
    }
}