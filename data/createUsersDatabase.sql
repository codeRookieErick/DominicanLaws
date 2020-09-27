DROP TABLE IF EXISTS Users;
CREATE TABLE Users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    passwordExtraCode TEXT NOT NULL,
    maxTokenCount INT
);
DROP TABLE IF EXISTS Tokens;
CREATE TABLE Tokens(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario INTEGER,
    token TEXT,
    expiration INTEGER
);
DROP TABLE IF EXISTS UserCreationRequests;
CREATE TABLE UserCreationRequests(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creationRequestCode TEXT,
    userName TEXT,
    email TEXT,
    passwordXorEncripted BINARY,
    requestStatus INTEGER,
    creationDate INTEGER DEFAULT (strftime('%s', 'now'))
);