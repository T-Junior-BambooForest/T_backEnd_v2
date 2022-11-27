const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');
const {Noauth} = require('./isLogined');
const SECRET_KEY = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
let Manager = [66, 45, 43]

router.post('/', Noauth, (req, res) => {
    try {
        let {id, password} = req.body;
        models.newUser.findOne({
            where: {id: id}
        }).then(result => {
            result = JSON.parse(JSON.stringify(result));
            //console.log(password, result.Pw);
            const match = bcrypt.compareSync(password, result.Pw);
            if (match){
                let token = ""
                token = jwt.sign({
                    code: result.code,
                    Newbie: true
                }, SECRET_KEY, {
                    expiresIn: '1h',
                    issuer: 'bsmboo'
                });
                res.cookie('token', token, {httpOnly: true})
                return res.redirect('/')
            } else {
                return res.status(401).send('Not Authorized');
            }
        }).catch(err => {
            console.log(err)
            return res.status(401).send('Not Authorized');
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
})
router.post('/register', Noauth, (req, res) => {
    try {
        let {id, password, name} = req.body;
        df = fs.readFileSync(path.join(__dirname, 'Newuser.json')).toString();
        let a = JSON.parse(df);
        password = bcrypt.hashSync(password, 12, (err, hash) => {
            if (err) throw err;
            return hash;
        });
        let User = `Insert Into users Values ( ${(9000 + a.length)},"${name+(신입생)}", "2023" , 99, 99 ,"99", "${name+(신입생)}" );`;
        let newUser = `Insert Into newUser Values ("${id}","${password}",${(9000 + a.length)});`;
        let test = {User, newUser};
        a.push(test);
        a = JSON.stringify(a);
        fs.writeFileSync(path.join(__dirname, 'Newuser.json'), a);

        return res.status(200).json({
            code: 200,
            message: '회원가입 성공'
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }

})

module.exports = router;