module.exports = {
  up: async (queryInterface, Sequelize) => {
    await [
      queryInterface.changeColumn('posts', 'title', {
        type: Sequelize.STRING(5000),
        allowNull: true,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    await [
      queryInterface.changeColumn('posts', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ];
  },
};
