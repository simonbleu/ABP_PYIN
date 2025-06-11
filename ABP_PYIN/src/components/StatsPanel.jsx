import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { useState } from "react";

// Registramos los componentes del gráfico
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function StatsPanel(props) {
  const [selectedStat, setSelectedStat] = useState("");
  const [selectedChart, setSelectedChart] = useState("");

  // Función para obtener los datos según la estadística seleccionada
  const getChartData = () => {
    switch (selectedStat) {
      case "precios":
        return {
          labels: ['Precio Mínimo', 'Precio Máximo'],
          datasets: [{
            label: "Precios",
            data: [props.min, props.max],
            backgroundColor: ['#f87171', '#4ade80'],
            borderColor: ['#ef4444', '#22c55e'],
            borderWidth: 2
          }]
        };
      
      case "productos":
        return {
          labels: ['Títulos Largos', 'Títulos Cortos'],
          datasets: [{
            label: "Cantidad de Productos",
            data: [props.longTitles, props.total - props.longTitles],
            backgroundColor: ['#3b82f6', '#f59e0b'],
            borderColor: ['#2563eb', '#d97706'],
            borderWidth: 2
          }]
        };
      
      case "resumen":
        return {
          labels: ['Precio Total', 'Precio Promedio', 'Descuento Promedio'],
          datasets: [{
            label: "Valores",
            data: [props.totalPrice, parseFloat(props.avgPrice), props.avgDiscount],
            backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981'],
            borderColor: ['#7c3aed', '#0891b2', '#059669'],
            borderWidth: 2
          }]
        };
      
      default:
        return null;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: selectedChart === "pie",
        labels: {
          color: props.darkMode ? '#e5e7eb' : '#eb350e'
        }
      },
      title: {
        display: true,
        text: `${selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)} - ${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)}`,
        color: props.darkMode ? '#e5e7eb' : '#eb350e'
      }
    },
    scales: selectedChart !== "pie" ? {
      y: {
        beginAtZero: true,
        min: 0,
        suggestedMin: 0,
        ticks: {
          precision: 2,
          stepSize: 0.1,
          color: props.darkMode ? '#e5e7eb' : '#eb350e' /*numeros y stat*/ 
        },
        grid: {
          color: props.darkMode ? '#e5e7eb' : '#1f2937' /*linas y contornos*/ 
        }
      },
      x: {
        ticks: {
          color: props.darkMode ? '#e5e7eb' : '#eb350e' /*texto eje x abajo*/ 
        },
        grid: {
          color: props.darkMode ? '#e5e7eb' : '#374151' /*linea divisora*/ 
        }
      }
    } : {}
  };

  const renderChart = () => {
    const data = getChartData();
    if (!data) return null;

    switch (selectedChart) {
      case "bar":
        return <Bar data={data} options={chartOptions} />;
      case "line":
        return <Line data={data} options={chartOptions} />;
      case "pie":
        return <Pie data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  const showChart = selectedStat && selectedChart;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded p-4 max-w-md bg-white dark:bg-gray-800 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Estadísticas</h2>
      <div className="space-y-1 text-gray-600 dark:text-gray-300">
        <p>Productos totales: {props.total}</p>
        <p>Precio máximo: {props.max !== null ? `$${props.max.toFixed(2)}` : "N/A"}</p>
        <p>Producto más caro: {props.maxName || "N/A"}</p>
        <p>Precio mínimo: {props.min !== null ? `$${props.min.toFixed(2)}` : "N/A"}</p>
        <p>Producto más barato: {props.minName || "N/A"}</p>
        <p>Cant. títulos &gt; 20 caracteres: {props.longTitles}</p>
        <p>Precio total: ${props.totalPrice.toFixed(2)}</p>
        <p>Promedio descuento: {Math.round(props.avgDiscount)}%</p>
        <p>Precio promedio: ${props.avgPrice}</p>
        <p>Producto con más vocales: {props.mostVowelsName}</p>
      </div>
      
      {/* Selectores */}
      <div className="mt-4 space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Estadística:
          </label>
          <select 
            value={selectedStat} 
            onChange={(e) => setSelectedStat(e.target.value)}
            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-800 dark:text-white transition-colors duration-300"
          >
            <option value="">Seleccionar estadística</option>
            <option value="precios">Precios (Min/Max)</option>
            <option value="productos">Productos (Títulos largos/cortos)</option>
            <option value="resumen">Resumen (Total/Promedio/Descuento)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Tipo de gráfico:
          </label>
          <select 
            value={selectedChart} 
            onChange={(e) => setSelectedChart(e.target.value)}
            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-800 dark:text-white transition-colors duration-300"
          >
            <option value="">Seleccionar tipo de gráfico</option>
            <option value="bar">Barras</option>
            <option value="line">Líneas</option>
            <option value="pie">Circular</option>
          </select>
        </div>
      </div>
      
      {/* Gráfico */}
      {showChart && (
        <div className="mt-4" style={{ height: '250px' }}>
          {renderChart()}
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
