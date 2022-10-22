# bsmboo api docs

---
> default url is `http://bsmboo.kro.kr`
## GET 
> ### /islogin : 
> check login status  return `userInfo` or `false`   
> ### /board
> : get board list 
> > response : 
```json 
[{
    boardCode: 1,
    title: "TEST",
    content: "TEST asdfas asdf adsfa",
    User: {
        id: 1,
        name: "bsmboo",
    }   
},
{
    boardCode: 2,
    title: "TE2ST",
    content: "TE2ST asd2fas as2df adsfa",
    User: {
        id: 2,
        name: "bsmasdfboo",
    }   
},
{
    boardCode: 5,
    title: "TEddST",
    content: "TEST asdfas asdf adsfa",
    User: {
        id: 1,
        name: "dffda",
    }   
}]
```


## POST
> ### /board 
> : Write board with request body `title, content, user` with Json

## DELETE
> ### /board
> : delete board with request body `boardCode` with Json