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