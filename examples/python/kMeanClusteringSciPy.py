# The MIT License (MIT)
#
# Copyright (C) 2019 - David Piché

###############################################################################
# This file is an example of a python script using machine learning on trace
# data. This is the first of a two-part python script. This script is meant to
# be run with the jython scripting engine, as it does an event request on the
# currently active trace. It works on a kernel trace.
#
# The second part of the script is expected to be in the same directory as this
# script
#
# @param arg1
#            Number of clusters for the kmean algorithm
###############################################################################

# Modules
loadModule("/TraceCompass/Trace")
loadModule("/System/Resources")
loadModule("/System/Scripting")

import json

# Verify the arguments
if (len(argv) < 1):
	print("Required arguments : <number of clusters for kmeans>")
	exit()

# Is the first argument an integer
try:
  	int(argv[0])
except:
	print("First argument must be an integer")
	exit() 
  
# Does the companion script exists
currentFile = getScriptEngine().getExecutedFile()
parentPath = currentFile.getParent().getFullPath()
filePath = "workspace://" + str(parentPath) + "/kMeanClusteringSciPy_py4j.py"
file = getFile(filePath);
if file is None:
	print("Callee script not found: " + filePath)
	exit()

# Get the active trace
trace = getActiveTrace()
if trace is None:
	print("There is no active trace. Please open the trace to run this script on")
	exit()

# Counts the number of distinct syscall names
def distinctSyscallCount(syscallName, syscallNameDistinct, syscallNameCount, syscallNameIndex):
	if (len(syscallNameDistinct) == 0 or syscallNameDistinct.get(str(syscallName),"invalidSyscall") == "invalidSyscall" ):
		syscallNameDistinct[str(syscallName)] = 1
		syscallNameCount[str(syscallName)] = syscallNameIndex
		syscallNameIndex += 1
	else:
		syscallNameDistinct[str(syscallName)] += 1
	return syscallNameDistinct, syscallNameCount, syscallNameIndex

# Extract the necessary data
def extractAspects():
	mapInitialInfo = java.util.HashMap()
	syscallNameIndex = 0
	layout = trace.getKernelEventLayout()
	iter = getEventIterator(trace)
	event = None
	durations = []
	syscallNameList = []
	syscallNameDistinct = {}
	syscallNameCount = {}
	while iter.hasNext():
		event = iter.next();
		eventName = str(event.getName())

		if (eventName.startswith(layout.eventSyscallEntryPrefix()) or eventName.startswith(layout.eventCompatSyscallEntryPrefix())):
			tid = org.eclipse.tracecompass.analysis.os.linux.core.kernel.KernelTidAspect.INSTANCE.resolve(event)
			startTime = event.getTimestamp().toNanos()
			syscallName = eventName[len(layout.eventSyscallEntryPrefix()):]

			syscallInfo = [startTime, syscallName]
			mapInitialInfo.put(tid, syscallInfo)
		elif (eventName.startswith(layout.eventSyscallExitPrefix())):
			tid = org.eclipse.tracecompass.analysis.os.linux.core.kernel.KernelTidAspect.INSTANCE.resolve(event)
			endTime = event.getTimestamp().toNanos()
			syscallInfo = mapInitialInfo.remove(tid)
			if not(syscallInfo is None):
				durations.append(float(endTime - syscallInfo[0]))
				syscallNameDistinct, syscallNameCount, index = distinctSyscallCount(syscallInfo[1], syscallNameDistinct, syscallNameCount, syscallNameIndex)
				syscallNameIndex = index
				syscallNameList.append(syscallInfo[1])
	return syscallNameDistinct, syscallNameCount, syscallNameList, durations

# Calculate the data for this analysis
syscallNameDistinct, syscallNameCount, syscallNameList, durations = extractAspects()

# Set the variables as shared objects, dumping to json
setSharedObject("syscallNameDistinct", json.dumps(syscallNameDistinct), False, True)
setSharedObject("syscallNameCount", json.dumps(syscallNameCount), False, True)
setSharedObject("syscallNameList", json.dumps(syscallNameList), False, True)
setSharedObject("durations", json.dumps(durations), False, True)
	
# Run the companion script with the argument for kmean
result = fork(file, argv[0], "org.eclipse.ease.lang.python.py4j.engine")
result.waitForResult()
print(result)
