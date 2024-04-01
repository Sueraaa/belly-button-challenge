const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Print all data in console
// Fetch the JSON data and console log it
d3.json(url).then(function(data){
    console.log(data)
});


//Print Top 10 OTUs in console
// Custom function to return top 10 OTUs found in an individual '940'
function getTop10OTUs(individualId) {
    return d3.json(url).then(function(data) {
        // Find the individual's data
        const individualData = data.samples.find(sample => sample.id === "940");
        // Extract top 10 OTUs
        const top10OTUs = {
            sampleValues: individualData.sample_values.slice(0, 10),
            otuIds: individualData.otu_ids.slice(0, 10),
            otuLabels: individualData.otu_labels.slice(0, 10)
        };
        return top10OTUs;
    });
}

// Call the custom function and log the result
getTop10OTUs("940").then(function(top10OTUs) {
    console.log("Top 10 OTUs found in individual 940:");
    console.log(top10OTUs);
});


//Create a bubble chart 
//Fetch the JSON data and initialize the charts
d3.json(url).then(function(data) {
    // Call the custom function to get top 10 OTUs for individual "940"
    getTop10OTUs("940").then(function(top10OTUs) {
        
        // Filter samples data to include only the individual with ID "940"
        const individualData = data.samples.find(sample => sample.id === "940");
  
        // Define trace for the bubble chart using data for individual "940"
        let trace = {
            x: individualData.otu_ids,
            y: individualData.sample_values,
            mode: 'markers',
            marker: {
                size: individualData.sample_values,
                color: individualData.otu_ids,
                colorscale: 'Viridis',
                opacity: 0.7
            }
        };
  
        // Define layout for the bubble chart
        let layout = {
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };
  
        // Create data array
        let dataTrace = [trace];
  
        // Plot to the div tag with id "bubbleChart"
        Plotly.newPlot('bubbleChart', dataTrace, layout);
    });
  });


// Create a bar chart 
// Function to update the bar chart
function updateBarChart(top10OTUs) {
    // Trace for the bar chart
    let trace1 = {
        x: top10OTUs.sampleValues.reverse(),
        y: top10OTUs.otuIds.map(id => `OTU ${id}`).reverse(),
        type: "bar",
        orientation: "h"
    };

    // Data trace array
    let dataTrace = [trace1];

    // Apply a title to the layout
    let layout = {
        xaxis: {
            title: "Sample Values"
        },
        yaxis: {
            title: "OTU IDs"
        }
    };

    // Plot to the div tag with 'plot'
    Plotly.newPlot('plot', dataTrace, layout);
}

// Function to initialize the dropdown menu
function init() {
    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data
    d3.json(url).then(function(data) {
        // Get the IDs of all individuals
        let ids = data.samples.map(sample => sample.id);

        // Add each ID as an option in the dropdown menu
        ids.forEach(id => {
            dropdownMenu.append("option")
                .attr("value", id)
                .text(id);
        });
    });
}


// Demographic Info 
// Function called by DOM changes
function getData() {
    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdownMenu.property("value");

    // Fetch the JSON data
    d3.json(url).then(function(data) {
        // Update the bar chart based on the selected ID
        getTop10OTUs(dataset).then(function(top10OTUs) {
            updateBarChart(top10OTUs);
        });

        // Select the HTML element 
        const metadataDisplay = d3.select("#sample-metadata");

         // Clear existing content before appending new metadata
         metadataDisplay.html("");

        // Find the metadata for the selected individual
        let metadata = data.metadata.find(item => item.id === parseInt(dataset));

        // Iterate over each key-value pair in the metadata object
        Object.entries(metadata).forEach(([key, value]) => {
            // Append the key-value pair to the metadata display area
            metadataDisplay.append("p").text(`${key}: ${value}`);
        });
    });
};


// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", getData);

// Call init function to initialize the dropdown menu
init();







