/* =========================================================
   CSE 340 - Database Rebuild Script
   Creates:
   - TYPE: account_type
   - TABLES: account, classification, inventory
   Inserts:
   - classification rows
   - inventory rows (includes "GM Hummer" + 2 "Sport" vehicles)
   IMPORTANT:
   - Task 1 Query #4 and #6 are included at the bottom
   ========================================================= */

-- Safety: drop in correct order
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TYPE IF EXISTS account_type;

-- 1) TYPE (enum)
CREATE TYPE account_type AS ENUM ('Client', 'Admin');

-- 2) TABLES
CREATE TABLE account (
  account_id       SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname  VARCHAR(50) NOT NULL,
  account_email     VARCHAR(255) NOT NULL UNIQUE,
  account_password  VARCHAR(255) NOT NULL,
  account_type      account_type NOT NULL DEFAULT 'Client'
);

CREATE TABLE classification (
  classification_id   SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE inventory (
  inv_id          SERIAL PRIMARY KEY,
  inv_make        VARCHAR(50) NOT NULL,
  inv_model       VARCHAR(50) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image       VARCHAR(255) NOT NULL,
  inv_thumbnail   VARCHAR(255) NOT NULL,
  classification_id INT NOT NULL,
  CONSTRAINT fk_classification
    FOREIGN KEY (classification_id)
    REFERENCES classification(classification_id)
);

-- 3) INSERT seed data
INSERT INTO classification (classification_name)
VALUES
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan'),
  ('Custom');

-- Inventory
-- NOTE: These image paths are intentionally missing "/vehicles" (Task 1 #6 fixes that)
INSERT INTO inventory (
  inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id
)
VALUES
  -- Sport (2 records required by Task 1 #5)
  ('Chevy', 'Camaro', 'Fast and loud sport coupe.', '/images/camaro.jpg', '/images/camaro-tn.jpg',
    (SELECT classification_id FROM classification WHERE classification_name = 'Sport')
  ),
  ('Wayne', 'Batmobile', 'A stealthy sport machine built for the night.', '/images/batmobile.jpg', '/images/batmobile-tn.jpg',
    (SELECT classification_id FROM classification WHERE classification_name = 'Sport')
  ),

  -- GM Hummer (must contain the exact phrase "small interiors" for Task 1 #4)
  ('GM', 'Hummer', 'The Hummer is known for small interiors but huge road presence.', '/images/hummer.jpg', '/images/hummer-tn.jpg',
    (SELECT classification_id FROM classification WHERE classification_name = 'SUV')
  );

-- =========================================================
-- COPIED FROM Task One (MUST be last in rebuild file)
-- Query #4: Update GM Hummer description using REPLACE
-- =========================================================
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- =========================================================
-- COPIED FROM Task One (MUST be last in rebuild file)
-- Query #6: Add "/vehicles" into inv_image and inv_thumbnail
-- Example final: /images/vehicles/a-car-name.jpg
-- =========================================================
UPDATE inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
