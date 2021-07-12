// Create function to build metadata
function buildMetadata(sample) {
 console.log(sample)

  // Get data from json file
  d3.json("data/samples.json").then(data => {

    // Assign all objects in metadata array to a variable
    var metadata = data.metadata;
    console.log(metadata)

    // Filter samples to resultArray to return value in an array of information
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)
    
    // Assign result to variable to get just the array of information
    var result = resultArray[0]

    // Assign select statement to Demographic Info box
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");

    // Iterate through objects in result
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
   
    });
  })
}


// Create function to build charts
function buildCharts(sample) {
  // console.log(sample)

  // Get data from json file
  d3.json("data/samples.json").then(data => {

    // Assign samples array to a variable
    var samples = data.samples;

    // Filter samples to resultArray to return value in an array of information
    var resultArray = samples.filter(sampleObj => sampleObj.id === sample)

    // Assign result to variable to get just the array of information
    var result = resultArray[0]

    // Assign OTU ids (pull out of result array)
    var otu_ids = result.otu_ids;

    // Assign OTU labels (pull out of result array)
    var otu_labels = result.otu_labels;

    // Assign sample values (pull out of result array)
    var sample_values = result.sample_values;

    // Create variable to include "OTU" on y-labels
    // Slice to return only Top 10 OTUs
    // Reverse arrays so the largest value is on top in the chart
    yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse()

    // Create the data for the bar chart
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ]

    // Render the plot
    Plotly.newPlot("bar", barData)

    // Build bubble chart

    // Create layout for bubble chart
    var bubblelayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    // Create the data for the bubble chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
    ];

    // Render the plot
    Plotly.newPlot("bubble", bubbleData, bubblelayout)


    console.log(result)

  })
}

// Create function to fill in first chart
function init() {

  // Define selector variable
  var selector = d3.select("#selDataset");

  // Get data from json file
  d3.json("data/samples.json").then(data => {

    // Define sample names
    var sampleNames = data.names;

    // Assign each sample number to property tag
    sampleNames.forEach(sample => {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);
    })

    // Test just one sample
    var firstSample = sampleNames[0]

    // console.log(sampleNames)

    // Build bar chart
    buildCharts(firstSample);
    buildMetadata(firstSample);
  })

}

// // Create On Change function for dropdown selection
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();