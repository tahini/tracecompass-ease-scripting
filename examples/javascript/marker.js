/*******************************************************************************
 * Copyright (c) 2020 Gabriel-Andrew Pollo-Guilbert
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * markers.js
 *******************************************************************************/

loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');
loadModule('/TraceCompass/Trace');
loadModule('/TraceCompass/TraceMarker');

var trace = getActiveTrace();
if (trace == null) {
    print("Trace is null");
    exit();
}

var analysis = getAnalysis("events.js");
if (analysis == null) {
	print("Trace is null");
	exit();
}

/* basic state system analysis based on sched_switch events */
var stateSystem = analysis.getStateSystem(false);
function updateStateSystem(event) {
	cpu = getFieldValue(event, "CPU");
	tid = getFieldValue(event, "next_tid");
	
	if ((cpu != null) && (tid != null)) {
		quark = stateSystem.getQuarkAbsoluteAndAdd(cpu);
		stateSystem.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
	}
}

/* marker region containing the most sched_switch events */
var most_events = [];
var most_start = null;
var most_end = null;
var most_count = null;
function updateMostEventful(event, duration) {
	most_events.push(event);
	
	while (most_events.length > 0) {
		var start = most_events[0].getTimestamp().toNanos();
		var end = event.getTimestamp().toNanos();
		
		if (end - start > duration) {
			most_events.shift();
		} else {
			break;
		}
	}
	
	if (most_count == null || most_count < most_events.length) {
		most_count = most_events.length;
		most_start = most_events[0].getTimestamp().toNanos();
		most_end = most_events[most_events.length - 1].getTimestamp().toNanos();
	}
}

/* iterate through all events for analysis */
function runAnalysis(duration) {
	var iterator = analysis.getEventIterator();
	
	var event = null;
	while (iterator.hasNext()) {
		event = iterator.next();
		
		if (event.getName() == "sched_switch") {
			updateStateSystem(event);
			updateMostEventful(event, duration);
		}
	}
	
	if (event != null) {
		stateSystem.closeHistory(event.getTimestamp().toNanos());
	}
}

/* run analysis and show results */
if (!stateSystem.waitUntilBuilt(0)) {
	runAnalysis(5e6);
	addTraceMarker(trace, most_start, most_end, "" + most_count + " events", "most sched_switch in 5ms");
}

var map = new java.util.HashMap();
map.put(ENTRY_PATH, '*');
provider = createTimeGraphProvider(analysis, map);
if (provider != null) {
	openTimeGraphView(provider);
}


