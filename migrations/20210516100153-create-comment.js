'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Comments', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         comment: {
            type: Sequelize.TEXT,
         },
         group_id: {
            type: Sequelize.INTEGER,
            default: 0,
         },
         nickname: {
            type: Sequelize.STRING,
         },
         like_count: {
            type: Sequelize.INTEGER,
            default: 0,
         },
         dislike_count: {
            type: Sequelize.INTEGER,
            default: 0,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Comments');
   },
};
