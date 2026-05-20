-- Defines the specific access levels and permissions available in the system
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores central HQ administrator accounts for the control panel
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    contact_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maps admins to their specific roles, allowing for multi-role assignments
CREATE TABLE admin_roles (
    admin_role_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Defines the three regional groups — Visayas, Luzon, Mindanao
CREATE TABLE branches_regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores all Ribshack branch information and store-level account credentials
CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    full_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    region_id INT NOT NULL REFERENCES branches_regions(region_id) ON DELETE CASCADE,
    manager_name VARCHAR(100),
    contact_number VARCHAR(20),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks the open/closed status history of each branch
CREATE TABLE branch_status_logs (
    log_id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN('OPEN', 'CLOSED')),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores basic personal information for all employees
CREATE TABLE staffs (
    staff_id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Defines branch-level staff roles (Kitchen Staff, Cashier, Delivery, Manager)
CREATE TABLE staff_roles (
    staff_role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores staff profiles assigned to each branch
CREATE TABLE staff_members (
    staff_member_id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL REFERENCES staffs(staff_id) ON DELETE CASCADE,
    branch_id INT NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    staff_role_id INT REFERENCES staff_roles(staff_role_id) ON DELETE SET NULL,
    date_hired DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manages work shifts for staff members at specific branches
CREATE TABLE staff_schedules (
    schedule_id SERIAL PRIMARY KEY,
    staff_member_id INT NOT NULL REFERENCES staff_members(staff_member_id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks daily attendance and shift coverage per staff member
CREATE TABLE staff_attendance (
    attendance_id SERIAL PRIMARY KEY,
    staff_member_id INTEGER NOT NULL REFERENCES staff_members(staff_member_id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES staff_schedules(schedule_id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_in TIMESTAMP,
    time_out TIMESTAMP,
    status VARCHAR(20) DEFAULT 'PRESENT' 
        CHECK (status IN ('PRESENT','ABSENT','LATE','ON_LEAVE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master List of Items (Global Catalog)
CREATE TABLE inventory_items (
    item_id           SERIAL PRIMARY KEY,
    branch_id         INTEGER NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    item_name         VARCHAR(100) NOT NULL,
    item_type         VARCHAR(50), -- e.g., 'Meat', 'Ingredient' (from your UI)
    unit_of_measure   VARCHAR(30), -- e.g., 'kg', 'bottles'
    current_quantity  NUMERIC(10,2) DEFAULT 0,
    reorder_threshold NUMERIC(10,2) DEFAULT 0, -- Min Threshold
    max_threshold     NUMERIC(10,2),           -- Added from your Figma design
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restock Request Header (The "Card" in your Request Center)
CREATE TABLE inventory_requests (
    request_id     SERIAL PRIMARY KEY,
    branch_id      INTEGER NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    requested_by   INTEGER NOT NULL REFERENCES staffs(staff_id),
    priority_level VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' 
                   CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')), -- Added 'CRITICAL' from your screenshot
    status         VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED')),
    branch_notes   TEXT, -- "Running low on ribs. Weekend rush expected"
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restock Request Line Items (The list of items inside the modal)
CREATE TABLE inventory_request_items (
    request_item_id    SERIAL PRIMARY KEY,
    request_id         INTEGER NOT NULL REFERENCES inventory_requests(request_id) ON DELETE CASCADE,
    item_id            INTEGER REFERENCES inventory_items(item_id), -- Linked to the master item
    quantity_requested NUMERIC(10,2) NOT NULL,
    notes              TEXT
);

-- Status Logs (For the "Reason for Declining" or "Delivery Notes" modals)
CREATE TABLE inventory_request_status_logs (
    status_log_id SERIAL PRIMARY KEY,
    request_id    INTEGER NOT NULL REFERENCES inventory_requests(request_id) ON DELETE CASCADE,
    status        VARCHAR(20) NOT NULL,
    actioned_by   INTEGER REFERENCES admins(admin_id),
    actioned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks       TEXT -- This stores "Supplier out of stock" or "Scheduled for 10AM"
);

-- Defines product categories displayed in the menu
CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Global product catalog managed by HQ — single source of truth
CREATE TABLE products (
    product_id   SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description  TEXT,
    base_price   NUMERIC(10,2) NOT NULL,
    category_id  INTEGER NOT NULL REFERENCES product_categories(category_id),
    has_unli_rice BOOLEAN DEFAULT FALSE,
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores image references for each product in the global catalog
CREATE TABLE product_images (
    image_id    SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores available add-ons per product (extra rice, drinks, sauces)
CREATE TABLE product_addons (
    addon_id         SERIAL PRIMARY KEY,
    product_id       INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    addon_name       VARCHAR(100) NOT NULL,
    additional_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks which products are available or marked sold out per branch
CREATE TABLE branch_product_availability (
    availability_id   SERIAL PRIMARY KEY,
    branch_id         INTEGER NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    product_id        INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    is_available      BOOLEAN DEFAULT TRUE,
    marked_sold_out_at TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (branch_id, product_id)
);

-- Links products to branches with optional branch-level pricing overrides
CREATE TABLE branch_menu (
    branch_menu_id SERIAL PRIMARY KEY,
    branch_id      INTEGER NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    product_id     INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    price_override NUMERIC(10,2),
    is_visible     BOOLEAN DEFAULT TRUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (branch_id, product_id)
);

-- Stores all system users — customers
CREATE TABLE users (
    user_id        SERIAL PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    password_hash  TEXT NOT NULL,
    contact_number VARCHAR(20),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores the active cart per customer
CREATE TABLE carts (
    cart_id     SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    branch_id   INTEGER NOT NULL REFERENCES branches(branch_id),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (customer_id) -- one active cart per customer
);

-- Stores individual items inside a cart
CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id      INTEGER NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id   INTEGER NOT NULL REFERENCES products(product_id),
    quantity     INTEGER NOT NULL DEFAULT 1,
    unit_price   NUMERIC(10,2) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores addons selected per cart item
CREATE TABLE cart_item_addons (
    cart_addon_id SERIAL PRIMARY KEY,
    cart_item_id  INTEGER NOT NULL REFERENCES cart_items(cart_item_id) ON DELETE CASCADE,
    addon_id      INTEGER NOT NULL REFERENCES product_addons(addon_id),
    addon_name    VARCHAR(100) NOT NULL,
    addon_price   NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

-- Stores saved delivery addresses per customer
CREATE TABLE customer_addresses (
    address_id    SERIAL PRIMARY KEY,
    customer_id   INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    address_label VARCHAR(50),
    full_address  TEXT NOT NULL,
    city          VARCHAR(100) NOT NULL,
    province      VARCHAR(100),
    postal_code   VARCHAR(20),
    is_default    BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Records delivery address and timing used per order
CREATE TABLE delivery_details (
    delivery_id             SERIAL PRIMARY KEY,
    order_id                INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    address_id              INTEGER REFERENCES customer_addresses(address_id),
    full_address            TEXT NOT NULL,
    city                    VARCHAR(100) NOT NULL,
    estimated_delivery_time TIMESTAMP,
    delivered_at            TIMESTAMP,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a sequence that starts at 1
CREATE SEQUENCE order_number_seq START WITH 1;

-- Master table for all customer orders
CREATE TABLE orders (
    order_id       SERIAL PRIMARY KEY,
    order_number VARCHAR(20) DEFAULT ('ORD-' || LPAD(NEXTVAL('order_number_seq')::text, 3, '0')),
    customer_id    INTEGER NOT NULL REFERENCES users(user_id),
    branch_id      INTEGER NOT NULL REFERENCES branches(branch_id),
    order_status   VARCHAR(50) DEFAULT 'PLACED'
                       CHECK (order_status IN
                           ('PLACED','PREPARING','READY',
                            'OUT_FOR_DELIVERY','DELIVERED','CANCELLED')),
    total_amount   NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'CASH_ON_DELIVERY',
    placed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IMPROVED: Added total_price to order_items for easier accounting
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id      INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id    INTEGER NOT NULL REFERENCES products(product_id),
    quantity      INTEGER NOT NULL DEFAULT 1,
    unit_price    NUMERIC(10,2) NOT NULL, -- Price of the product only
    addons_total  NUMERIC(10,2) DEFAULT 0.00, -- Sum of all selected addons
    subtotal      NUMERIC(10,2) NOT NULL, -- (unit_price * quantity) + addons_total
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IMPROVED: Added a check for active add-ons
CREATE TABLE order_item_addons (
    order_addon_id SERIAL PRIMARY KEY,
    order_item_id  INTEGER NOT NULL REFERENCES order_items(order_item_id) ON DELETE CASCADE,
    addon_id       INTEGER NOT NULL REFERENCES product_addons(addon_id),
    addon_name     VARCHAR(100) NOT NULL,
    addon_price    NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

-- Tracks status history of each order
CREATE TABLE order_status_logs (
    status_log_id SERIAL PRIMARY KEY,
    order_id      INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    status        VARCHAR(50) NOT NULL,
    changed_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by    INTEGER REFERENCES users(user_id)
);

-- Records payment method and status per order
CREATE TABLE order_payments (
    payment_id     SERIAL PRIMARY KEY,
    order_id       INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    payment_status VARCHAR(50) DEFAULT 'PENDING'
                       CHECK (payment_status IN ('PENDING','PAID','FAILED','REFUNDED')),
    amount_paid    NUMERIC(10,2),
    paid_at        TIMESTAMP,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores special instructions provided by the customer at checkout
CREATE TABLE order_instructions (
    instruction_id   SERIAL PRIMARY KEY,
    order_id         INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    instruction_text TEXT NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Built exclusively for the customer-facing mobile/web application
CREATE TABLE app_notifications (
    notification_id   SERIAL PRIMARY KEY,
    customer_id       INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    order_id          INTEGER REFERENCES orders(order_id) ON DELETE SET NULL,
    title             VARCHAR(100) NOT NULL,
    message           TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL 
                      CHECK (notification_type IN ('ORDER_ACCEPTED', 'ORDER_PREPARING', 'ORDER_DISPATCHED', 'PROMO')),
    is_read           BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Built exclusively for internal company management/staff activities
CREATE TABLE store_notifications (
    notification_id   SERIAL PRIMARY KEY,
    branch_id         INTEGER REFERENCES branches(branch_id) ON DELETE CASCADE,
    target_role       VARCHAR(50), -- e.g., 'ADMIN', 'MANAGER', 'STAFF'
    title             VARCHAR(100) NOT NULL,
    message           TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL 
                      CHECK (notification_type IN ('NEW_ORDER', 'INV_LOW', 'INV_REQUEST', 'SYSTEM_ALERT', 'ACCEPT_REQUEST', 'STAFF_CHECK')),
    is_read           BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A single, polymorphic table running both client applications and store backends
CREATE TABLE system_notifications (
    notification_id   SERIAL PRIMARY KEY,
    
    -- Routing Flags: Explicitly tells the system exactly who owns or gets this alert record
    recipient_type    VARCHAR(15) NOT NULL CHECK (recipient_type IN ('CUSTOMER', 'STAFF', 'GLOBAL')),
    customer_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE, -- Nullable
    branch_id         INTEGER REFERENCES branches(branch_id) ON DELETE CASCADE,    -- Nullable
    target_role       VARCHAR(50),                                                 -- Nullable
    order_id          INTEGER REFERENCES orders(order_id) ON DELETE SET NULL,      -- Nullable
    
    title             VARCHAR(100) NOT NULL,
    message           TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL CHECK (notification_type IN (
                          'ORDER_ACCEPTED', 'ORDER_PREPARING', 'ORDER_DISPATCHED', -- Customer alerts
                          'NEW_ORDER', 'INV_LOW', 'INV_REQUEST',                   -- Staff alerts
                          'APP_MAINTENANCE'                                        -- System alerts
                      )),
    is_read           BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);