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
        models.Board.findOne({
            attributes: ['contents'],
            where: {boardCode: data}
        }).then((result) => {
            caption = result.contents;
        })

        async function setmedia() {
            axios.post(mdurl)
                .then((res) => {
                    return res.data.id;
                })
                .catch((err) => {
                    console.error(err);
                })
        }

        mediaId = await setmedia();
        let pburl = `${publishUrl}?creation_id=${await setmedia()}&access_token=${token}`;
        axios.post(pburl)
            .then(() => console.log(`success`))
            .catch((err) => {
                console.error(err);
            })


    } catch (err) {
        console.log(err);
    }
}


