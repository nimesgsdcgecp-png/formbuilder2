formbuilder=#
formbuilder=# CREATE DATABASE formbuilder2
formbuilder-# ;
CREATE DATABASE
formbuilder=#
formbuilder=# \c formbuilder2
You are now connected to database "formbuilder2" as user "postgres".
formbuilder2=# -- 1. Create Enums for Type Safety
formbuilder2=# CREATE TYPE form_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE
formbuilder2=# CREATE TYPE field_data_type AS ENUM ('TEXT', 'NUMERIC', 'DATE', 'BOOLEAN', 'TEXTAREA');
CREATE TYPE
formbuilder2=#
formbuilder2=# -- 2. Create the Forms Table (High-level configuration)
formbuilder2=# CREATE TABLE forms (
formbuilder2(#     id BIGSERIAL PRIMARY KEY,
formbuilder2(#     title VARCHAR(255) NOT NULL,
formbuilder2(#     description TEXT,
formbuilder2(#     status form_status NOT NULL DEFAULT 'DRAFT',
formbuilder2(#     target_table_name VARCHAR(64) UNIQUE, -- The prefix for dynamic tables
formbuilder2(#     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
formbuilder2(#     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
formbuilder2(# );
CREATE TABLE
formbuilder2=#
formbuilder2=# -- 3. Create Form Versions (To handle schema evolution/rollbacks)
formbuilder2=# CREATE TABLE form_versions (
formbuilder2(#     id BIGSERIAL PRIMARY KEY,
formbuilder2(#     form_id BIGINT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
formbuilder2(#     version_number INT NOT NULL,
formbuilder2(#     change_log TEXT, -- Optional: Description of what changed in this version
formbuilder2(#     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
formbuilder2(#
formbuilder2(#     -- Constraint: Unique version per form
formbuilder2(#     UNIQUE(form_id, version_number)
formbuilder2(# );
CREATE TABLE
formbuilder2=#
formbuilder2=# -- 4. Create Form Fields (The blueprint for dynamic columns)
formbuilder2=# CREATE TABLE form_fields (
formbuilder2(#     id BIGSERIAL PRIMARY KEY,
formbuilder2(#     form_version_id BIGINT NOT NULL REFERENCES form_versions(id) ON DELETE CASCADE,
formbuilder2(#
formbuilder2(#     -- The label shown to the user (e.g., "First Name")
formbuilder2(#     field_label VARCHAR(255) NOT NULL,
formbuilder2(#
formbuilder2(#     -- The actual DB column name (e.g., "first_name").
formbuilder2(#     -- Application logic must ensure this is snake_case and SQL safe.
formbuilder2(#     column_name VARCHAR(64) NOT NULL,
formbuilder2(#
formbuilder2(#     field_type field_data_type NOT NULL,
formbuilder2(#     is_mandatory BOOLEAN DEFAULT FALSE,
formbuilder2(#
formbuilder2(#     -- Store validation rules as JSON (e.g., {"min": 5, "regex": "^[A-Z]"})
formbuilder2(#     validation_rules JSONB DEFAULT '{}'::jsonb,
formbuilder2(#
formbuilder2(#     -- To control the display order of fields in the frontend
formbuilder2(#     ordinal_position INT NOT NULL,
formbuilder2(#
formbuilder2(#     UNIQUE(form_version_id, column_name)
formbuilder2(# );
CREATE TABLE
formbuilder2=#
formbuilder2=# -- 5. Indexes for Performance
formbuilder2=# CREATE INDEX idx_forms_status ON forms(status);
CREATE INDEX
formbuilder2=# CREATE INDEX idx_form_fields_version ON form_fields(form_version_id);
