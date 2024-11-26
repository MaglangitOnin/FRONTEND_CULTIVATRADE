<template>
  <div>
    <navigationBar />
    <!-- Dashboard Cards -->
    <div class="flex justify-around p-8">
      <div
        class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
      >
        <h3 class="text-lg font-bold">Total Products</h3>
        <p class="text-2xl">{{ totalProducts }}</p>
      </div>
      <div
        class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
      >
        <h3 class="text-lg font-bold">Total Sellers</h3>
        <p class="text-2xl">{{ totalSellers }}</p>
      </div>
      <div
        class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
      >
        <h3 class="text-lg font-bold">Total Buyers</h3>
        <p class="text-2xl">{{ totalBuyers }}</p>
      </div>
    </div>
    <!-- Chart Section -->
    <div class="flex w-full border p-4 space-x-4">
      <div class="flex-1 w/2">
        <BarChart class="border" />
      </div>
      <div class="flex-none w-1/4">
        <!-- You can adjust the width here -->
        <div class="flex-1 w/2">
          <div>Month of {{ monthDate() }}</div>
          <DoughnutChart
            :totalProducts="totalProducts"
            :totalSellers="totalSellers"
            :totalBuyers="totalBuyers"
            class="border"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navigationBar from './NavigationView.vue';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import BarChart from '@/components/BarChart.vue';
import DoughnutChart from '@/components/DoughnutChart.vue';
export default {
  components: { BarChart, DoughnutChart, navigationBar },
  data() {
    return {
      totalProducts: 0,
      totalSellers: 0,
      totalBuyers: 0,
      date: new Date(),
      chartData: {
        labels: ['Products', 'Sellers', 'Buyers'],
        datasets: [
          {
            label: 'Total',
            data: [120, 50, 80],
            backgroundColor: ['#68912E', '#4A90E2', '#E94E77'],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Total Metrics',
          },
        },
      },
    };
  },
  methods: {
    monthDate() {
      return this.date.toLocaleString('default', { month: 'long' });
    },

    getSeller() {
      axios.get(`${this.url}/User/Seller`).then((response) => {
        this.totalSellers = response.data;
      });
    },

    getBuyer() {
      axios.get(`${this.url}/User/AllBuyers`).then((response) => {
        this.totalBuyers = response.data.length;
        this.tableLoading = false;
      });
    },

    getProduct() {
      axios.get(`${this.url}/Product/Count`).then((response) => {
        this.totalProducts = response.data;
      });
    },
  },
  mounted() {
    this.getSeller();
    this.getBuyer();
    this.getProduct();
  },
};
</script>
