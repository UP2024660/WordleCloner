-- 1 Up

CREATE TABLE  Words (
    id Char(36) PRIMARY KEY,
    word Char(5) NOT NULL
);

INSERT INTO Words (id,word) VALUES
    ('ahah', 'hello'),
    ('abab','boxes'),
    ('alal','modes');

-- 1 Down

DROP TABLE Words;