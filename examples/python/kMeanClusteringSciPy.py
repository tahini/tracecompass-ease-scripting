# Imports
from matplotlib import pyplot
from matplotlib.ticker import FuncFormatter
from scipy.cluster.vq import kmeans
import numpy
from numpy import nditer

# Modules
loadModule("/TraceCompass/Trace")
loadModule("/TraceCompass/Analysis")
loadModule("/TraceCompass/View")
loadModule("/TraceCompass/DataProvider")

# Script
trace = getActiveTrace()
analysis = getAnalysis("analysistest.py")

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
	iter = analysis.getEventIterator()
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

# Gets the correct cluster the point belongs to
def nearestPointIndex(value, codebook):
	codebookNumpy = numpy.asarray(codebook)
	lengths = numpy.abs(codebook - value)
	return lengths.argmin()

# Prints clustering statistics (percentage)
def printStatistics():
	iter = 0
	for center in nditer(codebook):
		print("For center of " + str(center))
		percentage = float(len(durationData[iter]))/float(len(durations))*100
		print("Percentage of syscalls with this cluster: "+ str(percentage))
		iter += 1
	for k, v in syscallNameDistinct.items():
		print("Syscall name: " + k)
		print("Count: " + str(v))

# Run clustering algorithm on aspects
def runClustering(durations):
	codebook, distortion = kmeans(durations, int(argv[0]))
	return codebook, distortion

# Colors
colors = numpy.array(["b","r","g","y","c","m","k"])

# Prepare XY scatter points with color for matplotlib
def prepareScatterPlot(syscallNameCount, codebook, syscallNameList):

	durationData = [[] for x in range(int(argv[0])) ]
	syscallNameIndex = [[] for x in range(len(durationData))]

	for x in range(len(durations)):
		index = nearestPointIndex(durations[x-1], codebook)
		durationData[index].append(durations[x-1])
		syscallNameIndex[index].append(syscallNameCount.get(str(syscallNameList[x-1])))

	syscallName = ["" for x in range(len(syscallNameCount))]

	for k, v in syscallNameCount.items():
		syscallName[v] = k

	return syscallNameIndex, syscallName, durationData

# Format durations with commas (for thousands, millions)
def formatDuration(x, pos):
	return format(x, ",.0f")

# Shows the xy plot with a matplotlib scatter plot
def showPlot(syscallNameDistinct, syscallNameCount, durations, syscallNameList):
	fig, ax = pyplot.subplots()
	formatter = FuncFormatter(formatDuration)
	ax.xaxis.set_major_formatter(formatter)
	# Titles
	pyplot.title("System Call Clustering by Duration", fontsize=20,fontweight='bold')
	pyplot.xlabel("System Call Duration (ns)", fontsize=14)
	pyplot.ylabel("System Call Name", fontsize=14)

	for i in range(int(argv[0])):
			pyplot.yticks(numpy.arange(0,len(syscallNameDistinct)), syscallName)
			pyplot.scatter(numpy.asarray(durationData[i]),syscallNameIndex[i],c=colors[i])
	# No duration is < than 0
	pyplot.xlim(xmin=0)
	pyplot.ylim(ymin=-2)

syscallNameDistinct, syscallNameCount, syscallNameList, durations = extractAspects()
codebook, distortion = runClustering(durations)
syscallNameIndex, syscallName, durationData = prepareScatterPlot(syscallNameCount, codebook, syscallNameList)
showPlot(syscallNameDistinct, syscallNameCount, durations, syscallNameList)
printStatistics()
pyplot.show()

