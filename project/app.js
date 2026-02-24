// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 60124;

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



app.get('/customers', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT Customers.CustomerID AS 'Customer ID', Customers.FirstName AS 'First Name', \  
        Customers.LastName AS 'Last Name', Customers.Email FROM Customers;`;
        const [customers] = await db.query(query1);

        //  an object that contains our customer information
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
        Orders.OrderID AS 'Order ID', \
        CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer', \
        MenuItems.Name AS 'Menu Item', \
        OrderItems.Quantity AS 'Quantity', \
        OrderItems.ItemPrice AS 'Item Price', \
        OrderItems.LineTotal AS 'Line Total' \
        FROM OrderItems \
        LEFT JOIN Orders ON OrderItems.OrdersID = Orders.OrderID \
        LEFT JOIN Customers ON Orders.CustomerID = Customers.CustomerID \
        LEFT JOIN MenuItems ON OrderItems.MenuItemsID = MenuItems.MenuItemID \
        ORDER BY Orders.OrderID;`;
        const query2 = `SELECT OrderID, \
        CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer' FROM Orders \    
        LEFT JOIN Customers ON Orders.CustomerID = Customers.CustomerID \
        ORDER BY Orders.OrderID;`;
        const query3 = `SELECT * FROM MenuItems;`;

        const [orda] = await db.query(query1);
        const [orders] = await db.query(query2);
        const [menuitems] = await db.query(query3);


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

        res.render('menu-items', { menuitems: menuitems });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});

// RESET ROUTE
app.post('/reset', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_load_tacodb();`;
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


// -------------DELETE ROUTES ---------------

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
            'An error occurred while deleting the customer.'
        );
    }
});

// DELETE ORDER ROUTE
app.post('/orders/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteOrder(?);`;
        await db.query(query1, [data.delete_order_id]);

        console.log(`DELETE orders. ID: ${data.delete_order_id} `
        );

        // Redirect the user to the updated webpage data
        res.redirect('/orders');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while deleting the order.'
        );
    }
});

// DELETE ORDER ITEM ROUTE
app.post('/order-items/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteOrderItem(?);`;
        await db.query(query1, [data.delete_order_item_id]);

        console.log(`DELETE order items. ID: ${data.delete_order_item_id} `
        );

        // Redirect the user to the updated webpage data
        res.redirect('/order-items');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while deleting the order item.'
        );
    }
});

// DELETE MENU ITEM ROUTE
app.post('/menu-items/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteMenuItem(?);`;
        await db.query(query1, [data.delete_menu_item_id]);

        console.log(`DELETE menu items. ID: ${data.delete_menu_item_id} `
        );

        // Redirect the user to the updated webpage data
        res.redirect('/menu-items');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while deleting the menu item.'
        );
    }
});

// -------------CREATE ROUTES ---------------

// CREATE CUSTOMER ROUTE
app.post('/customers/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateCustomer(?, ?, ?);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_customer_fname,
            data.create_customer_lname,
            data.create_customer_email
        ]);

        console.log(`CREATE customers. ID: ${rows.new_id} ` +
            `Name: ${data.create_customer_fname} ${data.create_customer_lname}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/customers');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// CREATE ORDER ROUTE
app.post('/orders/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateOrder(?, ?);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_order_id,
            data.create_amount
        ]);

        console.log(`CREATE orders. ID: ${rows.new_id} ` +
            `Amount: ${data.create_amount}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/orders');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// CREATE ORDER ITEM ROUTE
app.post('/order-items/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateOrderItem(?, ?, ?);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_order_id,
            data.create_order_item_menu_item_id,
            data.create_order_item_menu_item_quantity
        ]);

        console.log(`CREATE order items. ID: ${rows.new_id} ` +
            `Menu Item ID: ${data.create_order_item_menu_item_id}, Quantity: ${data.create_order_item_menu_item_quantity}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/order-items');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// CREATE MENU ITEM ROUTE
app.post('/menu-items/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateMenuItem(?, ?);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_menu_item_name,
            data.create_menu_item_price
        ]);

        console.log(`CREATE menu items. ID: ${rows.new_id} ` +
            `Name: ${data.create_menu_item_name}, Price: ${data.create_menu_item_price}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/menu-items');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});
// -------------UPDATE ROUTES ---------------

// UPDATE CUSTOMERS ROUTES
app.post('/customers/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateCustomers(?, ?, ?, ?);';
        await db.query(query1, [
            data.update_customer_id,
            data.update_customer_fname,
            data.update_customer_lname,
            data.update_customer_email
        ]);

        console.log(`UPDATE customers. ID: ${data.update_customer_id} ` +
            `Name: ${data.update_customer_fname} ${data.update_customer_lname}`
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

// UPDATE ORDERS ROUTES
app.post('/orders/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateOrders(?, ?, ?, ?);';
        await db.query(query1, [
            data.update_order_id,
            data.update_customer_id,
            data.update_order_status,
            data.update_order_total,
        ]);

        console.log(`UPDATE orders. ID: ${data.update_order_id} ` 
        );

        // Redirect the user to the updated webpage data
        res.redirect('/orders');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// UPDATE ORDER ITEMS ROUTES
app.post('/order-items/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;



        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateOrderItems(?, ?, ?);';
        await db.query(query1, [
            data.update_order_item_id,
            data.update_order_item_menu_item_id,
            data.update_order_item_menu_item_quantity,
        ]);

        console.log(`UPDATE order-items. ID: ${data.update_order_item_id} ` +
                `Menu Item ID: ${data.update_order_item_menu_item_id}, Quantity: ${data.update_orderupdate_order_item_menu_item_quantity_item_price}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/order-items');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// UPDATE MENU ITEMS ROUTES
app.post('/menu-items/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateMenuItems(?, ?, ?);';
        await db.query(query1, [
            data.update_menu_item_id,
            data.update_menu_item_name,
            data.update_menu_item_price
        ]);

        console.log(`UPDATE menu-items. ID: ${data.update_menu_item_id} `
        );

        // Redirect the user to the updated webpage data
        res.redirect('/menu-items');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});