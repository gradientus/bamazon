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
connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log(`\nConnected as ID ${connection.threadId}\n`);
  allProducts();
});

//Display all inventory
function allProducts() {
  connection.query("SELECT * FROM products", (err, response) => {
    if (err) {
      throw err;
    }
    for (var i = 0; i < response.length; i++) {
      //TODO: look into map/reduce/etc, instead of loop
      console.log(
        `ID: ${response[i].item_id}  `,
        `Product: ${response[i].product_name}  `,
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
    .then(purchase => {
      let item = purchase.item;
      let qty = parseInt(purchase.qty);
      checkInventory(item, qty);
    });
}

//check inventory
function checkInventory(item, qty) {
  connection.query(
    `SELECT stock_quantity, product_name, price FROM products WHERE item_id = ${item}`,
    (err, res) => {
      if (err) throw err;
      let stock = res[0].stock_quantity;
      let name = res[0].product_name;
      let price = res[0].price;
      if (stock < qty) {
        console.log("\nSorry. There is not enough inventory.");
        wantMore();
      } else {
        totalOrder(item, qty, name, price);
      }
    }
  );
}

//total order
function totalOrder(item, qty, prodName, price) {
  connection.query(
    `UPDATE products SET stock_quantity = ${qty} WHERE item_id = ${item} `,
    (err, res) => {
      if (err) throw err;
      let total = (qty * price).toFixed(2);
      console.log(`\n-----  HERE IS YOUR INVOICE  ----- \n
Item Ordered: ${prodName}
Quantity Ordered: ${qty}
Price: $${price}
================\n
TOTAL: $${total}\n`);
      wantMore();
    }
  );
}

//ask the user if there is any further business
function wantMore() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "anythingElse",
        message: "Would you like to order anything else?",
        default: true
      }
    ])
    .then(more => {
      let answer = more.anythingElse;
      if (answer) {
        buySomething();
      } else {
        buhBye();
      }
    });
}

//break the connection, everything is done
function buhBye() {
  console.log("\n\nThanks for shopping at Bamazon.  Come back soon!");
  connection.end();
}
