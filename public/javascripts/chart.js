
var chartdata = [
    { name: 'Apple', y: 1 },
    { name: 'Cherry', y: 16 },
    { name: 'Buch', y: 0 }
];


Highcharts.setOptions({
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    })
});
function treechart(treedata) { 
// Build the chart
Highcharts.chart('chartcontainer', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Tree Statistic <br>(on Current Window)'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>({point.y} trees)'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} % ({point.y} trees)',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                },
                connectorColor: 'silver'
                
            },
            // dataLabels: {
            //     enabled: false
            // },
            showInLegend: true
        }
    },
    series: [{
        name: 'Tree',
        //data: chartdata
        data: treedata
    }]
});
};