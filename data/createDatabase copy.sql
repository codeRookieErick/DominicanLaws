DROP TABLE IF EXISTS Titulos;
CREATE TABLE Titulos(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    codigoTitulo TEXT NOT NULL UNIQUE,
    nombreTitulo TEXT NOT NULL,
    textoTitulo TEXT
);
DROP TABLE IF EXISTS Capitulos;
CREATE TABLE Capitulos(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    codigoCapitulo TEXT NOT NULL UNIQUE,
    nombreCapitulo TEXT NOT NULL,
    textoCapitulo TEXT
);
DROP TABLE IF EXISTS Secciones;
CREATE TABLE Secciones(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    codigoSeccion TEXT NOT NULL UNIQUE,
    nombreSeccion TEXT NOT NULL,
    textoSeccion TEXT
);
DROP TABLE IF EXISTS Articulos;
CREATE TABLE Articulos(
    ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    codigoTitulo TEXT,
    codigoCapitulo TEXT,
    codigoSeccion TEXT,
    codigoArticulo TEXT,
    nombreArticulo TEXT NOT NULL,
    textoArticulo TEXT NOT NULL
);
DROP IF EXISTS vw_Capitulos;
CREATE VIEW vw_Capitulos AS
SELECT DISTINCT capitulos.*,
    articulos.codigoTitulo
FROM capitulos
    join articulos on capitulos.codigoCapitulo = articulos.codigoCapitulo;