<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
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
>>>>>>> 890969395fce515e853d416b1d7ccc65a08e1f88
