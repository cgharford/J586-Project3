var xml;
var femaleDeaths = [0, 0, 0, 0, 0];
var maleDeaths = [0, 0, 0, 0, 0];

var petTypes = [];
var recordType= ["Found", "Lost", "Adoptable"];
var overallRecordCounts= [0, 0, 0];

function loadData(){
  $.ajax({
    url: 'petData.xml',
    type: 'GET',
    data: 'xml',
    success: parseData
  });
}

function parseData(xml){

  // Build the bar chart
  // $(xml).find("row").each(function(index){
  //   var year = ($(this).find("year")).text();
  //   var index = year % startingYear;
  //   years[index] = year;
  //   if (($(this).find("sex")).text() == "MALE") {
  //     maleDeaths[index] = Number(maleDeaths[index]) + Number(($(this).find("count")).text());
  //   }
  //   else {
  //     femaleDeaths[index] = Number(femaleDeaths[index]) + Number(($(this).find("count")).text());
  //   }
  // });

  // Build the pie graph
  $(xml).find("row").each(function(index){
    var type = ($(this).find("animal_type")).text();
    if ($.inArray(type, petTypes) == -1) {
      petTypes.push(type);
    }
    var record = ($(this).find("record_type")).text();
    switch(record) {
    case "FOUND":
        overallRecordCounts[0] += 1;
        break;
    case "LOST":
        overallRecordCounts[1] += 1;
        break;
    case "ADOPTABLE":
        overallRecordCounts[2] += 1;
        break;
    }

    // var count = ($(this).find("count")).text();
    // var tmpEthnicityArray = [ethnicity, count];
    // var newEthnicity = 0;
    // var index2;
    // for (i = 0; i < ethnicityCount.length; i++) {
    //   if (ethnicityCount[i][0] == ethnicity) {
    //     newEthnicity = 1;
    //     index2 = i;
    //     break;
    //   }
    // }
    // if (newEthnicity != 1) {
    //   ethnicityCount.push(tmpEthnicityArray);
    // }
    // else {
    //   ethnicityCount[index2][1] = Number(ethnicityCount[index2][1]) + Number(count);
    // }



  });

  // buildChart();
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
      .append($("<td>" + ($(this).find("state")).text() +"</td>"))
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
        text: 'Class Demographics'
    },
    xAxis: {
        categories: years
    },
    yAxis: {
        title: {
            text: 'Number of deaths'
        }
    },
    series: [{
        name: 'Female',
        data: femaleDeaths
    }, {
        name: 'Male',
        data: maleDeaths
    }]
});
};

function buildPie() {
  $('#pie').highcharts({
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
};

$(document).ready(function(){
  console.log("doc ready!");
  loadData();
})
