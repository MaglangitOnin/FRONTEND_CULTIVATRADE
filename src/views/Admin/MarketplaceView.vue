<template>
  <navigationBar />
  <div class="bg-[#4D8734] w-full h-full min-h-screen">
    <div class="flex flex-col items-center">
      <img src="../../assets/Images/cultivatrade-marketplace.png" class="scale-75" />

      <div class="bg-[#E0E0E0] rounded-lg bg-opacity-75 p-4 text-[#648E2A] w-1/2">
        Category
        <div class="flex justify-start pb-2">
          <el-select
            v-model="selectedCategory"
            size="large"
            style="width: 240px"
            @change="getUserByStatus"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div v-if="selectedCategory === 'products'" class="flex justify-center w-full">
          <el-table :data="products" :style="{ width: '100%' }">
            <el-table-column>
              <template #default="scope">
                <el-image :src="scope.row.productImage" />
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="Product name" width="180" />
            <el-table-column prop="quantity" label="Quantity" width="180" />
            <el-table-column prop="productPrice" label="Price" />
            <el-table-column label="Seller"
              ><template #default="scope">
                {{ `${scope.row.sellerFirstname} ${scope.row.sellerLastname}` }}
              </template></el-table-column
            >
            <el-table-column>
              <template #default="scope">
                <el-button type="danger" @click="deleteProduct(scope.row.productId)"
                  >&times;</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="selectedCategory === false" class="flex justify-center w-full">
          <el-table :data="users" :style="{ width: '100%' }">
            <el-table-column>
              <template #default="scope">
                <el-image :src="scope.row.profileDataUrl" />
              </template>
            </el-table-column>
            <el-table-column label="Name" width="180">
              <template #default="scope">
                {{ `${scope.row.firstname} ${scope.row.lastname}` }}</template
              >
            </el-table-column>
            <el-table-column prop="email" label="Email" width="180" />
            <el-table-column prop="phone" label="Phone" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </div>
        <div v-if="selectedCategory === true" class="flex justify-center w-full">
          <el-table :data="users" :style="{ width: '100%' }">
            <el-table-column>
              <template #default="scope">
                <el-image :src="scope.row.profileDataUrl" />
              </template>
            </el-table-column>
            <el-table-column label="Name" width="180">
              <template #default="scope">
                {{ `${scope.row.firstname} ${scope.row.lastname}` }}</template
              >
            </el-table-column>
            <el-table-column prop="email" label="Email" width="180" />
            <el-table-column prop="phone" label="Phone" />
            <el-table-column prop="address" label="Address" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navigationBar from './NavigationView.vue';
import axios from 'axios';
import { collapseItemProps, ElMessage, ElMessageBox } from 'element-plus';
export default {
  components: {
    navigationBar,
  },
  name: 'marketplaceView',
  data() {
    return {
      tableLoading: false,
      selectedProduct: {},
      selectedCategory: 'products',
      options: [
        { value: 'products', label: 'Products' },
        { value: false, label: 'Buyers' },
        { value: true, label: 'Sellers' },
      ],
      products: [],
      users: [],
    };
  },
  methods: {
    getUserByStatus(status) {
      this.tableLoading = true;
      if (status == undefined) {
        status = 'products';
      }
      if (status == 'products') {
        axios.get(`${this.url}/Product?search=`).then((response) => {
          this.products = response.data.results;
          this.tableLoading = false;
        });
      } else if (this.selectedCategory == false) {
        axios.get(`${this.url}/User/AllBuyers`).then((response) => {
          this.users = response.data;
          this.tableLoading = false;
        });
      } else {
        axios.get(`${this.url}/User/${status}/Status`).then((response) => {
          this.users = response.data;
          console.log('else', response.data);
          this.tableLoading = false;
        });
      }
    },
    // DELETE PRODUCT
    deleteProduct(productId) {
      ElMessageBox.confirm('Are you sure you want to delete this product?', 'Delete Product', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      })
        .then(() => {
          axios.delete(`${this.url}/Product/${productId}`).then((response) => {
            if (response.data === 'success') {
              ElMessage.success('Product deleted successfully');
              this.getUserByStatus();
            } else {
              ElMessage.error('Failed to delete product');
            }
          });
        })
        .catch(() => {
          ElMessage.info('Product deletion canceled');
        });
    },
  },
  mounted() {
    this.getUserByStatus();
  },
};
</script>
<style></style>
