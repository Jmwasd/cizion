const Router = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, Comment } = require('../models/index');
const { sign, verify } = require('jsonwebtoken');
const router = Router();
require('dotenv').config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

router.post('/signup', async (req, res) => {
   const { email, password, nickname } = req.body;

   const exUser = await User.findOne({
      where: { [Op.or]: [{ email: email }, { nickname: nickname }] },
   });

   if (exUser) {
      return res.status(400).send('exist user');
   }

   const hashPassword = await bcrypt.hash(password, 12);

   await User.create({
      email: email,
      nickname: nickname,
      password: hashPassword,
   });

   return res.status(200).send('success signup');
});

router.post('/signin', async (req, res) => {
   const { email, password } = req.body;

   const exUser = await User.findOne({
      where: { email: email },
   });

   if (!exUser) {
      return res.status(401).send('not exist user');
   }

   const verifyPassword = await bcrypt.compare(password, exUser.password);

   if (verifyPassword) {
      const accessToken = sign(
         {
            id: exUser.id,
            email: exUser.email,
            nickname: exUser.nickname,
         },
         ACCESS_SECRET,
         {
            expiresIn: '30m',
         },
      );

      const refreshToken = sign(
         {
            id: exUser.id,
            email: exUser.email,
            nickname: exUser.nickname,
         },
         REFRESH_SECRET,
         {
            expiresIn: '24h',
         },
      );

      const getCommentsList = await Comment.findAll({
         where: { group_id: 0 },
         include: [
            {
               model: Comment,
               as: 'reply_comment',
            },
         ],
      });
      req.session.token = refreshToken;
      req.session.save(() => {
         return res
            .status(200)
            .send({ data: getCommentsList, token: accessToken });
      });
   } else {
      return res.status(401).send('please check your password');
   }
});

router.get('/token', async (req, res) => {
   verify(req.session.token, REFRESH_SECRET, (err, userInfo) => {
      if (err) {
         req.session.destroy();
         res.status(403).send('please login again');
      } else {
         const accessToken = sign(
            {
               id: userInfo.id,
               email: userInfo.email,
               nickname: userInfo.nickname,
            },
            ACCESS_SECRET,
            {
               expiresIn: '30m',
            },
         );
         return res.status(200).send({ token: accessToken });
      }
   });
});

module.exports = router;
