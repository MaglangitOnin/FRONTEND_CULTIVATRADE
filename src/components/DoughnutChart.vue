<template>
  <Doughnut id="barChartId" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

export default {
  name: 'doughnutChart',
  components: { Doughnut },
  props: ['totalProducts', 'totalSellers', 'totalBuyers'],
  data() {
    return {
      chartData: {
        labels: ['Products', 'Sellers', 'Buyers'],
        datasets: [
          {
            data: [this.totalProducts, this.totalSellers, this.totalBuyers],
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
};
</script>
