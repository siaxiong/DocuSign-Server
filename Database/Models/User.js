const {DataTypes} = require("sequelize");
const sequelize = require("../connection");

const User = sequelize.define("USERS", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },

}, {
    tableName: "USERS",
    timestamps: false,
});


module.exports = User;
