const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 8080;

const comment = require('./route/comment');
const user = require('./route/user');
const models = require('./models/index');

models.sequelize
   .sync()
   .then(() => {
      console.log('DB 연결 성공');
   })
   .catch((err) => {
      console.log('DB 연결 실패');
      console.log(err);
   });

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
         path: '/',
         sameSite: 'none',
         secure: true,
         httpOnly: true,
         maxAge: 60000 * 60,
      },
   }),
);

if (process.env.PORT) {
   app.use(
      cors({
         origin: ['https://cizion.com'],
         methods: ['GET', 'POST', 'OPTIONS'],
         credentials: true,
      }),
   );
   app.use(logger('combined'));
} else {
   app.use(
      cors({
         origin: true,
         methods: ['GET', 'POST', 'OPTIONS'],
         credentials: true,
      }),
   );
   app.use(logger('dev'));
}

app.get('/', (req, res) => {
   res.send('hio');
});

app.use('/api', comment);
app.use('/sign', user);

https
   .createServer(
      {
         key: fs.readFileSync(__dirname + '/key.pem', 'utf-8'),
         cert: fs.readFileSync(__dirname + '/cert.pem', 'utf-8'),
      },
      app.use('/', (req, res) => {
         console.log('server on');
      }),
   )
   .listen(PORT);

// const test = [{
//    id: 1,
//    nickname : 'jang',
//    comment: 'abc',
//    like_count: 0,
//    dislike_count: 0,
//    reply_comment: [{
//       id: 2,
//       nickname : 'min',
//       comment: 'def',
//       group_id : 1,
//       like_count: 0,
//       dislike_count: 0,
//       reply_comment: {
//          id: 3,
//          nickname : 'woo',
//          comment: 'ghi',
//          group_id : 2,
//          like_count: 0,
//          dislike_count: 0,
//          reply_comment : [{...}],
//          createdAt : date,
//          updatedAt : date
//       },
//       createdAt: date,
//       updatedAt: date,
//    },{...}],
//    createdAt: date,
//    updatedAt: date,
// },{...}];
