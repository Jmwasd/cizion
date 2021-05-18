'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Comment extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         models.Comment.hasMany(models.Comment, {
            foreignKey: 'group_id',
            sourceKey: 'id',
            as: 'reply_comment',
         });
         models.Comment.belongsToMany(models.User, {
            through: models.User_comment,
            foreignKey: 'comment_id',
         });
         models.Comment.belongsToMany(models.User, {
            through: models.Like,
            foreignKey: 'comment_id',
         });
      }
   }
   Comment.init(
      {
         comment: DataTypes.TEXT,
         group_id: { type: DataTypes.INTEGER, defaultValue: 0 },
         nickname: DataTypes.STRING,
         like_count: { type: DataTypes.INTEGER, defaultValue: 0 },
         dislike_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      },
      {
         sequelize,
         modelName: 'Comment',
      },
   );
   return Comment;
};
