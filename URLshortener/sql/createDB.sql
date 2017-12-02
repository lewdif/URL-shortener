drop database if exists URL_CONTAINER;
create database URL_CONTAINER;

use URL_CONTAINER;

create table url_data (
			  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
			  longURL VARCHAR(255) NOT NULL,
			  shortURL VARCHAR(8) NOT NULL,

			  PRIMARY KEY (id),
			  KEY shortURL (shortURL)
);

alter table url_data AUTO_INCREMENT = 1001;
