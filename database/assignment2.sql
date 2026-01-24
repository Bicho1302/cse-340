-- Assignment 2 - Task One
-- CSE 340
-- Student: Victor Salazar
-- Date: 2024-06-15
/* =========================================================
   Assignment 2 - Task One Queries (6 total)
   Notes:
   - For single-record UPDATE/DELETE, we use the PRIMARY KEY
     in the WHERE clause (via a subquery that finds the PK).
   - Query #4 and #6 should be copied to the VERY BOTTOM of
     your rebuild.sql file (they must run last in rebuild).
   ========================================================= */

-- 1) Insert the following new record to the account table:
-- Tony, Stark, tony@starkent.com, Iam1ronM@n
-- Note: account_id and account_type handle their own values.
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2) Modify the Tony Stark record to change account_type to "Admin".
-- Use the primary key in the WHERE clause (found by subquery).
UPDATE account
SET account_type = 'Admin'
WHERE account_id = (
  SELECT account_id
  FROM account
  WHERE account_email = 'tony@starkent.com'
);

-- 3) Delete the Tony Stark record from the database.
-- Use the primary key in the WHERE clause (found by subquery).
DELETE FROM account
WHERE account_id = (
  SELECT account_id
  FROM account
  WHERE account_email = 'tony@starkent.com'
);

-- 4) Modify the "GM Hummer" record to read "a huge interior"
-- rather than "small interiors" using a single UPDATE query.
-- Do NOT retype the entire description; use REPLACE().
-- (Uses primary key in WHERE via subquery.)
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = (
  SELECT inv_id
  FROM inventory
  WHERE inv_make = 'GM' AND inv_model = 'Hummer'
);

-- 5) Use an INNER JOIN to select the make and model fields from inventory
-- and the classification_name field from classification for items in "Sport".
-- Two records should be returned.
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6) Update ALL records in inventory to add "/vehicles" into the middle of the file path
-- in the inv_image and inv_thumbnail columns using a single query.
-- Final example: /images/vehicles/a-car-name.jpg
-- (Guard included to prevent double-applying if you run it again.)
UPDATE inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image NOT LIKE '/images/vehicles/%';
