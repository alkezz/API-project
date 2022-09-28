'use strict';
const { SpotImage } = require('../models')
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'www.google.com',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.facebook.com',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.reddit.com',
        preview: true
      },
      {
        spotId: 4,
        url: 'www.myspace.com',
        preview: true
      },
      {
        spotId: 5,
        url: 'www.airbnb.com',
        preview: true
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SpotImages', null, {})
  }
};