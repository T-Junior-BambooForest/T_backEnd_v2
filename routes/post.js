const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { isLoggedIn, isNotLoggedIn, isManager} = require('./isLogined');

router.get('/',async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            }
        ],
        where : {allowBoard : true},
        order: [['boardCode', 'ASC']],
    }).then((result) => {
        result = change(result);
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})
function change (data){
    let i;
    let result = [];
    for(i in data) {
        if (data[i].isAnonymous === true) {
            let j;
            for(j in data[i]){
                let k = {};
                k.boardCode = j.boardCode;
                k.contents = j.contents;
                k.allowBoard = j.allowBoard;
                k.createdAt = j.createdAt;
                k.updatedAt = j.updatedAt;
                if(j.isAnonymous === true){
                    k.Usercode = '익명';
                    k.User.code = -1;
                    k.User.name = '익명';
                    k.User.nickname = '익명';
                }
                result.push(JSON.parse(k))
            }
        }
    }
    return data;
}
router.post('/',async (req, res, next) => {
    //console.log(req);
    models.Board.create({
        contents : req.body.contents,
        allowBoard: false,
        Usercode: req.body.Usercode,
        isAnonymous: req.body.isAnonymous
    }).then(() => {
        return  res.status(200).send('Success');
    }).catch((err) => {
        //console.error(err);
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
    }).then(() => {
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.get('/manage',async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
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