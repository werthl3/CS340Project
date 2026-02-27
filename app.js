// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 60123;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/bsg-people', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT bsg_people.id, bsg_people.fname, bsg_people.lname, \
            bsg_planets.name AS 'homeworld', bsg_people.age FROM bsg_people \
            LEFT JOIN bsg_planets ON bsg_people.homeworld = bsg_planets.id;`;
        const query2 = 'SELECT * FROM bsg_planets;';
        const [people] = await db.query(query1);
        const [homeworlds] = await db.query(query2);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('bsg-people', { people: people, homeworlds: homeworlds });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.get('/customers', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Customers.CustomerID AS 'Customer ID', Customers.FirstName AS 'First Name',   
        Customers.LastName AS 'Last Name', Customers.Email FROM Customers;`;
        const [customers] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('customers', { customers: customers });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.get('/orders', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
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
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.get('/order-items', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = ` SELECT OrderItems.OrderItemID AS 'Order Item ID', \
        CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer', \
        MenuItems.Name AS 'Menu Item', \
        OrderItems.Quantity AS 'Quantity', \
        OrderItems.ItemPrice AS 'Item Price', \
        OrderItems.LineTotal AS 'Line Total' \
        FROM OrderItems \
        LEFT JOIN Orders ON OrderItems.OrdersID = Orders.OrderID \
        LEFT JOIN Customers ON Orders.CustomerID = Customers.CustomerID \
        LEFT JOIN MenuItems ON OrderItems.MenuItemsID = MenuItems.MenuItemID;`;
        const query2 = `SELECT * FROM Orders;`;
        const query3 = `SELECT * FROM MenuItems;`;

        const [orda] = await db.query(query1);
        const [orders] = await db.query(query2);
        const [menuitems] = await db.query(query3);


        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('order-items', { orda: orda, orders: orders, menuitems: menuitems });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/menu-items', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT * FROM MenuItems;`;
        const [menuitems] = await db.query(query1);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('menu-items', { menuitems: menuitems });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});



// RESET ROUTE
app.post('/reset', async function (req, res) {
    try {
        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_load_tacodb();`;
        await db.query(query1);

        console.log('RESET database to original state.');

        // Redirect the user to the updated webpage data
        res.redirect('/customers');
    } catch (error) {
        console.error('Error executing queries:', error);
        // send error message to browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// DELETE CUSTOMER ROUTE
app.post('/customers/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteCustomer(?);`;
        await db.query(query1, [data.delete_customer_id]);

        console.log(`DELETE customers. ID: ${data.delete_customer_id} ` +
            `Name: ${data.delete_customer_name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/customers');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


// ########################################
// ########## LISTENER (moved to end of code to make sure route is hit)

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});