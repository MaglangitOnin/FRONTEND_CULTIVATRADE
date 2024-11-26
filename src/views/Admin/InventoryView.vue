<template>
  <navigationBar />
  <div class="bg-[#4D8734] w-full h-full min-h-screen">
    <div class="flex flex-col items-center">
      <img src="../../assets/Images/cultivatrade-inventory.png" class="scale-75" />
      <div class="bg-[#E0E0E0] rounded-lg bg-opacity-75 p-4 text-[#648E2A] w-1/2">
        <div class="row flex w-full">
          <div class="col flex items-start">
            <label class="me-2">Month</label>
            <div class="flex justify-start pb-2">
              <el-select
                v-model="selectedMonth"
                placeholder="Select Month"
                size="large"
                style="width: 240px"
                @change="getProductByDateTimeCreated"
              >
                <el-option
                  v-for="(month, index) in months"
                  :key="index"
                  :label="month.month"
                  :value="month.value"
                />
              </el-select>
            </div>
          </div>
          <div class="col flex">
            <label class="mx-2">Year</label>
            <div class="flex justify-start pb-2">
              <el-select
                :disabled="selectedMonth == null"
                v-model="selectedYear"
                placeholder="Select Year"
                size="large"
                style="width: 240px"
                @change="getProductByDateTimeCreated"
              >
                <el-option v-for="year in years" :key="year" :label="year" :value="year" />
              </el-select>
            </div>
          </div>
        </div>

        <div class="flex justify-center w-full">
          <el-table :data="products" :style="{ width: '100%' }">
            <el-table-column>
              <template #default="scope">
                <el-image :src="scope.row.productImage" />
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="Product name" width="180" />
            <el-table-column prop="quantity" label="Quantity" width="180" />
            <el-table-column prop="totalSold" label="Total Sold" width="180" />
            <el-table-column prop="productPrice" label="Price" />
            <el-table-column label="Seller"
              ><template #default="scope">
                {{ `${scope.row.sellerFirstname} ${scope.row.sellerLastname}` }}
              </template></el-table-column
            >
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navigationBar from './NavigationView.vue';
import axios from 'axios';

export default {
  components: {
    navigationBar,
  },
  name: 'inventoryView',
  data() {
    const today = new Date(); // Get today's date
    return {
      products: [],
      selectedMonth: today.getMonth() + 1, // Months are 0-based, so add 1
      selectedYear: today.getFullYear(),
      months: [
        { value: 1, month: 'January' },
        { value: 2, month: 'February' },
        { value: 3, month: 'March' },
        { value: 4, month: 'April' },
        { value: 5, month: 'May' },
        { value: 6, month: 'June' },
        { value: 7, month: 'July' },
        { value: 8, month: 'August' },
        { value: 9, month: 'September' },
        { value: 10, month: 'October' },
        { value: 11, month: 'November' },
        { value: 12, month: 'December' },
      ],
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
    };
  },
  methods: {
    getProductByDateTimeCreated() {
      axios
        .get(`${this.url}/Admin/Product?month=${this.selectedMonth}&year=${this.selectedYear}`)
        .then((response) => {
          this.products = response.data;
        });
    },
  },
};
</script>

<style></style>
