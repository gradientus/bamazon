//npm modules required to run this application
var inquirer = require("inquirer");
var mysql = require("mysql");

//establish a connection to the local mysql instance
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "U6$83gkcCB54Fe",
  database: "bamazon_db"
});

doWhat();

function doWhat() {}

function allProducts() {}

function lowInventory() {}

function addInventory() {}

function newProduct() {}

function anythingElse() {}
