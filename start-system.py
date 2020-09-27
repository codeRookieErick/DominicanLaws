from threading import Lock, Thread
from subprocess import Popen
import json
import os
import sys


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
        except:
            print(f"Error in Subprocess: '{processName}'")

    def run(self, args, processName):
        Thread(target=self.start_and_wait, args=[args, processName]).start()

    def kill(self):
        self.lock.release()


class JsonConfig:
    def __init__(self, name):
        self.data = {}
        self.name = name
        self.path = f'{name}-config.json'
        self.reload()

    def reload(self):
        with open(self.path, 'r') as f:
            self.data = json.load(f)

    def save(self):
        with open(self.path, 'w') as f:
            json.dump(self.data, f)

    def __iter__(self):
        for i in self.data:
            yield i

    def __str__(self):
        return str(self.data)

    def __getitem__(self, index):
        return self.data[index]

    def __setitem__(self, index, value):
        self.data[index] = value


systemConfig = JsonConfig('system')
environment = JsonConfig('environment')
manager = MyMultiProcess()

systemProcesses = systemConfig["systemProcesses"]
testProcesses = systemConfig["testProcesses"]
executables = environment["executables"]


def run_processes_list(processesList):
    global manager
    global executables
    for process in processesList:
        if process["executableCode"] in executables:
            arguments = [executables[process["executableCode"]]]
            for arg in process["parameters"]:
                arguments.append(arg)
            if process["disabled"]:
                continue
            manager.run(arguments, process["name"])


run_processes_list(systemProcesses)
if environment["runTest"]:
    run_processes_list(testProcesses)

# print(sys.argv)

try:
    while not input(f"DOMINICAN LAWS SYSTEM{os.linesep}") == 'exit':
        pass
except:
    manager.kill()
exit(0)
