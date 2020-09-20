::if exist database.db del database.db
::sqlite3 -init createDatabase.sql database.db ".exit"
py miner.py