const User = require("./User")
const PDF = require("./PDF")
const Recipient = require("./Recipient");
const sequelize = require("../connection");



User.hasMany(PDF, {
    foreignKey: {
        name: "fk_email",
        allowNull: false
    }
});

PDF.belongsTo(User, {
    foreignKey: {
        name: "fk_email",
        allowNull: false
    }
});


PDF.hasMany(Recipient, {
    foreignKey: {
        name: "fk_fileName",
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

Recipient.belongsTo(PDF, {
    foreignKey: {
        name: "fk_fileName",
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

sequelize.sync();

