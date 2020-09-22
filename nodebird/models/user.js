const { sequelize } = require(".");

module.exports = ((sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {

        },
        nick: {

        },
        password: {

        },
        provider: {

        },
        snsId: {

        },
    }, {
        timestamps: true,
        paranoid: true,
    })
));