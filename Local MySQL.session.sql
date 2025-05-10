
CREATE TABLE Users (
    userID INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100) NOT NULL,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    phone CHAR(10) NOT NULL,
    house_number VARCHAR(20),
    building VARCHAR(50),
    moo VARCHAR(2),
    village VARCHAR(50),
    soi VARCHAR(10),
    road VARCHAR(50),
    sub_district VARCHAR(50),
    district VARCHAR(50),
    province VARCHAR(50),
    postal_code CHAR(5), 
    roleID INT NOT NULL,
    FOREIGN KEY (roleID) REFERENCES Roles(roleID),
);

CREATE TABLE Books (
    bookID INT PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    book_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    page_number INT NOT NULL,
    publisher VARCHAR(100) NOT NULL,
    publication_year YEAR NOT NULL,
    edition_no INT DEFAULT 1,
    edition_year YEAR,
    book_promotionID INT,
    image LONGBLOB
    FOREIGN KEY (book_promotionID) REFERENCES Book_promotion(book_promotionID)
);

CREATE TABLE Cart (
    cartID INT PRIMARY KEY,
    total_price DECIMAL(10, 2) DEFAULT 0,
    created TIMPESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userID INT NOT NULL,
    coupon VARCHAR(50),
    cart_promotionID INT, 
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (cart_promotionID) REFERENCES Cart_promotion(cart_promotionID),
    FOREIGN KEY (coupon) REFERENCES Coupon(couponID)
);

CREATE TABLE Orders (
    orderID INT PRIMARY KEY,
    total_price DECIMAL(10, 2) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(50),
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    userID INT NOT NULL, 
    tracking_number VARCHAR(50),
    FOREIGN KEY (userID) REFERENCES Users(userID), 
    FOREIGN KEY (tracking_number) REFERENCES Shipping(tracking_number)
);

CREATE TABLE Claim (
    claimID INT PRIMARY KEY,
    description TEXT NOT NULL,
    claim_status VARCHAR(50),
    resolution TEXT,
    claim_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    support_document VARCHAR(255),
    userID INT NOT NULL,
    orderID INT NOT NULL,
    bookID INT NOT NULL, 
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (bookID) REFERENCES Books(bookID)
);

CREATE TABLE Coupon (
    couponID INT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INT,
    usage_count INT,
    is_active BOOLEAN
);


CREATE TABLE Cart_promotion (
    cart_promotionID INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    is_active BOOLEAN
);

CREATE TABLE Book_promotion (
    book_promotionID INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    is_active BOOLEAN
);

CREATE TABLE Shipping (
    tracking_number VARCHAR(50) PRIMARY KEY,
    shipping_status VARCHAR(50) NOT NULL,
    shipping_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    carrier VARCHAR(100) NOT NULL
);

CREATE TABLE Question (
    userID INT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qna_type VARCHAR(50),
    description TEXT, 
    PRIMARY KEY (userID, time),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE Cart_items (
    cartID INT,
    bookID INT,
    quantity INT,
    PRIMARY KEY (cartID, bookID),
    FOREIGN KEY (cartID) REFERENCES Cart(cartID),
    FOREIGN KEY (bookID) REFERENCES Books(bookID)
);

CREATE TABLE Order_items (
    orderID INT,
    bookID INT,
    quantity INT, 
    PRIMARY KEY (orderID, bookID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (bookID) REFERENCES Books(bookID)
);

CREATE TABLE Reviews (
    userID INT,
    bookID INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    has_buy BOOLEAN, 
    PRIMARY KEY (userID, bookID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (bookID) REFERENCES Books(bookID)
);

CREATE TABLE Roles (
    roleID INT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE
);


