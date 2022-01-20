-- create the schema
DROP SCHEMA IF EXISTS experiments;
CREATE SCHEMA experiments;

-- create the runs table
CREATE TABLE IF NOT EXISTS experiments.runs (
    id BIGSERIAL PRIMARY KEY,
    daterun TIMESTAMP DEFAULT NOW(),
    randomid VARCHAR, 
    participant VARCHAR,
    project VARCHAR,
    experiment VARCHAR,
    condition VARCHAR,
    researcher VARCHAR,
    sourcedb VARCHAR,
    location VARCHAR,
    data JSONB,
    exclude BOOLEAN,
    notes TEXT
);