################################################################################
# Copyright (c) 2019 Geneviève Bastien
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html
#
# scriptedDataProvider.py
################################################################################

# load proper Trace Compass modules
loadModule('/TraceCompass/Analysis')
loadModule('/TraceCompass/View')
loadModule('/TraceCompass/DataProvider')
loadModule('/TraceCompass/Utils')

from py4j.java_gateway import JavaClass, JavaGateway
import time

# Create an analysis for this script
analysis = getAnalysis("activetid_python.js")

if analysis is None:
    exit()

# Get the analysis's state system so we can fill it, true indicates to re-use an existing state system, false would create a new state system even if one already exists
ss = analysis.getStateSystem(False)

# The state system methods require a vararg array. This puts the string in a vararg array to call those methods
def strToVarargs(str):
    object_class = java.lang.String
    object_array = gateway.new_array(object_class, 1)
    object_array[0] = str
    return object_array

arrows = []

# The analysis itself is in this function
def runAnalysis():
    # Get the event iterator for the trace
    iter = analysis.getEventIterator()
    event = None
    
    # Associate a TID with an mpi resource
    tidToResMap = {}
    # Save information on the pending arrows
    pendingArrows = {}
    
    # Parse all events
    while iter.hasNext():
       
        if not(event is None):
        	gateway.detach(event);
        event = iter.next();
       
        name = event.getName()
        # Do something when the event is a sched_switch
        if name == "mpi:mpi_init_exit":
            # This function is a wrapper to get the value of fields res and tid in the event
            resourceId = getFieldValue(event, "res")
            tid = getFieldValue(event, "tid")
            if (not(resourceId is None) and not(tid is None)):
                # Save the association between tid and resource
                tidToResMap[tid] = resourceId
        elif name == "mpi:mpi_recv_entry":
            # First get the current resource from its tid
            tid = getFieldValue(event, "tid")
            if (not(tid is None)):
                resourceId = tidToResMap[tid]
                if (not(resourceId is None)):
                    # Save the state of the resource as waiting for reception
                    quark = ss.getQuarkAbsoluteAndAdd(strToVarargs(str(resourceId)))
                    ss.modifyAttribute(event.getTimestamp().toNanos(), "Waiting for reception", quark)
        elif name == "mpi:mpi_recv_exit":
            tid = getFieldValue(event, "tid");
            if not tid is None:
                resourceId = tidToResMap[tid];
                if not resourceId is None:
                    # Close the receiving state of the resource
                    quark = ss.getQuarkAbsoluteAndAdd(strToVarargs(str(resourceId)));
                    ss.removeAttribute(event.getTimestamp().toNanos(), quark);
                
                # We received a message, see if we can close a pending arrow
                source = getFieldValue(event, "source");
                
                if not source is None:
                    pending = pendingArrows[resourceId]
                    if not pending is None:
                        # There is a pending arrow (ie send) for this message
                        pendingArrows[resourceId] = None;
                        pending["endTime"] = event.getTimestamp().toNanos();
                        arrows.append(pending);
        elif name == "mpi:mpi_send_entry":
            # First get the current resource from its tid
            tid = getFieldValue(event, "tid")
            if (not(tid is None)):
                resourceId = tidToResMap[tid]
                if (not(resourceId is None)):
                    # Save the state of the resource as waiting for reception
                    quark = ss.getQuarkAbsoluteAndAdd(strToVarargs(str(resourceId)))
                    ss.modifyAttribute(event.getTimestamp().toNanos(), "Sending message", quark)
                dest = getFieldValue(event, "dest")
                if not dest is None:
                    pendingArrows[dest] = {"time" : event.getTimestamp().toNanos(), "source" : resourceId, "dest" : dest }
        elif name == "mpi:mpi_send_exit":
            tid = getFieldValue(event, "tid");
            if not tid is None:
                resourceId = tidToResMap[tid];
                if not resourceId is None:
                    # Close the receiving state of the resource
                    quark = ss.getQuarkAbsoluteAndAdd(strToVarargs(str(resourceId)));
                    ss.removeAttribute(event.getTimestamp().toNanos(), quark);
        
    # Done parsing the events, close the state system at the time of the last event, it needs to be done manually otherwise the state system will still be waiting for values and will not be considered finished building
    if not(event is None):
        ss.closeHistory(event.getTimestamp().toNanos())
    gateway.detach(iter)

# This condition verifies if the state system is completed. For instance, if it had been built in a previous run of the script, it wouldn't run again.
if not(ss.waitUntilBuilt(0)):
    # State system not built, run the analysis
    runAnalysis()

# Get list wrappers from Trace Compass for the entries and arrows. The conversion between javascript list and java list is not direct, so we need a wrapper
tgEntries = createListWrapper();
tgArrows = createListWrapper();

def prepareTimeGraph():
    mpiResToId = {}
    
    quarks = ss.getQuarks(strToVarargs("*"))
    mpiEntries = []
    for quark in quarks:
        mpiEntries.append(ss.getAttributeName(quark))
    
    entries = []
    for mpiResId in mpiEntries:
        quark = ss.getQuarkAbsolute(strToVarargs(str(mpiResId)))
        entry = createEntry(mpiResId, {"quark" : quark})
        tgEntries.getList().add(entry)
        mpiResToId[mpiResId] = entry.getId();
    for arrow in arrows:
        # For each arrow, we get the source and destination entry ID from its mpi resource ID
        srcId = mpiResToId[str(arrow["source"])]
        destId = mpiResToId[str(arrow["dest"])]
        # Get the start time and calculate the duration
        startTime = arrow["time"]
        duration = arrow["endTime"] - startTime
        # Add the arrow to the arrows list
        tgArrows.getList().add(createArrow(srcId, destId, startTime, duration, 1));
    
class EntryFunction(object):
    def apply(self, parameters):
        return tgEntries.getList();
    
    class Java:
        implements = ['java.util.function.Function']
        
class ArrowFunction(object):
    def apply(self, parameters):
        return tgArrows.getList();
    
    class Java:
        implements = ['java.util.function.Function']

prepareTimeGraph()
# Get a time graph provider from this analysis, displaying all attributes (which are the cpus here)
entryFunction = EntryFunction()
arrowFunction = ArrowFunction()
provider = createScriptedTimeGraphProvider(analysis, entryFunction, None, arrowFunction);
if not(provider is None):
    # Open a time graph view displaying this provider
    openTimeGraphView(provider)

# Hack, because the callbacks for the time graph require an active connection, we cannot let the script terminate
# To stop the script, one needs to go to the Progress view, click on the down arrow (top, right) to select Preferences
# then check the "Show sleeping and systems operations" and cancel the Python (Py4J) job
monitor = getScriptEngine().getMonitor()
while not monitor.isCanceled():
    time.sleep(5)
