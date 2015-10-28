var xml;
var femaleDeaths = [0, 0, 0, 0, 0];
var maleDeaths = [0, 0, 0, 0, 0];

var petTypes = ["Dog", "Cat", "Reptile", "Rabbit"];
var foundPetTypesCounts = [0, 0, 0, 0];
var lostPetTypesCounts = [0, 0, 0, 0];
var adoptablePetTypesCounts = [0, 0, 0, 0];

var recordType= ["Found", "Lost", "Adoptable"];
var overallRecordCounts= [0, 0, 0];
var ageRange = ["Under 1 year old", "Over 1 year old", "Unknown"]
var foundAgeCount = [0, 0, 0];
var lostAgeCount = [0, 0, 0];
var adoptableAgeCount = [0, 0, 0];


function loadData(){
  $.ajax({
    url: 'petData.xml',
    type: 'GET',
    data: 'xml',
    success: parseData
  });
}

function parseData(xml){

  // Build the pie graphs
  $(xml).find("row").each(function(index){
    var type = ($(this).find("animal_type")).text();
    // if ($.inArray(type, petTypes) == -1) {
    //   petTypes.push(type);
    // }
    var record = ($(this).find("record_type")).text();
    switch(record) {
    case "FOUND":
        overallRecordCounts[0] += 1;
        switch(type) {
        case "Dog":
            foundPetTypesCounts[0] += 1;
            break;
        case "Cat":
            foundPetTypesCounts[1] += 1;
            break;
        case "Dead Dog":
            foundPetTypesCounts[0] += 1;
            break;
        case "Dead Cat":
            foundPetTypesCounts[1] += 1;
            break;
        case "Reptile":
            foundPetTypesCounts[2] += 1;
            break;
        case "Rabbit":
            foundPetTypesCounts[3] += 1;
            break;
        }
        break;
    case "LOST":
        overallRecordCounts[1] += 1;
        switch(type) {
        case "Dog":
            lostPetTypesCounts[0] += 1;
            break;
        case "Cat":
            lostPetTypesCounts[1] += 1;
            break;
        case "Dead Dog":
            lostPetTypesCounts[0] += 1;
            break;
        case "Dead Cat":
            lostPetTypesCounts[1] += 1;
            break;
        case "Reptile":
            lostPetTypesCounts[2] += 1;
            break;
        case "Rabbit":
            lostPetTypesCounts[3] += 1;
            break;
        }
        break;
    case "ADOPTABLE":
        overallRecordCounts[2] += 1;
        switch(type) {
        case "Dog":
            adoptablePetTypesCounts[0] += 1;
            break;
        case "Cat":
            adoptablePetTypesCounts[1] += 1;
            break;
        case "Dead Dog":
            adoptablePetTypesCounts[0] += 1;
            break;
        case "Dead Cat":
            adoptablePetTypesCounts[1] += 1;
            break;
        case "Reptile":
            adoptablePetTypesCounts[2] += 1;
            break;
        case "Rabbit":
            adoptablePetTypesCounts[3] += 1;
            break;
        }
        break;
    }

    var age = Number(($(this).find("yearsOld")).text());
    if (age == 99) { //if unknown
      switch(record) {
      case "FOUND":
        foundAgeCount[2] += 1;
        break;
      case "LOST":
        lostAgeCount[2] += 1;
        break;
      case "ADOPTABLE":
        adoptableAgeCount[2] += 1;
        break;
      }
    }
    else if (age == 0) {
      switch(record) {
      case "FOUND":
        foundAgeCount[0] += 1;
        break;
      case "LOST":
        lostAgeCount[0] += 1;
        break;
      case "ADOPTABLE":
        adoptableAgeCount[0] += 1;
        break;
      }
    }
    else {
      switch(record) {
      case "FOUND":
        foundAgeCount[1] += 1;
        break;
      case "LOST":
        lostAgeCount[1] += 1;
        break;
      case "ADOPTABLE":
        adoptableAgeCount[1] += 1;
        break;
      }
    }

  });

  buildChart();
  buildPie();

  // Builds the table
  $(xml).find("row").each(function(index){
    var row = $("<tr>");
    var link = ($(this).find("link")).attr("url");
    var htmlLink = '<a href=' + link + '>View</a>';

    row.append($("<td>" + ($(this).find("animal_id")).text() +"</td>"))
      .append($("<td>" + (($(this).find("record_type")).text()).toLowerCase() +"</td>"))
      .append($("<td>" + ($(this).find("animal_type")).text() +"</td>"))
      .append($("<td>" + (($(this).find("age")).text()).toLowerCase() +"</td>"))
      .append($("<td>" + ($(this).find("animal_gender")).text() +"</td>"))
      .append($("<td>" + ($(this).find("animal_breed")).text() +"</td>"))
      .append($("<td>" + (($(this).find("city")).text()).toLowerCase() +"</td>"))
      .append($("<td>" + htmlLink +"</td>"));

    $("#myTable tbody").append(row);
  });
  $('#myTable').DataTable();
}

function buildChart() {
$('#bar').highcharts({
    chart: {
        type: 'column'
    },
    title: {
        text: 'Status by Age'
    },
    xAxis: {
        categories: ageRange
    },
    yAxis: {
        title: {
            text: 'Number of animals'
        }
    },
    series: [{
        name: 'Found',
        data: foundAgeCount
    }, {
        name: 'Lost',
        data: lostAgeCount
    }, {
        name: 'Adoptable',
        data: adoptableAgeCount
    }]
});
};

function buildPie() {
  $('#pie1').highcharts({
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Overall Counts for Animals'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: "Record percentage",
          colorByPoint: true,
          data: [{
              name: recordType[0],
              y: overallRecordCounts[0]
          }, {
              name: recordType[1],
              y: overallRecordCounts[1]
          }, {
              name: recordType[2],
              y: overallRecordCounts[2],
              sliced: true,
              selected: true
          }]
      }]
  });
  $('#pie2').highcharts({
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Animal Type by Record'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: "Type found",
          colorByPoint: true,
          data: [{
              name: petTypes[0],
              y: foundPetTypesCounts[0],
              sliced: true,
              selected: true
          }, {
              name: petTypes[1],
              y: foundPetTypesCounts[1]
          }, {
              name: petTypes[2],
              y: foundPetTypesCounts[2]
          }, {
              name: petTypes[3],
              y: foundPetTypesCounts[3]
          }]
      }]
  });
};

$(document).ready(function(){
  console.log("doc ready!");
  loadData();
})

function loadFoundPieChart() {
  $('#pie2').highcharts({
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Animal Type by Record'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: "Type found",
          colorByPoint: true,
          data: [{
              name: petTypes[0],
              y: foundPetTypesCounts[0],
              sliced: true,
              selected: true
          }, {
              name: petTypes[1],
              y: foundPetTypesCounts[1]
          }, {
              name: petTypes[2],
              y: foundPetTypesCounts[2]
          }, {
              name: petTypes[3],
              y: foundPetTypesCounts[3]
          }]
      }]
  });
}

function loadLostPieChart() {
  $('#pie2').highcharts({
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Animal Type by Record'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: "Type found",
          colorByPoint: true,
          data: [{
              name: petTypes[0],
              y: lostPetTypesCounts[0],
              sliced: true,
              selected: true
          }, {
              name: petTypes[1],
              y: lostPetTypesCounts[1]
          }, {
              name: petTypes[2],
              y: lostPetTypesCounts[2]
          }, {
              name: petTypes[3],
              y: lostPetTypesCounts[3]
          }]
      }]
  });
}

function loadAdoptablePieChart() {
  $('#pie2').highcharts({
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Animal Type by Record'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
              }
          }
      },
      series: [{
          name: "Type found",
          colorByPoint: true,
          data: [{
              name: petTypes[0],
              y: adoptablePetTypesCounts[0],
              sliced: true,
              selected: true
          }, {
              name: petTypes[1],
              y: adoptablePetTypesCounts[1]
          }, {
              name: petTypes[2],
              y: adoptablePetTypesCounts[2]
          }, {
              name: petTypes[3],
              y: adoptablePetTypesCounts[3]
          }]
      }]
  });
}
