import sqlite3
import os
import time
import sys
from uuid import uuid4
from hashlib import md5

dataFolderPath = 'data'
maxSleepTimeSeg = 10.00
heartBeatIntervalSeg = maxSleepTimeSeg / 1.00
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


def delete_expired_tokens():
    epoch = int(time.time())
    with sqlite3.Connection(usersDatabasePath) as connection:
        toDelete = connection.execute(
            "SELECT COUNT(*) FROM Tokens WHERE expiration < ?;",
            (epoch,)
        ).fetchall()[0][0]
        if toDelete > 0:
            connection.execute(
                "DELETE FROM Tokens WHERE expiration < ?;",
                (epoch,)
            )
            print(f'{toDelete} expired token(s) removed.')


def delete_exceded_tokens():
    with sqlite3.Connection(usersDatabasePath) as connection:
        toDelete = connection.execute(
            "SELECT COUNT(*)  FROM VW_Tokens WHERE ordenToken > maxTokenCount;"
        ).fetchall()[0][0]
        if toDelete > 0:
            connection.execute(
                "DELETE FROM Tokens WHERE id in" +
                "(SELECT id from VW_Tokens WHERE ordenToken > maxTokenCount);"
            )
            print(f'{toDelete} exceded token(s) removed.')


def main_job():
    global heartBeatIntervalSeg
    try:
        while True:
            data = []
            with sqlite3.Connection(usersDatabasePath) as connection:
                data = connection.execute(
                    "SELECT * FROM UserCreationRequests WHERE requestStatus = 1;"
                ).fetchall()
            if len(data) > 0:
                heartBeatIntervalSeg = maxSleepTimeSeg / len(data)
                print(f'{len(data)} user creation requests found.')
                print(f'Set sleep interval to {heartBeatIntervalSeg} seconds.')
            elif heartBeatIntervalSeg != maxSleepTimeSeg:
                heartBeatIntervalSeg = maxSleepTimeSeg
                print(
                    f'Set sleep interval to {heartBeatIntervalSeg} seconds. [IDLE]')
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
                    set_request_status(requestCode, 10)
            delete_expired_creation_requests()
            delete_expired_tokens()
            delete_exceded_tokens()
            time.sleep(heartBeatIntervalSeg)
    except KeyboardInterrupt as e:
        print("Users Manager Stopped by the user")
    except Exception as e:
        print(e)


main_job()
