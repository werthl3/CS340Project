DROP PROCEDURE  IF EXISTS sp_load_tacodb;
DELIMITER //
CREATE PROCEDURE sp_load_tacodb()

BEGIN
SET FOREIGN_KEY_CHECKS=0;
--
-- Database: `Relational_Taqueria`
--

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
CREATE TABLE IF NOT EXISTS `Customers` (
  `CustomerID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `Email` varchar(145) NOT NULL,
  PRIMARY KEY (`CustomerID`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `MenuItems`
--

DROP TABLE IF EXISTS `MenuItems`;
CREATE TABLE IF NOT EXISTS `MenuItems` (
  `MenuItemID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`MenuItemID`)
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
CREATE TABLE IF NOT EXISTS `Orders` (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerID` int(11) NOT NULL,
  `Date` date NOT NULL,
  `OrderStatus` int(11) NOT NULL,
  `OrderTotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`OrderID`),
  CONSTRAINT `CustomerID` FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- --------------------------------------------------------

--
-- Table structure for table `OrderItems`
--

DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE IF NOT EXISTS `OrderItems` (
  `OrderItemID` int(11) NOT NULL AUTO_INCREMENT,
  `OrdersID` int(11) NOT NULL,
  `MenuItemsID` int(11) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `ItemPrice` decimal(10,2) NOT NULL,
  `LineTotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`OrderItemID`),
  CONSTRAINT `OrdersID` FOREIGN KEY (`OrdersID`) REFERENCES `Orders` (`OrderID`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `MenuItemsID` FOREIGN KEY (`MenuItemsID`) REFERENCES `MenuItems` (`MenuItemID`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;



-- --------------------------------------------------------

--
-- Insert into table `Customers`
--

INSERT INTO `Customers` (`FirstName`, `LastName`, `Email`) VALUES
('Lisa', 'Werth', 'Lwerth@gmail.com'),
('Francisco', 'Ruiz-hernandez', 'Fruiz@gmail.com'),
('Ted', 'Mosby', 'mr.johnwrench@yahoo.com'),
('Tony', 'Hawk', 'noemail@noemail.com');

--
-- Insert into table `MenuItems`
--

INSERT INTO `MenuItems` (`Name`, `Price`) VALUES
('Taco', 6.0),
('Burrito', 16.0),
('Horchata', 5.0);

--
-- Insert into table `Orders`
--

INSERT INTO `Orders` (`CustomerID`, `Date`, `OrderStatus`,`OrderTotal`) VALUES
(1, '2026-01-09', 1, 12.0),
(2, '2026-01-19', 1, 21.0),
(3, '2026-01-29', 0, 22.0),
(3, '2026-01-29', 1, 5.00);

--
-- Insert into table `OrderItems`
--

INSERT INTO `OrderItems` (`OrdersID`,`MenuItemsID`, `Quantity`, `ItemPrice`, `LineTotal`) VALUES
(1, 1, 2, 6.0, 12.0),
(2, 2, 1, 16.0, 16.0),
(2, 3, 1, 5.0, 5.0),
(3, 1, 1, 6.0, 6.0),
(3, 2, 1, 16.0, 16.0),
(4, 3, 1, 5.0, 5.0);

SET FOREIGN_KEY_CHECKS=1;
END //

DELIMITER ;
-- Use the following statement to call SP to load the taco database.
-- This will reset the schema back to the original state.
-- CALL sp_load_tacodb();