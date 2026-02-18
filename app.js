// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Keep only one PORT (duplicate const declarations crash Node)
const PORT = 60124;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
  try {
    res.render('home');
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('An error occurred while rendering the page.');
  }
});

app.get('/bsg-people', async function (req, res) {
  try {
    const query1 = `SELECT bsg_people.id, bsg_people.fname, bsg_people.lname, \
            bsg_planets.name AS 'homeworld', bsg_people.age FROM bsg_people \
            LEFT JOIN bsg_planets ON bsg_people.homeworld = bsg_planets.id;`;
    const query2 = 'SELECT * FROM bsg_planets;';
    const [people] = await db.query(query1);
    const [homeworlds] = await db.query(query2);

    res.render('bsg-people', { people: people, homeworlds: homeworlds });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while executing the database queries.');
  }
});

app.get('/customers', async function (req, res) {
  try {
    // Keep only one query1 (duplicate const declarations crash Node)
    const query1 = `SELECT Customers.CustomerID AS 'Customer ID', Customers.FirstName AS 'First Name', \  
        Customers.LastName AS 'Last Name', Customers.Email FROM Customers;`;

    const [customers] = await db.query(query1);
    res.render('customers', { customers: customers });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while executing the database queries.');
  }
});

app.get('/orders', async function (req, res) {
  try {
    // Keep only one query1 (duplicate const declarations crash Node)
    const query1 = `SELECT Orders.OrderID AS 'Order ID', CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer Name', Orders.Date, \
            Orders.OrderStatus AS 'Order Status', Orders.OrderTotal AS 'Order Total'FROM Orders \
            LEFT JOIN Customers ON Orders.CustomerID = Customers.CustomerID;`;

    const query2 = `SELECT Customers.CustomerID, Customers.FirstName, Customers.LastName, \
        Customers.Email FROM Customers;`;
    const query3 = `SELECT * FROM MenuItems;`;

    const [orders] = await db.query(query1);
    const [customers] = await db.query(query2);
    const [menuitems] = await db.query(query3);

    res.render('orders', { orders: orders, customers: customers, menuitems: menuitems });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while executing the database queries.');
  }
});

app.get('/order-items', async function (req, res) {
  try {
    // Keep the version that matches your template vars (orda/orders/menuitems)
    const query1 = ` SELECT OrderItems.OrderItemID AS 'Order Item ID', \
        CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer', \
        MenuItems.Name AS 'Menu Item', \
        OrderItems.Quantity AS 'Quantity', \
        OrderItems.ItemPrice AS 'Item Price', \
        OrderItems.LineTotal AS 'Line Total' \
        FROM OrderItems \
        LEFT JOIN Orders ON OrderItems.OrdersID = Orders.OrderID \
        LEFT JOIN Customers ON OrderItems.OrdersID = Customers.CustomerID \
        LEFT JOIN MenuItems ON OrderItems.MenuItemsID = MenuItems.MenuItemID;`;

    const query2 = `SELECT * FROM Orders;`;
    const query3 = `SELECT * FROM MenuItems;`;

    const [orda] = await db.query(query1);
    const [orders] = await db.query(query2);
    const [menuitems] = await db.query(query3);

    // Only ONE render per request (second render crashes / hangs)
    res.render('order-items', { orda: orda, orders: orders, menuitems: menuitems });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while executing the database queries.');
  }
});

app.get('/menu-items', async function (req, res) {
  try {
    const query1 = `SELECT * FROM MenuItems;`;
    const [menuitems] = await db.query(query1);
    res.render('menu-items', { menuitems: menuitems });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while executing the database queries.');
  }
});

app.get('/index', async function (req, res) {
  try {
    res.render('home');
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('An error occurred while rendering the page.');
  }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
  console.log(
    'Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.'
  );
});
