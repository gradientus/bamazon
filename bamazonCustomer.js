var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "U6$83gkcCB54Fe",
  database: "bamazon_db"
});

var item = 0;
var qty = 0;

//
//Connect to the database, start the process
connection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("Connected as ID " + connection.threadId);
  allProducts();
  setTimeout(function() {
    buySomething();
  }, 1500);
  connection.end();
});

//
//Display all inventory
function allProducts() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) {
      throw err;
    }
    for (var i = 0; i < response.length; i++) {
      console.log(
        "ID: " + response[i].item_id,
        "Product: " + response[i].product_name + " ",
        "$" + response[i].price
      );
    }
  });
}

//What to buy
function buySomething() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "item",
        message:
          "Choose which product you would like to purchase, using the ID."
      },
      {
        type: "input",
        name: "qty",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function(purchase) {
      //console.log(purchase.item, purchase.qty);
      item = purchase.item;
      qty = purchase.qty;
      console.log(item, qty);
    });
}

//check inventory

//total order

//update database with new stock
