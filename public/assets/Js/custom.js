
$(document).ready(function(){
    // Toggle class
    $("button.toggel").click(function(){
        $(".sidebar").toggleClass("close");
    });
});

// Data retrieved from https://fas.org/issues/nuclear-weapons/status-world-nuclear-forces/

Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    xAxis: {
        allowDecimals: false,
        accessibility: {
            rangeDescription: 'Range: 1940 to 2017.'
        }
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    tooltip: {
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
            'July', 'Aug', 'Sept', 'Oct', 'Nov','Dec']
    },
    series: [{
        name: 'USA',
        data: [
            1, 5, 2, 9, 5, 8, 10, 9, 12, 15, 17,15
        ]
    }, {
        name: 'Russia',
        data: [12, 8, 4, 8, 8, 1, 5, 9,2,5,3, 10
        ]
    }],
    exporting: {
        buttons: {
        contextButton: {
            menuItems: [
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadPDF",
            "downloadSVG",
            "separator",
            "downloadCSV",
            "downloadXLS",
            //"viewData",
            "openInCloud"
            ]
        }
        }
    }
});

 
Highcharts.chart('container1', {
    chart: {
        type: 'area'
    },
    title: {
        text: ''
    },
    yAxis: {
        title: {
            useHTML: true,
            text: ''
        }
    },
    tooltip: {
        shared: true,
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointStart: 2012
        },
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        }
    },
    series: [{
        name: 'Growth',
        data: [13234, 12729, 11533, 17798, 10398, 12811, 15483, 16196, 16214]
    }],
    exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                "printChart",
                "separator",
                "downloadPNG",
                "downloadJPEG",
                "downloadPDF",
                "downloadSVG",
                "separator",
                "downloadCSV",
                "downloadXLS",
                //"viewData",
                "openInCloud"
              ]
            }
          }
        }
});


Highcharts.chart('container2', {
    chart: {
        type: 'column'
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
   
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: '{point.y:.1f} millions</b>'
    },
    series: [{
        name: '',
        colors: [
            '#9e55ff'
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: [
            ['JAN', 37.33],
            ['FEB', 31.18],
            ['MARCH', 27.79],
            ['APRIL', 22.23],
            ['MAY', 21.91],
            ['JUNE', 21.74],
            ['JULY', 21.32],
            ['AUG', 20.89],
            ['SEP', 20.67],
            ['OCT', 19.11],
        ],
        dataLabels: {
            enabled: true,
            rotation: -90,
            responsive: true,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});
















