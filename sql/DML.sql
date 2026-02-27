-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the CS340 database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.
# Citation for the following use of AI:
# Date: 02/19/2026
# Based on
# All code is hand written
# Source URL: https://copilot.microsoft.com/
# AI was used to proofread for syntax errors 
# The prompt explicitly stated to only proofread and not make any changes or any improvements.

-- CUSTOMERS 

-- get all Customers for the List People page
SELECT  Customers.CustomerID AS 'Customer ID', 
        Customers.FirstName AS 'First Name',  
        Customers.LastName AS 'Last Name', 
        Customers.Email 
    FROM Customers;

-- add a new Customer
INSERT INTO `Customers` (`FirstName`, `LastName`, `Email`) 
VALUES (:FirstNameInput, :LastNameInput, :EmailInput);

-- get a single Customer's data for the Update People form
SELECT 
    CustomerID, 
    FirstName, 
    LastName, 
    Email
FROM Customers
WHERE CustomerID = :CustomerID_selected_from_browse_Customer_page;

-- update a Customer's data based on submission of the Update Customer form 
UPDATE `Customers` 
SET 
    `FirstName` = :FirstNameInput, 
    `LastName`= :LastNameInput, 
    `Email`= :EmailInput 
WHERE `CustomerID`= :CustomerID_from_the_update_form;

-- delete a Customer
DELETE FROM `Customers`
WHERE `CustomerID` = :CustomerID_selected_from_browse_Customer_page;

-- get all Customer IDs to populate the Customers dropdown
SELECT 
    `CustomerID`, 
    `FirstName`, 
    `LastName` 
FROM `Customers`;


-- MENU ITEMS

-- get all MenuItems for the List MenuItems page
SELECT  MenuItemID, 
        Name, 
        Price
FROM MenuItems
ORDER BY MenuItemID DESC;

-- add a new MenuItem
INSERT INTO `MenuItems` (`Name`, `Price`) 
VALUES (:NameInput, :PriceInput);

-- get a single MenuItem's data for the Update MenuItem form
SELECT 
    MenuItemID, 
    Name, 
    Price
FROM MenuItems
WHERE MenuItemID = :MenuItemID_selected_from_browse_MenuItem_page;

-- update a MenuItem's data based on submission of the Update MenuItem form 
UPDATE `MenuItems` 
SET 
    `Name` = :NameInput, 
    `Price`= :PriceInput 
WHERE `MenuItemID`= :MenuItemID_from_the_update_form;

-- delete a MenuItem
DELETE FROM `MenuItems` 
WHERE `MenuItemID`= :MenuItemID_selected_from_browse_MenuItem_page;

-- get all MenuItems IDs and Names to populate the MenuItems dropdown
SELECT 
    `MenuItemID`, 
    `Name`  
FROM `MenuItems`;

-- ORDERS

-- get all Orders for the List Orders page
SELECT Orders.OrderID AS 'Order ID', 
        CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer Name', 
        Orders.Date, 
        Orders.OrderStatus AS 'Order Status', 
        Orders.OrderTotal AS 'Order Total'
        FROM Orders 
        LEFT JOIN Customers 
            ON Orders.CustomerID = Customers.CustomerID;

-- add a new Order
INSERT INTO `Orders` (`CustomerID`, `Date`, `OrderStatus`, `OrderTotal`) 
VALUES (:CustomerID_Input, :DateInput, :OrderStatus, 0);

-- get a single Order's data for the Update Order form
SELECT 
    OrderID, 
    CustomerID, 
    Date, 
    OrderStatus, 
    OrderTotal
FROM Orders
WHERE OrderID = :OrderID_selected_from_browse_Orders_page;

-- update an Order's data based on submission of the Update Order form 
UPDATE `Orders` 
SET 
    `CustomerID` = :OrderCustomerInput, 
    `OrderStatus`= :OrderStatusInput 
WHERE `OrderID`= :OrderID_from_the_update_form;

-- delete an Order
DELETE FROM `Orders` 
WHERE `OrderID`= :OrderID_selected_from_browse_Orders_page;

-- get all Order IDs to populate the Orders dropdown
SELECT 
    `OrderID`, 
    `Date` 
FROM `Orders`;

-- ORDERITEMS

-- get all OrderItems for the List OrderItems page
SELECT OrderItems.OrderItemID AS 'Order Item ID', 
    CONCAT(Customers.FirstName, ' ', Customers.LastName) AS 'Customer', 
    MenuItems.Name AS 'Menu Item', 
    OrderItems.Quantity AS 'Quantity', 
    OrderItems.ItemPrice AS 'Item Price', 
    OrderItems.LineTotal AS 'Line Total' 
FROM OrderItems 
LEFT JOIN Orders 
    ON OrderItems.OrdersID = Orders.OrderID 
LEFT JOIN Customers 
    ON Orders.CustomerID = Customers.CustomerID 
LEFT JOIN MenuItems 
    ON OrderItems.MenuItemsID = MenuItems.MenuItemID;

-- add a new OrderItem
INSERT INTO `OrderItems` (`OrdersID`, `MenuItemsID`, `Quantity` , `ItemPrice`, `LineTotal`) 
VALUES (:OrdersIDInput, :MenuItemID_Input, :QuantityInput, :ItemPriceInput, :LineTotalInput);

-- get a single OrderItem's data for the Update OrderItem form
SELECT 
    OrderItemID, 
    OrdersID, 
    MenuItemsID, 
    Quantity, 
    ItemPrice, 
    LineTotal
FROM OrderItems
WHERE OrderItemID = :OrderItemID_selected_from_browse_OrderItems_page;

-- update an OrderItem's data based on submission of the Update Order form 
UPDATE `OrderItems` 
SET `Quantity`= :QuantityInput, 
    `MenuItemsID` = :MenuItemID_Input 
WHERE `OrderItemID`= :OrderItemID_from_the_update_form;

-- delete an OrderItem
DELETE FROM `OrderItems` 
WHERE `OrderItemID`= :OrderItemID_selected_from_browse_Orders_page;

-- get all OrderItem IDs to populate the Orders dropdown
SELECT 
    `OrderItemID`, 
    `MenuItemsID` 
FROM `OrderItems`;

