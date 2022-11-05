const axios = require('axios');

exports.uploadInsta = () => {
    try {

        const mediaUrl = "https://graph.facebook.com/v15.0/17841455266680504/media"
        const publishUrl = "https://graph.facebook.com/v15.0/17841455266680504/media_publish"
        const logoImage = "https://ifh.cc/g/Vt7g4L.png"
        const token = "EAAVNoRY1CQcBAAIEOk4gPzxgNwOhMsai1APxeDKd1oLeDiLlZAOJOgachCZCo7V2u6rzdBNX7kU8BL8ZCYKyuA9nYVrxErWWFFM6FNCKQE0ndhFAZBN1VTaAPbrLjdEugNMNmVMnww4Yj3DlmqJLxWUMfxpDumUy4ZCOB51iLHJW37Jlytfj0IK6TeZA2689ZBGFeuZCDBtQow0IlkqEHbCIPb5mpZB9mLtIITqPgWiwOH7OokA3Md7QXkoNDPclNg1kZD"

        const containerCreate = {
            image_url: 'https://ifh.cc/g/Vt7g4L.png',
            caption: 'test',
            access_token: token
        }

        let mediaId = null;
        let mdurl = mediaUrl + "?image_url=" + containerCreate.image_url + "&caption=" + containerCreate.caption + "&access_token=" + containerCreate.access_token;

        axios.post(mdurl)
            .then((res) => {
                mediaId = res.data.id;
            }).then(() => {
            let pburl = publishUrl + "?creation_id=" + mediaId + "&access_token=" + containerCreate.access_token;
            axios.post(pburl)
                .then(() =>  console.log(`success`))
        })

    } catch (err) {
        console.log(err);
    }
}


