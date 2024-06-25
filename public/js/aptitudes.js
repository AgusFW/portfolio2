document.addEventListener("DOMContentLoaded", function () {
    // Datos para cada gráfico
    var chartDataReact = {
        value: 90,
        color: "#78288c",
        highlight: "#A569BD",
        label: "React"
    };

    var chartDataNode = {
        value: 65,
        color: "#28B463",
        highlight: "#2ECC71",
        label: "Node.js"
    };

    var chartDataUML = {
        value: 60,
        color: "#D35400",
        highlight: "#DC7633",
        label: "UML"
    };

    var chartDataTypeScript = {
        value: 75,
        color: "#2E86C1",
        highlight: "#3498DB",
        label: "TypeScript"
    };

    var chartDataJavaScript = {
        value: 90,
        color: "#F1C40F",
        highlight: "#F4D03F",
        label: "JavaScript"
    };

    var chartDataComunicacionEfectiva = {
        value: 70,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Comunicacion efectiva"
    };

    var chartDataTrabajoEnEquipo = {
        value: 80,
        color: "#2980B9",
        highlight: "#5499C7",
        label: "Trabajo en equipo"
    };

    var chartDataResolucionDeProblemas = {
        value: 70,
        color: "#F4D03F",
        highlight: "#F7DC6F",
        label: "Resolucion de problemas"
    }

    var chartDataIniciativa = {
        value: 80,
        color: "#AF7AC5",
        highlight: "#C39BD3",
        label: "Iniciativa"
    }

    var chartDataGestionDelTiempo = {
        value: 70,
        color: "#1E8449",
        highlight: "#229954",
        label: "Gestion del tiempo"
    }

 // Función para crear un gráfico dado los datos y opciones
 function createDoughnutChart(canvasId, chartData) {
    var chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                }
            },
        }
    };
    var chart = document.getElementById(canvasId).getContext("2d");
    new Chart(chart, {
        type: 'doughnut',
        data: {
            labels: [chartData.label],
            datasets: [{
                data: [chartData.value, 100 - chartData.value],
                backgroundColor: [
                    chartData.color,
                    'transparent'
                ],
                hoverBackgroundColor: [
                    chartData.highlight,
                    'transparent'
                ]
            }]
        },
        options: chartOptions
    });
}

// Crear cada gráfico
createDoughnutChart('ChartReact', chartDataReact);
createDoughnutChart('ChartNode', chartDataNode);
createDoughnutChart('ChartUML', chartDataUML);
createDoughnutChart('ChartTypeScript', chartDataTypeScript);
createDoughnutChart('ChartJavaScript', chartDataJavaScript);
createDoughnutChart('ChartComunicacionEfectiva', chartDataComunicacionEfectiva);
createDoughnutChart('ChartTrabajoenEquipo', chartDataTrabajoEnEquipo);
createDoughnutChart('ChartResoluciondeProblemas', chartDataResolucionDeProblemas);
createDoughnutChart('ChartIniciativa', chartDataIniciativa);
createDoughnutChart('ChartGestiondelTiempo', chartDataGestionDelTiempo);
});




