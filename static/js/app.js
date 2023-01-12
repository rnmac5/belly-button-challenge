const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// grab from the drop down selector
function init() {
  let selector = d3.select("#selDataset");
  
  //choose different trials to use on the drop down
  d3.json(url).then(function(data) {
      let trialNames = data.names;
      trialNames.forEach(function(trial)  {
          selector
          .append("option")
          .text(trial)
          .property("value", trial);
      });
  })

  buildMetadata(940);

  buildCharts(940);
};

init();

//grab new data each time a new trial is selected
function optionChanged(newTrial) {
  buildMetadata(newTrial);
  buildCharts(newTrial);
};

//

//demographics panel
function buildMetadata(trial) {
  let DEMO = d3.select("#sample-metadata");
  d3.json(url).then(function(data) {
      let metadata = data.metadata;
      //filter based on the requested sample number
      let resultArray = metadata.filter(sampleObj => sampleObj.id == trial);
      let result = resultArray[0];
      

      DEMO.html("");
      DEMO.append("h6").text("ID: " + result.id);
      DEMO.append("h6").text("ETHNICITY: " + result.ethnicity);
      DEMO.append("h6").text("GENDER: " + result.gender);
      DEMO.append("h6").text("AGE: " + result.age);
      DEMO.append("h6").text("LOCATION: " + result.location);
      DEMO.append("h6").text("BBTYPE: " + result.bbtype);
      DEMO.append("h6").text("WFREQ: " + result.wfreq);
  });
};

//build charts function
function buildCharts(trial) {
  d3.json(url).then(function(data) {
    //create a variable that hold the array of trials
    let trialArray = data.samples;
    
    //filter the data
    let filtered = trialArray.filter(sampleObj => sampleObj.id == trial);
    
    //
      let metadata = data.metadata;
      let filterAgain = metadata.filter(sampleObj => sampleObj.id == trial);
      let result = filterAgain[0];
      let trialNew = filtered[0]
      
    //add in the out_id's, labels, sample_values
      let otu_ids = trialNew.otu_ids
      let otu_labels = trialNew.otu_labels
      let sample_values = trialNew.sample_values
      

      //washing freq variable
      let washFreq = parseFloat(result.wfreq);
  
      
      //put the data in descending order
      let yticks = otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();
      
      
      //bar chart
      let bData = [{
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }];
  
      //bar chart layout
      let bLayout = {
        title : "Top 10 Bacteria"
      };
      //plot bar chart 
      Plotly.newPlot("bar", bData, bLayout);

      //bubble chart
    let bbData = [{
      x: otu_ids , 
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: "Portland"
      }
    }];
    //bubble chart layout
    let bbLayout = {
      title: "Bacteria Per Sample",
      xaxis: {title:"OTU ID"},
      hovermode: "closest"
    };

    //plot bubble chart
    Plotly.newPlot("bubble", bbData, bbLayout);

    
    //gauge chart
    let gData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        type: "indicator",
        mode: "gauge+number",
        title: { text: "B-Button Washing Frequency" },
        gauge: {
          axis: {range:[null,10],tickwidth:2},
          steps: [
            { range: [0, 2], color: "maroon" },
            { range: [2, 4], color: "darkorange" },
            { range: [4, 6], color: "gold" },
            { range: [6, 8], color: "darkseagreen" },
            { range: [8, 10], color: "darkolivegreen" },
          ]

        }
    }];
    
    //guage chart layout 
    let gLayout = { 
      width: 450, 
      height: 445,
      margin: { t: 0, b: 0 }
    };
    
    //plot gauge chart
    Plotly.newPlot("gauge", gData, gLayout );
  });
}

