const express = require('express');
const router = express.Router();
const axios = require('axios');
require("dotenv").config({path: __dirname + '/.env'});
const models = require('../database/models');
const { auth } = require('./isLogined');
const fs = require("fs");
const path = require("path");
const SECRET_KEY = 'process.env.JWT_SECRET';
router.get('/:boardcode', (req, res) => {
    const boardcode = req.params.boardcode;
   let png = fs.readFileSync(path.join(__dirname,'../Image',boardcode+".png")).toString();
   let jpg = fs.readFileSync(path.join(__dirname,'../Image',boardcode+".jpg")).toString();
   let jpeg = fs.readFileSync(path.join(__dirname,'../Image',boardcode+".jpeg")).toString();

    let Image = png ?? jpg ?? jpeg
    if(Image == undefined||Image == null){
        return res.status(404).send("Not Found");
    }
    else
        res.status(200).send(png ?? jpg ?? jpeg);
});

module.exports = router;