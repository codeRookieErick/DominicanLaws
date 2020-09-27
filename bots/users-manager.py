import sqlite3
import os
import time
from uuid import uuid4
from hashlib import md5

dataFolderPath = '..\\data'
heartBeatIntervalSeg = 4

usersDatabasePath = os.sep.join([dataFolderPath, 'users.db'])
xorEncriptionKeyPath = os.sep.join([dataFolderPath, 'xorEncriptionKey.txt'])


def get_xor_key(data):
    key = ''
    result = ''
    with open(xorEncriptionKeyPath, 'r') as f:
        key = f.read().strip()
    key = [i for i in key]
    data = data.split(',')
    for index in range(0, len(data)):
        result += str(int(data[index]) ^ int(key[index % len(key)]))
    return result


def get_random_extra(len=4):
    return str(uuid4())[:len]


def get_hash(password, extra):
    return md5((password + extra).encode()).hexdigest().upper()


def get_user_by_username(username):
    query = "SELECT * FROM Users WHERE username = ?;"
    with sqlite3.Connection(usersDatabasePath) as connection:
        return connection.execute(query, (username,)).fetchall()


def get_user_by_email(email):
    query = "SELECT * FROM Users WHERE email = ?;"
    with sqlite3.Connection(usersDatabasePath) as connection:
        return connection.execute(query, (email,)).fetchall()


def set_request_status(requestCode, status):
    with sqlite3.Connection(usersDatabasePath) as connection:
        connection.execute(
            "UPDATE UserCreationRequests SET requestStatus = ? WHERE creationRequestCode = ?;",
            (status, requestCode)
        )


def save_user(username, email, passwordHash, extra, maxTokenCount):
    with sqlite3.Connection(usersDatabasePath) as connection:
        connection.execute(
            "INSERT INTO Users (userName, email, passwordHash, passwordExtraCode, maxTokenCount) VALUES (?,?,?,?,?)",
            (username, email, passwordHash, extra, maxTokenCount)
        )


def delete_creation_request(requestCode):
    with sqlite3.Connection(usersDatabasePath) as connection:
        connection.execute(
            "DELETE FROM UserCreationRequests WHERE creationRequestCode = ?;",
            (requestCode,)
        )


def delete_expired_creation_requests():
    timeToLive = int(time.time()) - 60
    with sqlite3.Connection(usersDatabasePath) as connection:
        connection.execute(
            "DELETE FROM UserCreationRequests WHERE creationDate < ?;",
            (timeToLive,)
        )


def main_job():
    while True:
        data = []
        with sqlite3.Connection(usersDatabasePath) as connection:
            data = connection.execute(
                "SELECT * FROM UserCreationRequests WHERE requestStatus = 1;"
            ).fetchall()
        print(f'{len(data)} user creation requests found.')
        for creationRequest in data:
            requestCode = creationRequest[1]
            username = creationRequest[2]
            email = creationRequest[3]
            if len(get_user_by_username(username)) > 0:
                print(
                    f'USER_CREATION_FAIL: Username alredy taken "{username}"')
                set_request_status(requestCode, 2)
            elif len(get_user_by_email(email)) > 0:
                print(f'USER_CREATION_FAIL: Email alredy taken "{email}"')
                set_request_status(requestCode, 3)
            else:
                password = get_xor_key(creationRequest[4])
                extra = get_random_extra().upper()
                passwordHash = get_hash(password, extra)
                save_user(username, email, passwordHash, extra, 3)
                print(f'USER_CREATION_SUCCESS: "{username}"')
                delete_creation_request(requestCode)
        delete_expired_creation_requests()
        time.sleep(heartBeatIntervalSeg)


main_job()
