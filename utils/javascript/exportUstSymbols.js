/*******************************************************************************
 * Copyright (c) 2019 Geneviève Bastien, Majid Rezazadeh
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * exportSymbols.js
 *******************************************************************************/

/**
 * This file writes to a file or to the console all symbols met in a LTTng-UST
 * trace. This file can then be imported as a GNU nm's binary symbol mapping
 * file on another computer.
 *
 * This file can be executed by someone who has all the binary files from which
 * this trace was taken on his machine, and can then share the trace, along with
 * the output of this script to other users who don't have the same binaries.
 *
 * Symbols need to be properly configured before running this script, in order to 
 * pick them all up.
 *
 * @param arg1
 *            Name of the file to write to. If not set, it outputs to the
 *            console
 */

// Load the appropriate Trace Compass modules
loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/Trace');

// If a filename argument was given, save the symbols to that file, using Java's file writing
var bufferedWriter = null;
if (argv.length > 0) {
	filename = argv[0]
	// Save the symbols to a file, using Java's file writing
	bufferedWriter = new java.io.BufferedWriter(new java.io.FileWriter(filename));
	print("Exporting symbols to file " + filename)
} else {
	print("Outputting results to Console")
}


// We need an analysis to get the event iterator
var analysis = getAnalysis("symbol.js")
var trace = getActiveTrace();

// Get the symbol providers for this trace
var symbolProviders = org.eclipse.tracecompass.tmf.core.symbols.SymbolProviderManager
		.getInstance().getSymbolProviders(trace);

// Function to resolve the symbols, using directly Trace Compass's API
function getSymbol(addr, pid, ts) {
	return org.eclipse.tracecompass.tmf.core.symbols.SymbolProviderUtils
			.getSymbolText(symbolProviders, pid, ts, addr);
}

// A cache to avoid saving a same symbol more than once
var symbolToValue = {};

// Get the event iterator for the trace
var iter = analysis.getEventIterator();

// Parse all events
var event = null;
while (iter.hasNext()) {
	event = iter.next();

	// Use LTTng-UST's func_entry events to get the addresses to resolve
	if (event.getName().equals("lttng_ust_cyg_profile:func_entry")
			|| event.getName().equals("lttng_ust_cyg_profile_fast:func_entry")) {
		symbol = getFieldValue(event, "addr");
		pid = getFieldValue(event, "PID")
		if (symbol != null && pid != null) {
			// See if the symbol is already resolved
			var resolved = symbolToValue[symbol];
			if (resolved == null) {
				// Resolve the symbol and write to a file, assuming type T
				resolved = getSymbol(symbol, pid, event.getTimestamp()
						.toNanos());
				symbolToValue[symbol] = resolved;
				symbolText = java.lang.String.format("%016x",
						java.lang.Long.valueOf(symbol)) + " T " + resolved
				if (bufferedWriter == null) {
					print(symbolText)
				} else {
					bufferedWriter.write(symbolText);
					bufferedWriter.newLine();
				}
			}
		}
	}
}

if (bufferedWriter != null) {
	bufferedWriter.close();
}
