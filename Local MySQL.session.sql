
CREATE TABLE Customers (
    customerID INT PRIMARY KEY,
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
    postal_code CHAR(5)
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
);

CREATE TABLE Cart (
    cartID INT PRIMARY KEY,
    total_price DECIMAL(10, 2),
    created DATETIME,
    last_updated DATETIME,
    customerID INT,
    coupon VARCHAR(50),
    cart_promotionID INT
);

CREATE TABLE Orders (
    orderID INT PRIMARY KEY,
    total_price DECIMAL(10, 2),
    created DATETIME,
    last_updated DATETIME,
    status VARCHAR(50),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    cartID INT
);

CREATE TABLE Claim (
    claimID INT PRIMARY KEY,
    description TEXT,
    claim_status VARCHAR(50),
    resolution TEXT,
    claim_date DATETIME,
    last_update DATETIME,
    support_document VARCHAR(255),
    customerID INT,
    orderID INT,
    bookID INT
);

CREATE TABLE Coupon (
    couponID INT PRIMARY KEY,
    code VARCHAR(50),
    description TEXT,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INT,
    usage_count INT,
    is_active BOOLEAN
);


CREATE TABLE Cart_promotion (
    cart_promotionID INT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    is_active BOOLEAN
);

CREATE TABLE Book_promotion (
    book_promotionID INT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    is_active BOOLEAN
);

CREATE TABLE Shipping (
    tracking_number VARCHAR(50) PRIMARY KEY,
    orderID INT,
    shipping_status VARCHAR(50),
    shipping_date DATE,
    carrier VARCHAR(100)
);

CREATE TABLE Question (
    customerID INT,
    qna_type VARCHAR(50),
    description TEXT
);

CREATE TABLE Cart_items (
    cartID INT,
    bookID INT,
    quantity INT
);

CREATE TABLE Order_items (
    orderID INT,
    bookID INT,
    quantity INT
);

CREATE TABLE Reviews (
    customerID INT,
    bookID INT,
    rating INT,
    comment TEXT,
    review_date DATE,
    has_buy BOOLEAN
);