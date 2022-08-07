const User = require("./User");
const PDF = require("./PDF");
const sequelize = require("../connection");


User.hasMany(PDF, {
    foreignKey: {
        name: "fk_email",
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
});

PDF.belongsTo(User, {
    foreignKey: {
        name: "fk_email",
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
});


// PDF.hasMany(Recipient, {
//     foreignKey: {
//         name: "fk_version",
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
// });

// Recipient.belongsTo(PDF, {
//     foreignKey: {
//         name: "fk_version",
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//     },
// });
sequelize.sync();
