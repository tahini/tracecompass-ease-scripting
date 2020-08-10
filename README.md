# tracecompass-ease-scripting

This repo contains documentation, examples and utility scripts for the `Trace Compass Scripting` feature. It contains material developed and written by the community, as a complement to what is provided with Trace Compass itself.

Contributions are welcome! Make sure to add the appropriate traces if the example scripts require specific events not easily available, so that users can try the scripts and get actual results.

 - [Content](#content)
 - [References](#references)
   - [Documentation](#documentation)
   - [Community](#community)


## Content

Here's a list of example scripts for Trace Compass. In the [example](examples) folder are example scripts that work with sample traces, but may need to be fine-tuned to one's needs.

In the [utils](utils) directory are utility scripts that can be used as is with the right use case. They may require some parameters to run properly.

### Examples:

 - **examples/javascript/[basicAnalysis.js](examples/javascript/basicAnalysis.js)** and **examples/python/[basicAnalysis.py](examples/python/basicAnalysis.py)**: Works with kernel traces, it does the same thing as the TID analysis, ie save which thread runs on which CPU. It's an example of building a state system and displaying it in a time graph.
 - **examples/javascript/[scriptedDataProvider.js](examples/javascript/scriptedDataProvider.js)** and **examples/python/[scriptedDataProvider.py](examples/python/scriptedDataProvider.py)**: Works with the [mpi_ring traceset](traces/mpi_ring.tgz), shows how to script one's own data provider to display in a time graph view, with arrows.
 - **examples/javascript/[statisticsDensityXY.js](examples/javascript/statisticsDensityXY.js)**: Works with any trace, draws a XY chart of the density of a particular event using the Statistics module.
 - **examples/javascript/[seasonsGreetings.js](examples/javascript/seasonsGreetings.js)**: Because scripting isn't just serious, this script saves letters to a state system and displays them in a time graph. Useful to write message like a Season's Greeting with a Christmas tree! Ideally works with a small trace in nanoseconds like [the boundary btf trace](traces/boundaryTrace.btf).
 - **examples/python/[kMeanClusteringSciPy.py](examples/python/kMeanClusteringSciPy.py)** and **examples/python/[kMeanClusteringSciPy.py](examples/python/kMeanClusteringSklearn.py)**: Works with kernel trace, uses the matplotlib and numpy libraries. **[kMeanClusteringSciPy.py](examples/python/kMeanClusteringSciPy.py)** additionaly uses the scipy library, while **[kMeanClusteringSciPy.py](examples/python/kMeanClusteringSklearn.py)** uses the scikit-learn library.

### Utilities:

 - **utils/javascript/[exportUstSymbols.js](utils/javascript/exportUstSymbols.js)**: Export symbols from LTTng-UST traces of applications instrumented with -finstrument-function. It generates content in the GNU nm's format that can then be imported on any machine to configure symbols correctly for that trace. Symbols needs to be properly configured before running this script.

## References

### Documentation

Here are links to the official documentation of the `Trace Compass Scripting Feature`.

 - [Trace Compass Scripting Documentation and Installation Instructions](https://archive.eclipse.org/tracecompass.incubator/doc/org.eclipse.tracecompass.incubator.scripting.doc.user/User-Guide.html)
 - [Trace Compass Incubator API and Scripting Documentation](https://archive.eclipse.org/tracecompass.incubator/doc/javadoc/apidocs/) 
 - [Trace Compass API](https://archive.eclipse.org/tracecompass/doc/javadoc/apidocs/)

### Community

Here's a list of references, blog posts, etc, produced by the Community.

 - [TraceVizLab](https://github.com/tuxology/tracevizlab) (see lab 204 for some scripting tutorial)
 - [Trace Compass Scripting Benchmarks](http://versatic.net/tracecompass/scriptEngineBenchmarks.html) (blog post)
 - [Trace Compass Scripting: Enpowering Users With Their Trace Data Analysis](http://versatic.net/tracecompass/introducingEase.html) (blog post)
 - [Trace Compass Scripting Demo](http://versatic.net/tracingSummit2019.html) (blog post)
