const express = require('express');
const jwt = require('jsonwebtoken');
const models = require('./database/models');
const oauth = require('./routes/oauth');
const app = express()
const tokenRouter = require('./routes/Token');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require("dotenv").config();
app.use(express.json())
console.log(process.env.JWT_SECRET)
const passport = require('passport');
const passportConfig = require('./passport');
passportConfig()

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    }),
);

app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session());

models.sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

let test = models.Users.findAll().then((result) => {
    console.log(result)
})




app.use('/token', tokenRouter);
app.use('/oauth', oauth);
app.get('/', (req, res) => {
    res.send(`Hello World!
        <a href="https://bssm.kro.kr/oauth/login?clientId=75711f76&redirectURI=http://localhost:3000/oauth">로그인</a>
    `)
})



app.listen(process.env.PORT || 5000 ,() => {
    console.log("Sever On");
})