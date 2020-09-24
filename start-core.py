from threading import Lock, Thread
from subprocess import Popen
import os


class MyMultiProcess:
    def __init__(self):
        self.lock = Lock()
        self.lock.acquire()
        pass

    def start_and_wait(self, args, processName):
        print(f"Running Subprocess: '{processName}'")
        try:
            p = Popen(args)
            with self.lock:
                print(f"Stopping Subprocess: '{processName}'")
                p.kill()
        except Exception as e:
            print(f"Error {e.args} in Subprocess: '{processName}'")

    def run(self, args, processName):
        Thread(target=self.start_and_wait, args=[args, processName]).start()

    def kill(self):
        self.lock.release()


manager = MyMultiProcess()

manager.run(['node.exe', './server.js'], 'Nodejs server (nodemon)')
manager.run(['py', 'bots/main-bot.py'], 'Python bot')


try:
    while not input(f"Type 'exit' to end.{os.linesep}") == 'exit':
        pass
except:
    manager.kill()
