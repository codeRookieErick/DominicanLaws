import time
import os


def test():
    branch = 'master'
    remote = 'github'
    updateIntervalSeg = 30.0
    while True:
        try:
            print(os.system(f'git pull {remote} {branch}'))
        except KeyboardInterrupt as e:
            print("Exiting...")
            break
        except Exception as e:
            print(e)
        time.sleep(updateIntervalSeg)


test()
