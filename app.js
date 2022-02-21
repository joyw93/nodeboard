const express = require('express');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
      console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
      console.log(err);
  })

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

app.use('/auth', authRouter);
app.use('/post', postRouter);

app.get('/', (req, res, next) => {
    res.render('main');
})


app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});



app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
    console.log(`http://127.0.0.1:${app.get('port')}`);
})