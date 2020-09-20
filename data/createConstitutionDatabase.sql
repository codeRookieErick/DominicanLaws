DROP TABLE IF EXISTS Titulos;
CREATE TABLE Titulos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigoTitulo TEXT NOT NULL UNIQUE,
    nombreTitulo TEXT NOT NULL,
    textoTitulo TEXT
);
DROP TABLE IF EXISTS Capitulos;
CREATE TABLE Capitulos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigoCapitulo TEXT NOT NULL UNIQUE,
    nombreCapitulo TEXT NOT NULL,
    textoCapitulo TEXT
);
DROP TABLE IF EXISTS Secciones;
CREATE TABLE Secciones(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigoSeccion TEXT NOT NULL UNIQUE,
    nombreSeccion TEXT NOT NULL,
    textoSeccion TEXT
);
DROP TABLE IF EXISTS Articulos;
CREATE TABLE Articulos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigoTitulo TEXT,
    codigoCapitulo TEXT,
    codigoSeccion TEXT,
    codigoArticulo TEXT,
    nombreArticulo TEXT NOT NULL,
    textoArticulo TEXT NOT NULL
);
DROP VIEW IF EXISTS vw_Capitulos;
CREATE VIEW vw_Capitulos AS
SELECT DISTINCT capitulos.*,
    articulos.codigoTitulo
FROM capitulos
    join articulos on capitulos.codigoCapitulo = articulos.codigoCapitulo;
DROP VIEW IF EXISTS vw_Secciones;
CREATE VIEW vw_Secciones AS
SELECT DISTINCT secciones.*,
    articulos.codigoCapitulo,
    articulos.codigoTitulo
FROM secciones
    join articulos on secciones.codigoSeccion = articulos.codigoSeccion;