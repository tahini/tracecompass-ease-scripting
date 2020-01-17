# The MIT License (MIT)
#
# Copyright (C) 2019 - David Piché

###############################################################################
# This file is part of an example python script using machine learning on trace
# data. This is the second of a two-parts python script. This script should not
# be run directly, but rather be called by the 'kMeanClusteringSciPy.py' script.
#
# @param arg1
#            Number of clusters for the kmean algorithm
###############################################################################

# Imports
import matplotlib
from matplotlib import pyplot
from matplotlib.ticker import FuncFormatter
from scipy.cluster.vq import kmeans
import numpy
from numpy import nditer
import json

# Modules
loadModule("/System/Scripting")

nbClusters = 1
# Is the first argument an integer
try:
  	nbClusters = int(argv[0])
except:
	print("First argument must be an integer")
	exit()

# Make sure the shared objects were set
nameDistinctStr = getSharedObject("syscallNameDistinct")
nameCountStr = getSharedObject("syscallNameCount")
nameListStr = getSharedObject("syscallNameList")
durationsStr = getSharedObject("durations")

if nameDistinctStr is None or nameCountStr is None or nameListStr is None or durationsStr is None:
	print("This script should be called from a companion script who will set shared object for it to use. It should not be run directly")
	exit()

syscallNameDistinct = json.loads(nameDistinctStr)
syscallNameCount = json.loads(nameCountStr)
syscallNameList = json.loads(nameListStr)
durations = json.loads(durationsStr)

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

# Use GTK3Agg as it is known to work. qt5 gives errors
matplotlib.use("GTK3Agg")   
codebook, distortion = runClustering(durations)
syscallNameIndex, syscallName, durationData = prepareScatterPlot(syscallNameCount, codebook, syscallNameList)
showPlot(syscallNameDistinct, syscallNameCount, durations, syscallNameList)
printStatistics()
pyplot.show()

