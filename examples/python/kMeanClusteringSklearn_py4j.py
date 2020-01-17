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
from sklearn.cluster import MiniBatchKMeans
import numpy
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
nameCountStr = getSharedObject("syscallNameCount")
nameListStr = getSharedObject("syscallNameList")
durationsStr = getSharedObject("durations")

if nameCountStr is None or nameListStr is None or durationsStr is None:
	print("This script should be called from a companion script who will set shared object for it to use. It should not be run directly")
	exit()

syscallNameCount = json.loads(nameCountStr)
syscallNameList = json.loads(nameListStr)
durations = json.loads(durationsStr)

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

# Use GTK3Agg as it is known to work. qt5 gives errors
matplotlib.use("GTK3Agg")   
prediction = runClustering(durations)
showPlot(prediction, syscallNameCount, syscallNameList, durations)
pyplot.show()

