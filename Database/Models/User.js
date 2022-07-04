const {Sequelize, DataTypes} = require("sequelize")
const sequelize = require("../connection");

const User = sequelize.define("USERs", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }

}, {
    tableName: 'USERs',
    timestamps: false
})


module.exports = User;