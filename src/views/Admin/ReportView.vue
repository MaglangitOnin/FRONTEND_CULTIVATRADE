<template>
  <navigationBar />
  <div class="bg-[#4D8734] w-full h-full min-h-screen">
    <div class="flex flex-col items-center">
      <img src="../../assets/Images/cultivatrade-report.png" class="scale-75" />
      <div class="bg-[#E0E0E0] rounded-lg p-4 w-1/2">
        <div class="flex w-full items-center justify-center">
          <div class="w-full text-center text-[40px] fw-bold">Report</div>
        </div>
        <div class="row flex w-full">
          <div class="col flex items-start">
            <label class="me-2">Month</label>
            <div class="flex justify-start pb-2">
              <el-select
                v-model="selectedMonth"
                placeholder="Select Month"
                size="large"
                style="width: 240px"
              >
                <el-option
                  v-for="(month, index) in months"
                  :key="index"
                  :label="month"
                  :value="index + 1"
                />
              </el-select>
            </div>
          </div>
          <div class="col flex">
            <label class="mx-2">Year</label>
            <div class="flex justify-start pb-2">
              <el-select
                v-model="selectedYear"
                placeholder="Select Year"
                size="large"
                style="width: 240px"
              >
                <el-option v-for="year in years" :key="year" :label="year" :value="year" />
              </el-select>
            </div>
          </div>
          <div class="col ms-4">
            <export-excel :data="products">Export Data</export-excel>
            <!-- <el-button @click="getSoldProduct">EXPORT</el-button> -->
          </div>
        </div>
        <div class="flex justify-around gap-x-6">
          <div
            class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
          >
            <h3 class="text-lg font-bold">Total Users</h3>
            <p class="text-2xl">{{ statistics.users }}</p>
          </div>
          <div
            class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
          >
            <h3 class="text-lg font-bold">Total Products</h3>
            <p class="text-2xl">{{ statistics.products }}</p>
          </div>
          <div
            class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
          >
            <h3 class="text-lg font-bold">Total Revenue</h3>
            <p class="text-2xl">{{ statistics.revenue }}</p>
          </div>
          <div
            class="bg-white shadow-md rounded-lg p-6 w-1/4 text-center hover:transition-all hover:-translate-y-2"
          >
            <h3 class="text-lg font-bold">Sales Made</h3>
            <p class="text-2xl">{{ statistics.sold }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navigationBar from './NavigationView.vue';
import ExportExcel from '../../components/ExportExcel.vue'; // Import ExportExcel component
import axios from 'axios';

export default {
  components: {
    navigationBar,
    ExportExcel, // Register ExportExcel component
  },
  data() {
    return {
      totalUsers: 120,
      totalProducts: 120,
      totalRevenue: 120,
      totalSales: 50,
      products: [],
      selectedMonth: null,
      selectedYear: null,
      statistics: {},
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
    };
  },
  methods: {
    getSoldProduct() {
      axios
        .get(`${this.url}/Admin/Product?month=${this.selectedMonth}&year=${this.selectedYear}`)
        .then((response) => {
          this.products = response.data;
          console.log('get sold product', response.data);
        });
    },

    getStatistics() {
      axios.get(`${this.url}/Admin/Statistics`).then((response) => {
        this.statistics = response.data;
        console.log('statistics', response.data);
      });
    },
  },
  mounted() {
    this.getStatistics();
  },
};
</script>
