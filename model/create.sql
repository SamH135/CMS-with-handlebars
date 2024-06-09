-- Create Client table
CREATE TABLE Client (
  ClientID VARCHAR(10) PRIMARY KEY,
  ClientName VARCHAR(100),
  ClientLocation VARCHAR(200),
  ClientType VARCHAR(50),
  AvgTimeBetweenPickups INT,
  LocationNotes TEXT,
  RegistrationDate DATE,
  LocationContact VARCHAR(100),
  TotalPayout DECIMAL(10, 2),
  TotalVolume DECIMAL(10, 2),
  PaymentMethod VARCHAR(20),
  LastPickupDate DATE,
  NeedsPickup BOOLEAN,
  INDEX idx_ClientName (ClientName),
  INDEX idx_ClientLocation (ClientLocation)
);

-- Create User table - for system users
CREATE TABLE User (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) UNIQUE,
  Password VARCHAR(100),
  UserType VARCHAR(20)
);

-- Create Receipt table
CREATE TABLE Receipt (
  ReceiptID INT AUTO_INCREMENT PRIMARY KEY,
  ClientID VARCHAR(10),
  ClientName VARCHAR(100),
  TotalVolume DECIMAL(10, 2),
  TotalPayout DECIMAL(10, 2),
  PickupDate DATE,
  PickupTime TIMESTAMP,
  OriginatorName VARCHAR(100),
  FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
  INDEX idx_ClientID (ClientID),
  INDEX idx_PickupDate (PickupDate)
);

-- Create UserDefinedMetal table - to allow users to add custom metals to receipts
CREATE TABLE UserDefinedMetal (
  UserMetalID INT AUTO_INCREMENT PRIMARY KEY,
  ReceiptID INT,
  MetalName VARCHAR(100),
  Weight DECIMAL(10, 2),
  Price DECIMAL(10, 2),
  FOREIGN KEY (ReceiptID) REFERENCES Receipt(ReceiptID),
  INDEX idx_ReceiptID (ReceiptID)
);

-- Create Request table - tracks pickup requests from business clients
CREATE TABLE Request (
  RequestID INT AUTO_INCREMENT PRIMARY KEY,
  ClientID VARCHAR(10),
  ClientName VARCHAR(100),
  RequestDate DATE,
  RequestTime TIMESTAMP,
  NumFullBarrels INT,
  LargeObjects TEXT,
  Notes TEXT,
  FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
  INDEX idx_ClientID (ClientID),
  INDEX idx_RequestDate (RequestDate)
);