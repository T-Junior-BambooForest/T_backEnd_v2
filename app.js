const express = require('express');
const models = require('./database/models');
const oauth = require('./routes/oauth');
const islogin = require('./routes/whoareyou');
const boardRouter = require('./routes/post');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require("fs");
const http = require("http");
const board = require('./routes/post');
require("dotenv").config();
const app = express()
app.use(express.json())

const cors = require('cors');



app.use(
    cors({
        origin: true, // '*' 안됨 -> 정확한 주소 또는 origin: true로 해도 됨
        credentials: true,
    }),
);

app.use(cookieParser(process.env.COOKIE_SECRET));

models.sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });


app.use('/oauth', oauth);
app.use('/islogin', islogin);
//app.use('/logout', logout);
app.use('/board',board);
//app.use(express.static(path.join("C:/Users/KHH/Desktop/T/T_FrontEnd/build")));
//app.use(express.static(path.join('/home/ubuntu/T_Frontend/build')));
//console.log(path.join("C:/Users/KHH/Desktop/T/T_FrontEnd/build", "index.html"))
app.use("/",function (req, res) {
    //console.log(req)
    //res.end()
    res.redirect("http://bsmboo.kro.kr")
    //console.log(req.user)
   // res.sendFile(path.join("C:/Users/KHH/Desktop/T/T_FrontEnd/build", "index.html"));
})
app.use(function(req, res, next) {
    return res.status(404).send('Sorry cant find that!');
});

const https = require('https');



if (process.env.NODE_ENV == 'production') {
    const options = {

        ca: fs.readFileSync('/etc/letsencrypt/live/bsmboo.kro.kr/fullchain.pem'),

        key: fs.readFileSync('/etc/letsencrypt/live/bsmboo.kro.kr/privkey.pem'),

        cert: fs.readFileSync('/etc/letsencrypt/live/bsmboo.kro.kr/cert.pem')

    };
    const server = https.createServer(options, app);

    server.listen(process.env.PORT || 8000, () => {
        console.log("HTTPS server listening on port " + process.env.PORT || 8000);
    })
} else if (process.env.NODE_ENV == 'development') {
    app.listen(process.env.PORT || 8000, () => {
        console.log("HTTP server listening on port " + process.env.PORT || 8000);
    })
    console.log("Development Mode");
}

