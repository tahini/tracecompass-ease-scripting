/*  The MIT License (MIT)
 *
 * Copyright (c) 2020 Geneviève Bastien <gbastien@versatic.net>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * This script makes an XY chart for each event. In each chart, the values of all 
 * its numeric fields are plotted.
 * 
 * Careful: don't run in on traces with 1000 of different events or you'll get
 * thousands of views!
 */

// Load the appropriate Trace Compass modules
loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/Trace');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');


// Create an analysis to save the field values
var trace = getActiveTrace();
if (trace == null) {
	print("Please open a trace first");
	exit();
}
var analysis = createScriptedAnalysis(trace, "scriptedEventFields.js")

// Get the analysis's state system so we can fill it, false indicates to create a new state system even if one already exists, true would re-use an existing state system
var ss = analysis.getStateSystem(false);

function saveEventFieldValue(event, fieldName, value) {
	// Write value to the state system, under the event -> field
	quark = ss.getQuarkAbsoluteAndAdd(event.getName(), fieldName);
	// modify the value
	ss.modifyAttribute(event.getTimestamp().toNanos(), value, quark);
}

// The analysis itself is in this function
function runAnalysis() {
	// Get the event iterator for the trace
	var iter = analysis.getEventIterator();
	
	var event = null;
	// Parse all events
	while (iter.hasNext()) {
		event = iter.next();
		
		// For each field with a numeric value, update the state system
		fields = event.getContent().getFields()
		fieldIter = fields.iterator()
		while (fieldIter.hasNext()) {
			field = fieldIter.next();
			longValue = field.getFieldValue(java.lang.Long.class)
			if (longValue != null) {
				saveEventFieldValue(event, field.getName(), longValue);
			}
		}
		
	}
	// Done parsing the events, close the state system at the time of the last event, it needs to be done manually otherwise the state system will still be waiting for values and will not be considered finished building
	if (event != null) {
		ss.closeHistory(event.getTimestamp().toNanos());
	}
}

// This condition verifies if the state system is completed. For instance, if it had been built in a previous run of the script, it wouldn't run again.
if (!ss.waitUntilBuilt(0)) {
	// State system not built, run the analysis
	runAnalysis();
}

// For each top level quark (event name), make a view of its event fields
quarks = ss.getQuarks("*")
quarkIter = quarks.iterator()
i = 0
while (quarkIter.hasNext()) {
	quark = quarkIter.next()
	var map = new java.util.HashMap();
	map.put("path", ss.getAttributeName(quark) + '/*');
	
	// create a XY data provider
	var provider = createXYProvider(analysis, map, "test" + ss.getAttributeName(quark));

	// Open an XY chart with this data provider
	if (provider != null) {
		  openXYChartView(provider);
	}
	i++
	if (i > 10) {
		print("You have more than 10 events! That's a lot of views to open! If that's really what you want to do, edit the script and remove this if here, otherwise that's where we stop.")
		break;
	}
}
