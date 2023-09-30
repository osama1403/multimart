import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, // the x axis
  LinearScale, // the y axis
  PointElement,
  LineElement, //drawing line 
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register( // register these elements and start working with them
  CategoryScale, 
  LinearScale, 
  PointElement,
  LineElement, 
  Title,
  Tooltip,
  Legend,
  Filler
);


const chart = () => {
  
  const options = {
    maintainAspectRatio:false,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    // plugins: {
    //   title: {
    //     display: true,
    //     text: 'Chart.js Line Chart - Multi Axis',
    //   },
    // },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero:true,
        title:{
          display:true,
          text:'ORDERS'
        }
        
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero:true,
        grid: {
          drawOnChartArea: false,
        },
        title:{
          display:true,
          text:'USD'
        }
      },
    }
  };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'ORDERS',
        data: [47, 24, 35, 40, 50, 30, 60],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y',
        fill:false,
        tension:0.3
        },
      {
        label: 'REVENU',
        data: [1804, 600, 1000, 1200, 2000, 1500, 1700],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        yAxisID: 'y1',
        fill:false,
        tension:0.3
      }
    ]
  };

  return (
    <Line options={options} data={data}  />
 );
}

export default chart;