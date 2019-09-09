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

//connect to database, start process of managing inventory
connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log(`\nConnected as ID ${connection.threadId}\n`);
  doThis();
});

//ask what the user wants to do
function doThis() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choose",
        message:
          "Welcome to Bamazon Inventory Manager!  Please choose an action to take.",
        choices: [
          "List All Inventory",
          "List Low Inventory",
          "Add Inventory to Existing Products",
          "Add a New Product",
          "Exit the Bamazon Inventory Manager"
        ],
        default: 0
      }
    ])
    .then(answer => {
      let doThis = answer.choose;
      switch (doThis) {
        case "List All Inventory":
          allProducts();
          break;

        case "List Low Inventory":
          lowInventory();
          break;

        case "Add Inventory to Existing Products":
          addInventory();
          break;

        case "Add a New Product":
          newProduct();
          break;

        case "Exit the Bamazon Inventory Manager":
          buhBye();
          break;

        default:
          console.log("\nPlease make a choice.");
      }
    });
}

//list all inventory
function allProducts() {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) {
      throw err;
    }
    for (var i = 0; i < res.length; i++) {
      //TODO: look into map/reduce/etc, instead of loop
      console.log(
        `ID: ${res[i].item_id}   `,
        `Product: ${res[i].product_name}   `,
        `Quantity: ${res[i].stock_quantity}   `,
        `Price: $${res[i].price}\n`
      );
    }
    anythingElse();
  });
}

//list low inventory
function lowInventory() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity <=5",
    (err, res) => {
      if (err) {
        throw err;
      }
      for (var i = 0; i < res.length; i++) {
        //TODO: look into map/reduce/etc, instead of loop
        console.log(
          `ID: ${res[i].item_id}  `,
          `Product: ${res[i].product_name}  `,
          `Quantity: ${res[i].stock_quantity}   `,
          `Price: $${res[i].price}\n`
        );
      }
      anythingElse();
    }
  );
}

//add inventory to existing products
function addInventory() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "item",
        message: "Choose the product that will receive more inventory."
      },
      {
        type: "input",
        name: "qtyToAdd",
        message: "How many more units will be added?"
      }
    ])
    .then(add => {
      let item = add.item;
      let qtyToAdd = parseInt(add.qtyToAdd);
      currentQuantity(item, qtyToAdd);
    });
}

function currentQuantity(item, qtyToAdd) {
  connection.query(
    `SELECT stock_quantity FROM products WHERE item_id = ${item}`,
    (err, res) => {
      if (err) throw err;
      let stock = res[0].stock_quantity;
      updateQuantity(item, qtyToAdd, stock);
    }
  );
}

function updateQuantity(item, qtyToAdd, stock) {
  let total = qtyToAdd + stock;
  console.log(total);
  connection.query(
    `UPDATE products SET stock_quantity = ${total} WHERE item_id=${item}`,
    err => {
      if (err) throw err;
    }
  );
  anythingElse();
}

//add new products to inventory
function newProduct() {}

//does the user want to continue using the application or not
function anythingElse() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "anythingElse",
        message: "Would you like to do anything else?",
        default: true
      }
    ])
    .then(more => {
      let answer = more.anythingElse;
      if (answer) {
        doThis();
      } else {
        buhBye();
      }
    });
}

//break the connection, everything is done
function buhBye() {
  console.log("\n\nThanks for using the Bamazon Inventory Manager.  Goodbye.");
  connection.end();
}
