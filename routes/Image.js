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
        let jpg,png,jpeg;
       // console.log(fs.statSync(path.join(__dirname, '../Image', boardcode + ".jpg")).isFile());
    try {
         png = fs.statSync(path.join(__dirname, '../Image', boardcode + ".png")).isFile() ? fs.readFileSync(path.join(__dirname, '../Image', boardcode + ".png")).toString() : null;
    } catch (error) {
         png = null;
    }
    try {
         jpg = fs.statSync(path.join(__dirname, '../Image', boardcode + ".jpg")).isFile() ? fs.readFileSync(path.join(__dirname, '../Image', boardcode + ".jpg")).toString() : null;
    } catch (error) {
         jpg = null;
    }
    try {
         jpeg = fs.statSync(path.join(__dirname, '../Image', boardcode + ".jpeg")).isFile() ? fs.readFileSync(path.join(__dirname, '../Image', boardcode + ".jpeg")).toString() : null;
    } catch (error) {
         jpeg = null;
    }

    try{
        let Image = png ?? jpg ?? jpeg
        if (Image == undefined || Image == null) {
            return res.status(404).send("Not Found");
        } else
            res.status(200).send(`<img src={${Image}} />`);
    } catch (e) {
        console.log(e);
        return res.status(500).send("Server Error");
    }
});

module.exports = router;