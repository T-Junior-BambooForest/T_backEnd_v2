const axios = require('axios');
require('dotenv').config();
const models = require('../database/models');

exports.uploadInsta = async (data) => {
    try {


        const mediaUrl = process.env.MEDIA_URL;
        const publishUrl = process.env.PUBLISH_URL;
        const logoImage = process.env.LOGO_IMAGE;
        const token = process.env.INS_TOKEN;
        let caption = "Test"
        let mediaId = null;
        let mdurl = mediaUrl + "?image_url=" + logoImage + "&caption=" + caption + "&access_token=" + token;
        let pburl = `${publishUrl}?creation_id=${null}&access_token=${token}`;
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
            caption = `부산소마고 대나무숲 ${result.AllowBoard.AllowBoardCode}번째 제보\n${result.contents}\n- ${result.User.nickname}님 제보`;
        }).then(() => {
            mdurl = mediaUrl + "?image_url=" + logoImage + "&caption=" + encodeURI(caption) + "&access_token=" + token;
            axios.post(mdurl)
                .then((res) => {
                    console.log(res.data.id);
                    pburl = `${publishUrl}?creation_id=${res.data.id}&access_token=${token}`;
                })
                .catch((err) => {
                    console.error(err);
                }).then(() => {


                axios.post(pburl)
                    .then(() => console.log(`success`))
                    .catch((err) => {
                        console.error('error');
                    })
            })
        }).catch((err) => {
            console.error(err);
        })

    } catch (err) {
        console.log(err);
    }
}


