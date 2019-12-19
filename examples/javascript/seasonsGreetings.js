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
 * To run this script, open the trace boundaryTrace.btf trace available from the 
 * tracecompass-ease-scripting github repo, which is a btf trace with 2 events, 
 * to set boundaries to the trace.
 * 
 * The trace is a text file, so it is easy to modify it to set smaller or longer
 * traces for smaller or longer texts.
 * 
 * Feel free to contribute the missing letters in the script!
 */

loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/Trace');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');

// Create an analysis named activetid.js.
var trace = getActiveTrace()
if (trace == null) {
	print("Trace is null");
	exit();
}
var analysis = createScriptedAnalysis(trace, "myanalysis.js");

if (analysis == null) {
	print("Analysis is null");
	exit();
}

// Get the analysis's state system so we can fill it
var ss = analysis.getStateSystem(false);

// Prepare quarks of the state system
baseQuark = ss.getQuarkAbsoluteAndAdd("tg")
q1 = ss.getQuarkRelativeAndAdd(baseQuark, "1")
q2 = ss.getQuarkRelativeAndAdd(baseQuark, "2")
q3 = ss.getQuarkRelativeAndAdd(baseQuark, "3")
q4 = ss.getQuarkRelativeAndAdd(baseQuark, "4")
q5 = ss.getQuarkRelativeAndAdd(baseQuark, "5")
q6 = ss.getQuarkRelativeAndAdd(baseQuark, "6")
q7 = ss.getQuarkRelativeAndAdd(baseQuark, "7")
q8 = ss.getQuarkRelativeAndAdd(baseQuark, "8")
q9 = ss.getQuarkRelativeAndAdd(baseQuark, "9")
q10 = ss.getQuarkRelativeAndAdd(baseQuark, "10")

/**
 * Functions to save each letter's data to state system.
 * 
 * @param start
 *            All function take a start time as parameter
 * @returns Returns the length of the letter, so the offset can be incremented
 *          by this value
 */ 
function saveA(start) {
	value = 1
	ss.modifyAttribute(start+5, value, q1);
	ss.removeAttribute(start+7, q1);
	ss.modifyAttribute(start+4, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+3, value, q3);
	ss.removeAttribute(start+5, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+2, value, q4);
	ss.removeAttribute(start+4, q4);
	ss.modifyAttribute(start+8, value, q4);
	ss.removeAttribute(start+10, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+9, value, q5);
	ss.removeAttribute(start+11, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+11, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+11, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+9, value, q8);
	ss.removeAttribute(start+11, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+9, value, q9);
	ss.removeAttribute(start+11, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	ss.modifyAttribute(start+9, value, q10);
	ss.removeAttribute(start+11, q10);
	return 11
}

function saveC(start) {
	value = 3
	ss.modifyAttribute(start+3, value, q1);
	ss.removeAttribute(start+7, q1);
	ss.modifyAttribute(start+2, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+2, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+3, value, q10);
	ss.removeAttribute(start+7, q10);
	return 9
}

function saveD(start) {
	value = 4
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+7, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+7, value, q5);
	ss.removeAttribute(start+9, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+7, value, q6);
	ss.removeAttribute(start+9, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+7, value, q7);
	ss.removeAttribute(start+9, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+7, q10);
	return 9
}


function saveE(start) {
	value = 5
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+9, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+9, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+9, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+9, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+9, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+9, q10);
	return 9
}

function saveG(start) {
	value = 7
	ss.modifyAttribute(start+3, value, q1);
	ss.removeAttribute(start+7, q1);
	ss.modifyAttribute(start+2, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+5, value, q5);
	ss.removeAttribute(start+8, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+5, value, q6);
	ss.removeAttribute(start+9, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+5, value, q7);
	ss.removeAttribute(start+6, q7);
	ss.modifyAttribute(start+7, value, q7);
	ss.removeAttribute(start+9, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+2, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+3, value, q10);
	ss.removeAttribute(start+7, q10);	
	return 9
}

function saveH(start) {
	value = 8
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+3, q1);
	ss.modifyAttribute(start+7, value, q1);
	ss.removeAttribute(start+9, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+3, q2);
	ss.modifyAttribute(start+7, value, q2);
	ss.removeAttribute(start+9, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+9, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+9, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+7, value, q7);
	ss.removeAttribute(start+9, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+7, value, q9);
	ss.removeAttribute(start+9, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	ss.modifyAttribute(start+7, value, q10);
	ss.removeAttribute(start+9, q10);
	return 9
}

function saveI(start) {
	value = 9
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+5, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+5, q2);
	ss.modifyAttribute(start+2, value, q3);
	ss.removeAttribute(start+4, q3);
	ss.modifyAttribute(start+2, value, q4);
	ss.removeAttribute(start+4, q4);
	ss.modifyAttribute(start+2, value, q5);
	ss.removeAttribute(start+4, q5);
	ss.modifyAttribute(start+2, value, q6);
	ss.removeAttribute(start+4, q6);
	ss.modifyAttribute(start+2, value, q7);
	ss.removeAttribute(start+4, q7);
	ss.modifyAttribute(start+2, value, q8);
	ss.removeAttribute(start+4, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+5, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+5, q10);
	return 5
}

function saveK(start) {
	value = 11
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+3, q1);
	ss.modifyAttribute(start+7, value, q1);
	ss.removeAttribute(start+9, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+3, q2);
	ss.modifyAttribute(start+6, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+5, value, q3);
	ss.removeAttribute(start+7, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+4, value, q4);
	ss.removeAttribute(start+6, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+5, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+5, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+4, value, q7);
	ss.removeAttribute(start+6, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+5, value, q8);
	ss.removeAttribute(start+7, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+6, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	ss.modifyAttribute(start+7, value, q10);
	ss.removeAttribute(start+9, q10);
	return 9
}

function saveL(start) {
	value = 12
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+3, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+3, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+9, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+9, q10);
	return 9
}

function saveM(start) {
	value = 13
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+4, q1);
	ss.modifyAttribute(start+10, value, q1);
	ss.removeAttribute(start+13, q1);
	
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+5, q2);
	ss.modifyAttribute(start+9, value, q2);
	ss.removeAttribute(start+13, q2);
	
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+4, value, q3);
	ss.removeAttribute(start+6, q3);
	ss.modifyAttribute(start+8, value, q3);
	ss.removeAttribute(start+10, q3);
	ss.modifyAttribute(start+11, value, q3);
	ss.removeAttribute(start+13, q3);
	
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+5, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+11, value, q4);
	ss.removeAttribute(start+13, q4);
	
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+6, value, q5);
	ss.removeAttribute(start+8, q5);
	ss.modifyAttribute(start+11, value, q5);
	ss.removeAttribute(start+13, q5);
	
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+11, value, q6);
	ss.removeAttribute(start+13, q6);
	
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+11, value, q7);
	ss.removeAttribute(start+13, q7);
	
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+11, value, q8);
	ss.removeAttribute(start+13, q8);
	
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+11, value, q9);
	ss.removeAttribute(start+13, q9);
	
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	ss.modifyAttribute(start+11, value, q10);
	ss.removeAttribute(start+13, q10);	
	return 13
}

function saveN(start) {
	value = 14
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+4, q1);
	ss.modifyAttribute(start+7, value, q1);
	ss.removeAttribute(start+9, q1);
	
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+5, q2);
	ss.modifyAttribute(start+7, value, q2);
	ss.removeAttribute(start+9, q2);
	
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+4, value, q3);
	ss.removeAttribute(start+5, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+4, value, q4);
	ss.removeAttribute(start+5, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+4, value, q5);
	ss.removeAttribute(start+6, q5);
	ss.modifyAttribute(start+7, value, q5);
	ss.removeAttribute(start+9, q5);
	
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+5, value, q6);
	ss.removeAttribute(start+6, q6);
	ss.modifyAttribute(start+7, value, q6);
	ss.removeAttribute(start+9, q6);
	
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+5, value, q7);
	ss.removeAttribute(start+6, q7);
	ss.modifyAttribute(start+7, value, q7);
	ss.removeAttribute(start+9, q7);
	
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+5, value, q8);
	ss.removeAttribute(start+6, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+5, value, q9);
	ss.removeAttribute(start+9, q9);
	
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	ss.modifyAttribute(start+6, value, q10);
	ss.removeAttribute(start+9, q10);	
	return 9
}

function saveO(start) {
	value = 15
	ss.modifyAttribute(start+3, value, q1);
	ss.removeAttribute(start+7, q1);
	ss.modifyAttribute(start+2, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+7, value, q5);
	ss.removeAttribute(start+9, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+7, value, q6);
	ss.removeAttribute(start+9, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+7, value, q7);
	ss.removeAttribute(start+9, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+2, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+3, value, q10);
	ss.removeAttribute(start+7, q10);
	return 9
}

function saveP(start) {
	value = 16
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+6, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+7, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+6, value, q3);
	ss.removeAttribute(start+8, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+6, value, q5);
	ss.removeAttribute(start+8, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+6, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+4, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	return 9
}

function saveR(start) {
	value = 18
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+6, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+7, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+6, value, q3);
	ss.removeAttribute(start+8, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+6, value, q5);
	ss.removeAttribute(start+8, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+6, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+6, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+5, value, q8);
	ss.removeAttribute(start+7, q8);
	ss.modifyAttribute(start+1, value, q9);
	ss.removeAttribute(start+3, q9);
	ss.modifyAttribute(start+6, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+1, value, q10);
	ss.removeAttribute(start+3, q10);
	ss.modifyAttribute(start+7, value, q10);
	ss.removeAttribute(start+9, q10);
	return 9
}

function saveS(start) {
	value = 19
	ss.modifyAttribute(start+3, value, q1);
	ss.removeAttribute(start+7, q1);
	ss.modifyAttribute(start+2, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+2, value, q4);
	ss.removeAttribute(start+4, q4);
	
	ss.modifyAttribute(start+3, value, q5);
	ss.removeAttribute(start+5, q5);
	ss.modifyAttribute(start+4, value, q6);
	ss.removeAttribute(start+6, q6);
	
	ss.modifyAttribute(start+6, value, q7);
	ss.removeAttribute(start+8, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+2, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+3, value, q10);
	ss.removeAttribute(start+7, q10);
	return 9
}

function saveT(start) {
	value = 20
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+8, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+8, q2);
	ss.modifyAttribute(start+4, value, q3);
	ss.removeAttribute(start+6, q3);
	ss.modifyAttribute(start+4, value, q4);
	ss.removeAttribute(start+6, q4);
	ss.modifyAttribute(start+4, value, q5);
	ss.removeAttribute(start+6, q5);
	ss.modifyAttribute(start+4, value, q6);
	ss.removeAttribute(start+6, q6);
	ss.modifyAttribute(start+4, value, q7);
	ss.removeAttribute(start+6, q7);
	ss.modifyAttribute(start+4, value, q8);
	ss.removeAttribute(start+6, q8);
	ss.modifyAttribute(start+4, value, q9);
	ss.removeAttribute(start+6, q9);
	ss.modifyAttribute(start+4, value, q10);
	ss.removeAttribute(start+6, q10);
	return 8
}

function saveU(start) {
	value = 21
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+3, q1);
	ss.modifyAttribute(start+7, value, q1);
	ss.removeAttribute(start+9, q1);
	ss.modifyAttribute(start+1, value, q2);
	ss.removeAttribute(start+3, q2);
	ss.modifyAttribute(start+7, value, q2);
	ss.removeAttribute(start+9, q2);
	ss.modifyAttribute(start+1, value, q3);
	ss.removeAttribute(start+3, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+1, value, q4);
	ss.removeAttribute(start+3, q4);
	ss.modifyAttribute(start+7, value, q4);
	ss.removeAttribute(start+9, q4);
	ss.modifyAttribute(start+1, value, q5);
	ss.removeAttribute(start+3, q5);
	ss.modifyAttribute(start+7, value, q5);
	ss.removeAttribute(start+9, q5);
	ss.modifyAttribute(start+1, value, q6);
	ss.removeAttribute(start+3, q6);
	ss.modifyAttribute(start+7, value, q6);
	ss.removeAttribute(start+9, q6);
	ss.modifyAttribute(start+1, value, q7);
	ss.removeAttribute(start+3, q7);
	ss.modifyAttribute(start+7, value, q7);
	ss.removeAttribute(start+9, q7);
	ss.modifyAttribute(start+1, value, q8);
	ss.removeAttribute(start+3, q8);
	ss.modifyAttribute(start+7, value, q8);
	ss.removeAttribute(start+9, q8);
	ss.modifyAttribute(start+2, value, q9);
	ss.removeAttribute(start+8, q9);
	ss.modifyAttribute(start+3, value, q10);
	ss.removeAttribute(start+7, q10);
	return 9
}

function saveY(start) {
	value = 25
	ss.modifyAttribute(start+1, value, q1);
	ss.removeAttribute(start+3, q1);
	ss.modifyAttribute(start+9, value, q1);
	ss.removeAttribute(start+11, q1);
	ss.modifyAttribute(start+2, value, q2);
	ss.removeAttribute(start+4, q2);
	ss.modifyAttribute(start+8, value, q2);
	ss.removeAttribute(start+10, q2);
	ss.modifyAttribute(start+3, value, q3);
	ss.removeAttribute(start+5, q3);
	ss.modifyAttribute(start+7, value, q3);
	ss.removeAttribute(start+9, q3);
	ss.modifyAttribute(start+4, value, q4);
	ss.removeAttribute(start+8, q4);
	ss.modifyAttribute(start+5, value, q5);
	ss.removeAttribute(start+7, q5);
	ss.modifyAttribute(start+5, value, q6);
	ss.removeAttribute(start+7, q6);
	ss.modifyAttribute(start+5, value, q7);
	ss.removeAttribute(start+7, q7);
	ss.modifyAttribute(start+5, value, q8);
	ss.removeAttribute(start+7, q8);
	ss.modifyAttribute(start+5, value, q9);
	ss.removeAttribute(start+7, q9);
	ss.modifyAttribute(start+5, value, q10);
	ss.removeAttribute(start+7, q10);
	return 11
}

// Print the message. Start at the beginning of the trace + 2
start = trace.getStartTime().toNanos() + 2

offset = start + saveH(start)
offset = offset + 1 + saveA(offset + 1)
offset = offset + 1 + saveP(offset + 1)
offset = offset + 1 + saveP(offset + 1)
offset = offset + 1 + saveY(offset + 1)

offset = offset + 6 + saveH(offset + 6)
offset = offset + 1 + saveO(offset + 1)
offset = offset + 1 + saveL(offset + 1)
offset = offset + 1 + saveI(offset + 1)
offset = offset + 1 + saveD(offset + 1)
offset = offset + 1 + saveA(offset + 1)
offset = offset + 1 + saveY(offset + 1)
offset = offset + 1 + saveS(offset + 1)

// Draw a christmas tree
function drawTree(start) {
	green = 60
	red = 61
	blue = 62
	ribbon = 63
	brown = 64
	ss.modifyAttribute(start+8, green, q1);
	ss.removeAttribute(start+9, q1);
	ss.modifyAttribute(start+7, green, q2);
	ss.modifyAttribute(start+8, ribbon, q2);
	ss.removeAttribute(start+10, q2);
	ss.modifyAttribute(start+6, ribbon, q3);
	ss.modifyAttribute(start+8, green, q3);
	ss.modifyAttribute(start+10, red, q3);
	ss.removeAttribute(start+11, q3);
	ss.modifyAttribute(start+5, green, q4);
	ss.modifyAttribute(start+6, blue, q4);
	ss.modifyAttribute(start+7, green, q4);
	ss.modifyAttribute(start+9, ribbon, q4);
	ss.modifyAttribute(start+11, green, q4);
	ss.removeAttribute(start+12, q4);
	ss.modifyAttribute(start+4, green, q5);
	ss.modifyAttribute(start+5, red, q5);
	ss.modifyAttribute(start+6, green, q5);
	ss.modifyAttribute(start+7, ribbon, q5);
	ss.modifyAttribute(start+9, green, q5);
	ss.modifyAttribute(start+11, ribbon, q5);
	ss.modifyAttribute(start+12, green, q5);
	ss.removeAttribute(start+13, q5);
	ss.modifyAttribute(start+3, green, q6);
	ss.modifyAttribute(start+5, ribbon, q6);
	ss.modifyAttribute(start+7, green, q6);
	ss.modifyAttribute(start+11, red, q6);
	ss.modifyAttribute(start+12, green, q6);
	ss.removeAttribute(start+14, q6);
	ss.modifyAttribute(start+2, green, q7);
	ss.modifyAttribute(start+3, ribbon, q7);
	ss.modifyAttribute(start+5, green, q7);
	ss.modifyAttribute(start+8, blue, q7);
	ss.modifyAttribute(start+9, green, q7);
	ss.modifyAttribute(start+13, red, q7);
	ss.modifyAttribute(start+14, green, q7);
	ss.removeAttribute(start+15, q7);
	ss.modifyAttribute(start+1, ribbon, q8);
	ss.modifyAttribute(start+3, green, q8);
	ss.modifyAttribute(start+5, red, q8);
	ss.modifyAttribute(start+6, green, q8);
	ss.modifyAttribute(start+11, blue, q8);
	ss.modifyAttribute(start+12, green, q8);
	ss.removeAttribute(start+16, q8);
	ss.modifyAttribute(start+8, brown, q9);
	ss.removeAttribute(start+9, q9);
	ss.modifyAttribute(start+8, brown, q10);
	ss.removeAttribute(start+9, q10);
	return 16
}

// Draw the tree
offset = offset + 5 + drawTree(offset + 5)

// Close state system
ss.closeHistory(offset + 1)

// Get a time graph provider from this analysis, displaying all attributes
provider = createTimeGraphProvider(analysis, {'path' : 'tg/*'});
if (provider != null) {
	// Open a time graph view displaying this provider, colors can be updated with the legend of the view
	openTimeGraphView(provider);
}

