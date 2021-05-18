const Router = require('express');
const { verify } = require('jsonwebtoken');

const router = Router();
const { Op } = require('sequelize');
const { middle, auth } = require('../middleware/middleware');
const { Comment, Like, Sequelize } = require('../models/index');

const ACCESS_SECRET = process.env.ACCESS_SECRET;

router.post('/register', middle, auth, async (req, res) => {
   const { group_id, comment, nickname } = req.body;

   if (!comment || !nickname) {
      return res.status(400).send('please try again');
   }

   const createComment = await Comment.create({
      group_id: group_id,
      comment: comment,
      nickname: nickname,
   });

   res.status(200).send(createComment);
});

router.post('/modify', middle, auth, async (req, res) => {
   const { id, comment } = req.body;

   if (!comment) {
      return res.status(400).send('please try again');
   }

   await Comment.update(
      {
         comment: comment,
      },
      {
         where: { id: id },
      },
   );

   return res.status(200).send('200 ok');
});

router.delete('/remove', auth, async (req, res) => {
   const { id } = req.body;

   if (!id) {
      return res.status(400).send('please try again');
   }

   await Comment.destroy({
      where: { [Op.or]: [{ id: id }, { group_id: id }] },
   });

   res.status(200).send('200 ok');
});

router.patch('/like', auth, async (req, res) => {
   const { id } = req.body;

   if (!id) {
      return res.status(400).send('please try again');
   }

   const userInfo = verify(req.headers.authorization.substr(7), ACCESS_SECRET);

   const isLike = await Like.findOrCreate({
      where: {
         [Op.and]: [{ user_id: userInfo.id }, { comment_id: id }],
      },
      defaults: { is_like: 'like', user_id: userInfo.id, comment_id: id },
   });

   const exLike = await Like.findOne({
      where: {
         [Op.and]: [{ user_id: userInfo.id }, { comment_id: id }],
      },
   });

   if (!isLike[1]) {
      if (exLike.is_like === 'like') {
         return res.status(403).send('you already pressed like button');
      }
      await Like.update(
         {
            is_like: 'like',
         },
         {
            where: {
               [Op.and]: [{ user_id: userInfo.id }, { comment_id: id }],
            },
         },
      );

      await Comment.update(
         { like_count: Sequelize.literal('like_count + 1') },
         { where: { id: id } },
      );

      await Comment.update(
         { dislike_count: Sequelize.literal('dislike_count - 1') },
         { where: { id: id } },
      );

      return res.status(200).send('200 ok');
   }

   await Comment.update(
      { like_count: Sequelize.literal('like_count + 1') },
      { where: { id: id } },
   );

   return res.status(200).send('200 ok');
});

router.patch('/dislike', auth, async (req, res) => {
   const { id } = req.body;

   if (!id) {
      return res.status(400).send('please try again');
   }

   const userInfo = verify(req.headers.authorization.substr(7), ACCESS_SECRET);

   const isLike = await Like.findOrCreate({
      where: {
         [Op.and]: [{ user_id: userInfo.id }, { comment_id: id }],
      },
      defaults: { is_like: 'dislike', user_id: userInfo.id, comment_id: id },
   });

   const exLike = await Like.findOne({
      where: {
         [Op.and]: [{ user_id: userInfo.id }, { comment_id: id }],
      },
   });

   if (!isLike[1]) {
      if (exLike.is_like === 'dislike') {
         return res.status(403).send('you already pressed dislike button');
      }
      await Like.update(
         {
            is_like: 'dislike',
         },
         {
            where: {
               [Op.and]: [{ user_id: userInfo.id }, { comment_id: id }],
            },
         },
      );

      await Comment.update(
         { like_count: Sequelize.literal('like_count - 1') },
         { where: { id: id } },
      );

      await Comment.update(
         { dislike_count: Sequelize.literal('dislike_count + 1') },
         { where: { id: id } },
      );
      return res.status(200).send('200 ok');
   }

   await Comment.update(
      { dislike_count: Sequelize.literal('dislike_count + 1') },
      { where: { id: id } },
   );

   return res.status(200).send('200 ok');
});

module.exports = router;
