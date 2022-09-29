const express = require('express');
const jwt = require('jsonwebtoken');
const models = require('./database/models');
const oauth = require('./routes/oauth');
const app = express()
const tokenRouter = require('./routes/Token');
require("dotenv").config();
app.use(express.json())
console.log(process.env.JWT_SECRET)

models.sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }]
app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
// models.Users.create({
//     email: "ryan@gmail.com",
//     password: "123456",
//     name: "Ryan",
//     phone: "010-0000-0000"
// }).then((result) => {
//     console.log("저장 성공: ", result);
// }).catch((err) => {
//     console.log("저장 Error: ", err);
// });

models.Users.findAll({
    where: {password: "123456"}
}).then(results => {
    console.log(results[0].dataValues);
}).catch(err => {
    console.error(err);
});



app.use('/token', tokenRouter);
app.use('/oauth', oauth);
app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.listen(process.env.PORT || 5000 ,() => {
    console.log("Sever On");
})