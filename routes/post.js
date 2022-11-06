const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { auth,authManage } = require('./isLogined');
const { uploadInsta } = require('./ins_upload');

router.get('/',async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            },
            {
                model: models.AllowBoard,
                attributes: ['AllowBoardCode'],
            }
        ],
        order: [['boardCode', 'ASC']],
        where: {allowBoard: true}
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        return res.json(result);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})


router.post('/',async (req, res, next) => {
    //console.log(req);
    let {Usercode,isAnonymous} = req.body;
    if(isAnonymous == true){
        Usercode = -1;
    }
    models.Board.create({
        contents : req.body.contents,
        allowBoard: false,
        userCode: Usercode,
        isAnonymous: req.body.isAnonymous
    }).then(() => {
        return  res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.delete('/',async (req, res, next) => {

    models.Board.destroy({
        where: {boardCode: req.body.boardCode}
    }).then(() => {
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.post('/update',async (req, res, next) => {
    models.Board.update({
        allowBoard : true,
    },{
        where: {boardCode: req.body.boardCode}
    }).catch(err => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
    models.AllowBoard.create({
        boardCode : req.body.boardCode,
        }).then((data) => {
        uploadInsta(req.body.boardCode);
        //console.log(data);
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    });
    // insUpload.insAPI();
})

router.get('/manage',async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            },{
                model: models.AllowBoard,
                attributes: ['AllowBoardCode'],
            }
        ],
        order: [['boardCode', 'ASC']],
    }).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})

module.exports = router;