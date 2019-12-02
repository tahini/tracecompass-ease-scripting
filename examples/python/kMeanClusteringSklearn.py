# Imports
from matplotlib import pyplot
from matplotlib.ticker import FuncFormatter
from sklearn.cluster import MiniBatchKMeans
import numpy

# Modules
loadModule("/TraceCompass/Trace")
loadModule("/TraceCompass/Analysis")
loadModule("/TraceCompass/View")
loadModule("/TraceCompass/DataProvider")

# Script
trace = getActiveTrace()
analysis = getAnalysis("analysistest.py")

# Counts the number of distinct syscall names
def distinctSyscallCount(syscallName, syscallNameCount, syscallNameIndex):
	if (len(syscallNameCount) == 0 or syscallNameCount.get(str(syscallName),"invalidSyscall") == "invalidSyscall" ):
		syscallNameCount[str(syscallName)] = syscallNameIndex
		syscallNameIndex += 1
	return syscallNameCount, syscallNameIndex

# Extract the necessary data
def extractAspects():
	mapInitialInfo = java.util.HashMap()
	layout = trace.getKernelEventLayout()
	iter = analysis.getEventIterator()
	event = None
	syscallNameIndex = 0
	durations = []
	syscallNameList = []
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
				syscallNameCount, index = distinctSyscallCount(syscallInfo[1], syscallNameCount,syscallNameIndex)
				syscallNameIndex = index
				syscallNameList.append(syscallInfo[1])
	return syscallNameCount, syscallNameList, durations

# Run clustering algorithm on aspects
def runClustering(durations):
	kmeans = MiniBatchKMeans(n_clusters = int(argv[0]))
	durations = numpy.asarray(durations).reshape(-1,1)
	prediction = kmeans.fit_predict(durations)
	return prediction

# Colors
colors = numpy.array(["b","r","g","y","c","m","k"])

# Format durations with commas (for thousands, millions)
def formatDuration(x, pos):
	return format(x, ",.0f")

# Shows the xy plot with a matplotlib scatter plot
def showPlot(prediction, syscallNameCount, syscallNameList, durations):
	print(syscallNameCount)
	listColor = [[] for x in range(int(argv[0]))]
	syscallNameIndex = [[] for x in range(int(argv[0]))]

	for code in range(len(durations)):
		listColor[prediction[code]].append(durations[code])
		syscallNameIndex[prediction[code]].append(syscallNameCount.get(str(syscallNameList[code])))

	syscallNames = ["" for x in range(len(syscallNameCount))]

	for k, v in syscallNameCount.items():
		syscallNames[v] = k

	fig, ax = pyplot.subplots()
	formatter = FuncFormatter(formatDuration)
	ax.xaxis.set_major_formatter(formatter)
	# Titles
	pyplot.title("System Call Clustering by Duration", fontsize=20,fontweight='bold')
	pyplot.xlabel("System Call Duration (ns)", fontsize=14)
	pyplot.ylabel("System Call Name", fontsize=14)

	for i in range(int(argv[0])):
			pyplot.yticks(numpy.arange(0,len(syscallNameCount)), syscallNames)
			pyplot.scatter(numpy.asarray(listColor[i]),numpy.asarray(syscallNameIndex[i]),c=colors[i])

	# No duration is < than 0
	pyplot.xlim(xmin=0)
	pyplot.ylim(ymin=-2)

syscallNameCount, syscallNameList, durations = extractAspects()
prediction = runClustering(durations)
showPlot(prediction, syscallNameCount, syscallNameList, durations)
pyplot.show()

