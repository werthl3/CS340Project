-- PL.sql
-- Stored procedures for Project Step 4
-- Implements one CUD operation to demonstrate RESET functionality

DROP PROCEDURE IF EXISTS sp_DeleteCustomer;
DELIMITER //
CREATE PROCEDURE sp_DeleteCustomer(IN p_customerID INT)
BEGIN
    DELETE FROM Customers
    WHERE CustomerID = p_customerID;
END //
DELIMITER ;