const express = require('express');
const jwt = require('jsonwebtoken');
const models = require('./database/models');
const oauth = require('./routes/oauth');
const app = express()
const tokenRouter = require('./routes/Token');
const cookieParser = require('cookie-parser');
const path = require('path');
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






app.use('/token', tokenRouter);
app.use('/oauth', oauth);
app.use(express.static(path.join('/home/ubuntu/T_Frontend/build')));
app.use("/",function (req, res) {
    res.sendFile(path.join("/home/ubuntu/T_Frontend/build", "index.html"));
})



app.listen(process.env.PORT || 5000 ,() => {
    console.log("Sever On");
})