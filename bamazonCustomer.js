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

//Connect to the database, start the process of purchasing products
connection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log(`Connected as ID ${connection.threadId}`);
  allProducts();
});

//Display all inventory
function allProducts() {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) {
      throw err;
    }
    for (var i = 0; i < response.length; i++) {
      //look into map/reduce/etc, instead of loop
      console.log(
        `ID: ${response[i].item_id}`,
        `Product: ${response[i].product_name} `,
        `$${response[i].price}`
      );
    }
    buySomething();
  });
}

//What the user can buy
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
      let item = purchase.item;
      let qty = parseInt(purchase.qty);
      checkInventory(item, qty);
    });
}

//check inventory
function checkInventory(item, qty) {
  connection.query(
    `SELECT stock_quantity FROM products WHERE item_id = ${item}`,
    function(err, res) {
      if (err) throw err;
      let stock = res[0].stock_quantity;
      if (stock < qty) {
        console.log("Sorry. There is not enough inventory.");
        wantMore();
      } else {
        totalOrder(item, qty);
      }
    }
  );
}

//total order
function totalOrder(item, qty) {
  connection.query(
    `UPDATE products SET stock_quantity = ${qty} WHERE item_id = ${item} `,
    function(err, res) {
      if (err) throw err;
      console.log("HERE IS THE INVOICE");
      wantMore();
    }
  );
}

function wantMore() {
  console.log("Would you like to order anything else?");
  //inquerer here
  //if yes buySomething()
  buhBye();
}

function buhBye() {
  console.log("Thanks for shopping at Bamazon.  Come back soon!");
  connection.end();
}
