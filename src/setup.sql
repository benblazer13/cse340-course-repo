DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS service_project;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS category;



-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT         NOT NULL,
    contact_email   VARCHAR(255) NOT NULL,
    logo_filename   VARCHAR(255) NOT NULL
);

-- ========================================
-- Sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id      SERIAL PRIMARY KEY,
    organization_id INTEGER      NOT NULL
                    REFERENCES organization(organization_id),
    title           VARCHAR(150) NOT NULL,
    description     TEXT         NOT NULL,
    location        VARCHAR(255) NOT NULL,
    project_date    DATE         NOT NULL
);

-- ========================================
-- Sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (1)
(1, 'Playground Rebuild', 'Replace worn equipment and resurface the play area.', 'Riverside Park', '2026-11-14'),
(1, 'Wheelchair Ramp Install', 'Build an accessible ramp for a local family.', 'Oak Street Residence', '2026-11-21'),
(1, 'Community Center Repaint', 'Prep and paint interior walls.', 'Eastside Community Center', '2026-12-05'),
(1, 'Bus Shelter Repairs', 'Repair benches and roofing on neighborhood shelters.', 'Main Street Corridor', '2027-01-16'),
(1, 'Solar Lighting Project', 'Install solar path lights along the walking trail.', 'North Greenway Trail', '2027-02-13'),
-- GreenHarvest Growers (2)
(2, 'Raised Bed Build', 'Construct raised garden beds for a school garden.', 'Lincoln Elementary', '2026-11-12'),
(2, 'Fall Harvest Day', 'Harvest produce and donate it to the food pantry.', 'Hilltop Urban Farm', '2026-11-19'),
(2, 'Composting Workshop', 'Teach residents how to start home composting.', 'Public Library Annex', '2026-12-03'),
(2, 'Seed Starting Clinic', 'Help families start seedlings for spring.', 'Westside Greenhouse', '2027-02-20'),
(2, 'Community Garden Cleanup', 'Clear beds and prep soil for planting season.', 'Maple Community Garden', '2027-03-13'),
-- UnityServe Volunteers (3)
(3, 'Soup Kitchen Shift', 'Prepare and serve meals.', 'Downtown Mission', '2026-11-15'),
(3, 'Coat Drive Sorting', 'Sort and size donated winter coats.', 'UnityServe Warehouse', '2026-11-28'),
(3, 'Holiday Meal Packing', 'Pack holiday meal boxes for families.', 'Regional Food Bank', '2026-12-19'),
(3, 'Blanket Tying Night', 'Make fleece tie blankets for the shelter.', 'Community Center', '2027-01-10'),
(3, 'Hygiene Kit Assembly', 'Assemble toiletry kits for local shelters.', 'Downtown Mission', '2027-02-06');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project-Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id  INTEGER NOT NULL
                REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL
                REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Construction & Repair'),   -- 1
('Environment & Gardening'), -- 2
('Food Security'),           -- 3
('Education'),               -- 4
('Community Support');       -- 5

-- ========================================
-- Sample data: Project-Category links
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),                  -- Playground Rebuild
(2, 1), (2, 5),          -- Wheelchair Ramp Install
(3, 1),                  -- Community Center Repaint
(4, 1),                  -- Bus Shelter Repairs
(5, 1), (5, 2),          -- Solar Lighting Project
(6, 1), (6, 2), (6, 4),  -- Raised Bed Build
(7, 2), (7, 3),          -- Fall Harvest Day
(8, 2), (8, 4),          -- Composting Workshop
(9, 2), (9, 4),          -- Seed Starting Clinic
(10, 2),                 -- Community Garden Cleanup
(11, 3), (11, 5),        -- Soup Kitchen Shift
(12, 5),                 -- Coat Drive Sorting
(13, 3),                 -- Holiday Meal Packing
(14, 5),                 -- Blanket Tying Night
(15, 5);                 -- Hygiene Kit Assembly


-- end of setup