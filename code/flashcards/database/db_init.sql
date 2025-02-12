CREATE DATABASE IF NOT EXISTS pbulle_db;
USE pbulle_db;

CREATE USER 'pbulle_user'@'%' IDENTIFIED BY 'pbulle_password';
GRANT ALL PRIVILEGES ON pbulle_db.* TO 'pbulle_user'@'%';
FLUSH PRIVILEGES;
