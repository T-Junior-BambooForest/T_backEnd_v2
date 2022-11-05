import axios from "axios";

const mediaUrl = "https://graph.facebook.com/v15.0/17841455266680504/media"
const publishUrl = "https://graph.facebook.com/v15.0/17841455266680504/media_publish"
const logoImage = "https://ifh.cc/g/Vt7g4L.png"
const token = "EAAVNoRY1CQcBADiTB2uPky3F4ZAwQfcsLMdPViWvuQEZB9eiW4ZBAhFWT3Ecqp4NXrjdKp6AKFmYDyj6rlZBwvaXo5U3dF3IuuqN7arqACYqy9kuM2Q8duuECo4ORTuaLSU7Bq67SjxJiHnoUF2S00XzJMsgqVWlRW41r6uksBrYCKC9gVZBa"

let containerCreate = `${mediaUrl}
    ?image_url=${logoImage}
    &caption=test
    &access_token=${token}`

let publishContent = `${publishUrl}
    ?creation_id={}
    &access_token=${token}`

const containerCreate = {
    method: 'post',
    url: 'https://graph.facebook.com/v15.0/17841455266680504/media',
        image_url: 'https://ifh.cc/g/Vt7g4L.png',
        caption: 'test',
        access_token: token`
    headers: { }
};

axios(containerCreate)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });