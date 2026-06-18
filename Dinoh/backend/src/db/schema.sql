CREATE TABLE IF NOT EXISTS stats (
    label       TEXT        PRIMARY KEY,
    value       TEXT        NOT NULL,
    delta       TEXT        NOT NULL,
    icon        TEXT        NOT NULL,
    accent      TEXT        NOT NULL,
    sort_order  INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS apps (
    id          TEXT        PRIMARY KEY,
    name        TEXT        NOT NULL,
    author      TEXT        NOT NULL,
    description TEXT        NOT NULL,
    rating      NUMERIC(3,1) NOT NULL DEFAULT 0,
    reviews     INTEGER     NOT NULL DEFAULT 0,
    value       NUMERIC(3,1) NOT NULL DEFAULT 0,
    users       INTEGER     NOT NULL DEFAULT 0,
    tags        TEXT[]      NOT NULL DEFAULT '{}',
    rank        INTEGER     NOT NULL DEFAULT 0,
    emoji       TEXT        NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS explore_items (
    id              TEXT        PRIMARY KEY,
    type            TEXT        NOT NULL CHECK (type IN ('APP', 'PROMPT')),
    title           TEXT        NOT NULL,
    author          TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    tags            TEXT[]      NOT NULL DEFAULT '{}',
    extra_tags      INTEGER     NOT NULL DEFAULT 0,
    confidentiality TEXT        NOT NULL CHECK (confidentiality IN ('C1','C2','C3','C4')),
    rating          NUMERIC(3,1) NOT NULL DEFAULT 0,
    reviews         INTEGER     NOT NULL DEFAULT 0,
    bookmarks       INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS submissions (
    id              TEXT        PRIMARY KEY,
    url             TEXT        NOT NULL,
    name            TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    tags            TEXT[]      NOT NULL DEFAULT '{}',
    function        TEXT        NOT NULL,
    department      TEXT        NOT NULL DEFAULT '',
    confidentiality TEXT        NOT NULL CHECK (confidentiality IN ('C1','C2','C3','C4')),
    submitter_name  TEXT        NOT NULL,
    submitter_email TEXT        NOT NULL,
    submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
