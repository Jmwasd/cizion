'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class User_comment extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
      }
   }
   User_comment.init(
      {
         user_id: DataTypes.INTEGER,
         comment_id: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'User_comment',
      },
   );
   return User_comment;
};
