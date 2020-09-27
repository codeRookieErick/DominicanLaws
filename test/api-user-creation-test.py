import requests
import random
import json
import time

apiUrl = 'http://localhost:2020/api/users/requestUserCreation'

firstNames = ['Juan', 'Pedro', 'Jose', 'Miguel']
lastNames = ['Lopez', 'Perez', 'Gonzales', 'Martinez']
passwordCharacters = [i for i in range(33, 126)] + [i for i in range(185, 254)]
passwordCharacters = [chr(i) for i in passwordCharacters]
emails = ['@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com']


def get_random_password():
    passwordLength = random.randint(8, 14)
    result = ''
    for i in range(0, passwordLength):
        result += random.choice(passwordCharacters)
    return result


def get_random_userName(firstName, lastName):
    mode = random.randint(0, 1)
    result = ''
    if mode == 0:
        result = f'{firstName}.{lastName}'
    elif mode == 1:
        separator = random.choice(['.', '_', '-', ''])
        result = f'{firstName}{separator}{lastName}'
    if random.randint(1, 10) > 4:
        result += str(random.randint(0, 9999))
    return result


def get_random_email(firstName, lastName):
    userPart = get_random_userName(firstName, lastName)
    provider = random.choice(emails)
    return f'{userPart}{provider}'


def request_user_creation(userName, password, email):
    return requests.post(
        apiUrl,
        {
            "username": userName,
            "password": password,
            "email": email
        }
    ).text


def get_random_user_data():
    firstName = random.choice(firstNames)
    lastName = random.choice(lastNames)
    return(
        get_random_userName(firstName, lastName),
        get_random_password(),
        get_random_email(firstName, lastName)
    )


def test():
    while True:
        try:
            usersToCreate = random.randint(1, 200)
            for i in range(usersToCreate):
                user = get_random_user_data()
                print(request_user_creation(user[0], user[1], user[2]))
                if random.randint(0, 10) > 8:
                    time.sleep(random.randint(1, 2))
        except KeyboardInterrupt as e:
            print("Exiting...")
            break
        except Exception as e:
            print(e)


test()
