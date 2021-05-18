const { verify } = require('jsonwebtoken');
require('dotenv').config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;

const middle = async (req, res, next) => {
   const { comment } = req.body;
   const forbiddenWord = /욕설|욕.설|욕..설/g;
   let check = forbiddenWord.test(comment);

   if (check) {
      return res.status(400).send('exist forbidden word');
   }

   let now = Date.now() / 1000;
   if (now < req.session.date + 10) {
      return res.status(400).send('wait for 10seconds');
   }
   req.session.date = now;
   req.session.save(() => {
      next();
   });
};

const auth = async (req, res, next) => {
   verify(
      req.headers.authorization.substr(7),
      ACCESS_SECRET,
      (err, decoded) => {
         if (err) {
            res.redirect('https://localhost:8080/sign/token');
         } else {
            next();
         }
      },
   );
};

module.exports = { middle, auth };
