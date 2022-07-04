const {Sequelize, DataTypes} = require('sequelize');
const fs = require("fs");
const path = require("path");
const cls = require('cls-hooked');

require('dotenv').config()
const namespace = cls.createNamespace('csc-191');
Sequelize.useCLS(namespace);

const DATABASE_HOST = process.env.DATABASE_HOST
const DATABASE_PORT = process.env.DATABASE_PORT
const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_DIALECT = process.env.DATABASE_DIALECT
const DATABASE_NAME = process.env.DATABASE_NAME;

// const namespace = cls.createNamespace('csc-191');
// Sequelize.useCLS(namespace);


const sequelize = new Sequelize(DATABASE_NAME,DATABASE_USER, DATABASE_PASSWORD,
{
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'mysql'
  });

try {
    if(sequelize.authenticate()){
      console.log('Connection has been established successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;