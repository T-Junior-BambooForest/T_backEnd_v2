const axios = require('axios');
require('dotenv').config();
const models = require('../database/models');

exports.uploadFacebk = async (data) => {
    try {
        const feedUrl = process.env.FEED_URL;
        const bamboo = process.env.BAMBOO_LINK;
        const token = process.env.FBK_TOKEN;
        let message = "Test"
        let fburl = feedUrl + "?link=" + bamboo + "&message=" + message + "&access_token=" + token;
        models.Board.findOne({
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
            where: {allowBoard: true, boardCode: data}
        }).then((result) => {
            result = JSON.parse(JSON.stringify(result));
            console.log(result);
            message = `부산소마고 대나무숲 ${result.AllowBoard.AllowBoardCode}번째 제보\n${result.contents}\n- ${result.User.name}님 제보 -`;
        }).then(() => {
            fburl = feedUrl + "?link=" + bamboo + "&message=" + encodeURI(message) + "&access_token=" + token;
            axios.post(fburl)
                .then((res) => {
                    console.log(res.data.id);
                })
                .catch((err) => {
                    console.error(err);
                })

        }).catch((err) => {
            console.error(err);
        })

    } catch (err) {
        console.log(err);
    }
}
