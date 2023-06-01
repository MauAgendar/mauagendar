SET DATESTYLE TO POSTGRES, DMY ;
DROP TABLE IF EXISTS appointments CASCADE ;

CREATE TABLE appointments(user_id SERIAL PRIMARY KEY, title VARCHAR(500), "date" DATE NOT NULL);
INSERT INTO appointments VALUES(DEFAULT,'fazer cafÉ', current_date)