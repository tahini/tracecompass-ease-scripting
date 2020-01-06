/**
 * Copyright 2019 Geneviève Bastien
 * Copyright 2019 École Polytechnique de Montréal
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * This script does the differential weighted tree of the glxgears-cyg-profile 
 * and glxgears-cyg-profile-fast traces from the 
 * https://git.eclipse.org/c/tracecompass/tracecompass-test-traces.git/ repo. 
 * Because the elements from both traces are not the same, they are grouped at 
 * the top level so that the elements can be matched between traces.
 *
 * It then displays the result in a differential flame graph 
 */

loadModule("/TraceCompass/Callstack");
loadModule("/TraceCompass/Trace");
loadModule("/TraceCompass/TraceUI");
loadModule("/TraceCompass/Analysis");
loadModule("/TraceCompass/CallstackUI");

// Specify the project and trace path of both traces
var projectName = "test traces"
var trace1Path = "cyg-profile/glxgears-cyg-profile"
var trace2Path = "cyg-profile/glxgears-cyg-profile-fast"

// Open the traces
var trace1 = openTrace(projectName, trace1Path);
if (trace1 == null) {
	print("glxgears trace is null");
	exit();
}

var trace2 = openTrace(projectName, trace2Path);
if (trace2 == null) {
	print("glxgears-fast trace is null");
	exit();
}

// Get the lttng-ust analyses for both traces
var analysis1 = getTraceAnalysis(trace1, "org.eclipse.tracecompass.incubator.callstack.core.lttng.ust");
if (analysis1 == null) {
	print("Analysis for trace1 not found");
	exit();
}

var analysis2 = getTraceAnalysis(trace2, "org.eclipse.tracecompass.incubator.callstack.core.lttng.ust");
if (analysis2 == null) {
	print("Analysis for trace2 not found");
	exit();
}

// Group the callgraphs at the top level so the elements can be matched between traces
callgraph1 = groupTreesBy(analysis1, 0);
callgraph2 = groupTreesBy(analysis2, 0);

if (callgraph1 == null || callgraph2 == null) {
	print("One of the callgraph is null");
	exit();
}

// Get the differential weighted tree from both callgraphs
var diffTree = diffTreeSets(analysis1, callgraph1, callgraph2);

// Get a flame graph data provider and open the differential flame graph
var fgProvider = getFlameGraphDataProvider(trace2, diffTree, "diffCygProfile");
if (fgProvider != null) {
	openFlameGraphView(fgProvider);
}

