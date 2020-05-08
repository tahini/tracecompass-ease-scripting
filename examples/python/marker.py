################################################################################
# Copyright (c) 2020 Gabriel-Andrew Pollo-Guilbert
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html
#
# markers.py
################################################################################

from py4j.java_gateway import JavaClass
from py4j.protocol import Py4JError

loadModule('/TraceCompass/Analysis')
loadModule('/TraceCompass/DataProvider')
loadModule('/TraceCompass/View')
loadModule('/TraceCompass/Trace')
loadModule('/TraceCompass/TraceMarker')

trace = getActiveTrace()
if trace is None:
    print("Trace is null")
    exit()

analysis = getAnalysis("events.py")
if analysis is None:
    print("Trace is null")
    exit()

def strToVarargs(str):
    object_class = java.lang.String
    object_array = gateway.new_array(object_class, 1)
    object_array[0] = str
    return object_array

# basic state system analysis based on sched_switch events
stateSystem = analysis.getStateSystem(False)
def updateStateSystem(event):
    cpu = getFieldValue(event, "CPU")
    tid = getFieldValue(event, "next_tid")
    
    if cpu is not None and tid is not None:
        quark = stateSystem.getQuarkAbsoluteAndAdd(strToVarargs(str(cpu)))
        stateSystem.modifyAttribute(event.getTimestamp().toNanos(), str(tid), quark)

# marker region containing the most sched_switch events
most_events = []
most_start = None
most_end = None
most_count = None
def updateMostEventful(event, duration):
    global most_events
    global most_start
    global most_end
    global most_count

    most_events.append(event)
    
    while len(most_events) > 0:
        start = most_events[0].getTimestamp().toNanos()
        end = event.getTimestamp().toNanos()
        
        if end - start > duration:
            most_events = most_events[1:]
        else:
            break
    
    if most_count is None or most_count < len(most_events):
        most_count = len(most_events)
        most_start = most_events[0].getTimestamp().toNanos()
        most_end = most_events[len(most_events) - 1].getTimestamp().toNanos()

# iterate through all events for analysis
def runAnalysis(duration):
    iterator = analysis.getEventIterator()
    event = None
    while iterator.hasNext():
        if event is not None:
            gateway.detach(event)
        event = iterator.next()
        
        if event.getName() == "sched_switch":
            updateStateSystem(event)
            
            # TODO: Py4J throws exceptions sometimes, we ignore them for the time being
            #       event though it causes the Python version to give different results
            #       from the Javascript version
            try:
                updateMostEventful(event, duration)
            except Py4JError:
                pass

    if event is not None:
        stateSystem.closeHistory(event.getTimestamp().toNanos())

# run analysis and show results
if not stateSystem.waitUntilBuilt(0):
    runAnalysis(5e6)
    addTraceMarker(trace, most_start, most_end, "{} events".format(most_count), "most sched_switch in 5ms")
    
provider = createTimeGraphProvider(analysis, {ENTRY_PATH : '*'})
if not(provider is None):
    openTimeGraphView(provider)


