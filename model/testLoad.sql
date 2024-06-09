-- Insert data into the Client table
INSERT INTO Client (ClientID, ClientName, ClientLocation, ClientType, AvgTimeBetweenPickups, LocationNotes, RegistrationDate, LocationContact, TotalPayout, TotalVolume, PaymentMethod, LastPickupDate, NeedsPickup)
VALUES
    ('C001', 'Client 1', '123 Main St', 'Retail', 30, 'Near the main entrance', '2023-01-01', 'John Doe', 5000.00, 1000.00, 'Check', '2023-05-15', 1),
    ('C002', 'Client 2', '456 Elm St', 'Industrial', 45, 'Use the back entrance', '2023-02-15', 'Jane Smith', 10000.00, 2500.00, 'Cash', '2023-04-30', 0);

-- Insert data into the User table
INSERT INTO User (Username, Password, UserType)
VALUES
    ('admin', 'password123', 'Admin'),
    ('user1', 'pass456', 'Regular');

-- Insert data into the Receipt table
INSERT INTO Receipt (ClientID, ClientName, TotalVolume, TotalPayout, PickupDate, PickupTime, OriginatorName)
VALUES
    ('C001', 'Client 1', 500.00, 2500.00, '2023-06-01', '2023-06-01 10:30:00', 'John Smith'),
    ('C002', 'Client 2', 800.00, 4000.00, '2023-06-02', '2023-06-02 14:45:00', 'Emma Johnson');

-- Insert data into the UserDefinedMetal table
INSERT INTO UserDefinedMetal (ReceiptID, MetalName, Weight, Price)
VALUES
    (1, 'Custom Metal 1', 100.00, 50.00),
    (1, 'Custom Metal 2', 200.00, 75.00),
    (2, 'Custom Metal 3', 150.00, 60.00);

-- Insert data into the Request table
INSERT INTO Request (ClientID, ClientName, RequestDate, RequestTime, NumFullBarrels, LargeObjects, Notes)
VALUES
    ('C001', 'Client 1', '2023-06-03', '2023-06-03 09:15:00', 2, 'Engine, Transmission', 'Urgent request'),
    ('C002', 'Client 2', '2023-06-04', '2023-06-04 11:30:00', 1, NULL, 'Regular pickup');