const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const User = require('../database/models');


module.exports = () => {
    //? auth 라우터에서 /login 요청이 오면 local설정대로 이쪽이 실행되게 된다.
    passport.use(
        new LocalStrategy(
            {
                //* req.body 객체인자 하고 키값이 일치해야 한다.
               usernameField: 'code', // req.body.email
                passwordField: 'nickname', // req.body.password

                session: true, // 세션에 저장 여부
                passReqToCallback: true,
                   // express의 req 객체에 접근 가능 여부. true일 때, 뒤의 callback 함수에서 req 인자가 더 붙음.
                    //   async (req, email, password, done) => { } 가 됨

            },
            //* 콜백함수의  email과 password는 위에서 설정한 필드이다. 위에서 객체가 전송되면 콜백이 실행된다.
            async (req,code, nickname, done) => {
                try {
                    console.log(code)
                    // 가입된 회원인지 아닌지 확인
                    const exUser = await User.findOne({ where: { code: code } });
                    // 만일 가입된 회원이면
                    if (exUser) {
                            console.log(`1asdf \n${exUser}`);
                            done(null, exUser); //? 성공이면 done()의 2번째 인수에 선언

                        //? done()을 호출하면, /login 요청온 auth 라우터로 다시 돌아가서 미들웨어 콜백을 실행하게 된다.
                    }
                    // DB에 해당 이메일이 없다면, 회원 가입 한적이 없다.
                    else {
                        done(null, false, { message: '가입되지 않은 회원입니다.' });
                    }
                } catch (error) {
                    console.error(error);
                    done(error); //? done()의 첫번째 함수는 err용. 특별한것 없는 평소에는 null로 처리.
                }
            },
        ),
    );
};