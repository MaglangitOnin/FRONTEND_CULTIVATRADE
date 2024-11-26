<template>
  <navigationBar />
  <div class="bg-[#4D8734] w-full h-full min-h-screen">
    <div class="flex flex-col items-center">
      <div class="bg-[#E0E0E0] rounded-lg bg-opacity-75 text-[#648E2A] mt-10 p-4">
        <div class="overflow-auto">
          <div style="display: flex; justify-content: end">
            <el-button type="primary" @click="openForm('Add Product', [])"
              >Add Product Reference</el-button
            >
          </div>
          <el-table :data="products" class="w-full bg-white rounded-lg shadow-lg">
            <el-table-column label="Product Image" width="100">
              <template #default="{ row }">
                <img :src="row.productImage" alt="Product Image" class="w-[50px] h-[50px]" />
              </template>
            </el-table-column>

            <el-table-column label="Product Name" prop="name" width="200">
              <template #default="{ row }">
                <p class="text-lg font-semibold">{{ row.name }}</p>
              </template>
            </el-table-column>

            <el-table-column label="Category" prop="categoryName" />

            <el-table-column label="Price / Kilo" width="150">
              <template #default="{ row }">
                <p class="text-green-500">P {{ row.price }} / kilo</p>
              </template>
            </el-table-column>

            <el-table-column label="Actions" width="240" align="center">
              <template #default="{ row }">
                <el-button type="secondary" @click="openForm('Edit Product', row)">
                  Edit
                </el-button>
                <!-- <el-button type="primary" @click="openForm('Add Product', row)"> Add </el-button> -->
                <el-popconfirm
                  @confirm="deleteProduct(row.productReferenceId)"
                  title="Do you want to delete this product?"
                >
                  <template #reference>
                    <el-button type="danger">Delete</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- START FORM -->
    <!-- Add New Product Dialog -->
    <el-dialog :before-close="clear" v-model="dialog.product" :title="title" width="600">
      <!-- Product Image -->
      <div v-loading="isLoadingImage" class="mb-4">
        <el-upload
          ref="uploader"
          class="upload-demo"
          v-model:file-list="fileList"
          action="getUploadTrigger"
          list-type="picture-card"
          :on-success="onSuccess"
          :on-preview="onPreview"
          :on-remove="onRemove"
          :before-upload="beforeUpload"
          method="get"
          accept="image/jpeg, image/png, image/jpg"
          :limit="1"
          :on-exceed="onExceed"
        >
          <i class="bi bi-plus"></i>
        </el-upload>
      </div>
      <el-form label-position="top">
        <el-form-item class="mb-4" label="Category">
          <el-radio-group v-model="form.categoryName">
            <el-radio :value="'Vegetables'" size="large">Vegetables</el-radio>
            <el-radio :value="'Fruits'" size="large">Fruits</el-radio>
          </el-radio-group></el-form-item
        >
        <el-form-item class="mb-4" label="Name">
          <el-input v-model="form.productName" placeholder="Enter product name"></el-input>
        </el-form-item>

        <el-form-item class="mb-4" label="Price (per kilo)">
          <el-input
            v-model="form.productPrice"
            placeholder="Enter price"
            :formatter="
              (value) => {
                return value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
              }
            "
          />
        </el-form-item>
      </el-form>

      <!-- Modal Footer -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm()">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- END FORM -->
    <!-- START PREVIEW IMAGE DIALOG -->
    <el-dialog v-model="dialog.previewImage">
      <div class="content-center">
        <div>
          <img :src="previewImg" style="width: 300px" />
        </div>
      </div>
    </el-dialog>
    <!-- END PREVIEW IMAGE DIALOG -->
  </div>
</template>
<script>
import navigationBar from './NavigationView.vue';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
export default {
  components: {
    navigationBar,
  },
  name: 'inventoryView',
  data() {
    return {
      previewImg: '',
      isLoadingImage: false,
      fileList: [],
      file: [],
      form: {
        productDetails: {
          buyerId: '',
          productId: '',
          quantity: '',
          productName: '',
          productDescription: '',
          productPrice: '',
          sellerId: '',
          sellerName: '',
          sellerImage: '',
          sellerEmail: '',
          sellerPhone: '',
          sellerAddress: '',
        },
        farm: {
          farmName: '',
          farmAddress: '',
          farmDescription: '',
        },
        productReferenceId: '',
        sellerId: '',
        productName: '',
        productDescription: '',
        expiryDate: '',
        quantity: 1,
        productPrice: '',
        categoryName: 'Vegetables',

        firstname: '',
        lastname: '',
        email: '',
        address: '',
        phone: '',
      },
      dialog: {
        product: false,
        previewImage: false,
        deliveryDate: false,
      },
      title: '',
      products: [],
      productData: [
        {
          image: faker.image.avatar(),
          productName: 'Dalandan',
          productPrice: 2500,
          lastUpdate: '2022-01-01',
        },
      ],
      selectedMonth: null,
      selectedYear: null,
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
    onExceed(files) {
      this.$refs.uploader.clearFiles();
      this.$refs.uploader.handleStart(files[0]);
    },
    // SUBMIT FORM
    submitForm() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });

      if (this.title == 'Add Product') {
        const formData = new FormData();
        this.file.forEach((file) => {
          formData.append('categoryName', this.form.categoryName);
          formData.append('name', this.form.productName);
          formData.append('price', this.form.productPrice);
          formData.append('file', file);
        });

        axios.post(`${this.url}/ProductReference`, formData).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Product Reference added successfully');
            loading.close();
            this.getProduct('');
            this.form.categoryName = '';
            this.form.productName = '';
            this.form.productPrice = '';
            this.file = [];
            this.dialog.product = false;
          } else {
            ElMessage.error('Failed to add Product Reference');
          }
        });
      }

      // EDIT PRODUCT
      if (this.title === 'Edit Product') {
        const formData = new FormData();

        formData.append('categoryName', this.form.categoryName);
        formData.append('name', this.form.productName);
        formData.append('price', this.form.productPrice);

        if (this.file.length > 0) {
          formData.append('file', this.file[0] || this.file[1]);
        }

        axios
          .put(`${this.url}/ProductReference/${this.form.productReferenceId}`, formData)
          .then((response) => {
            if (response.data === 'success') {
              ElMessage.success('Product Reference updated successfully');
              loading.close();
              this.getProduct('');
              this.dialog.product = false;
              this.form.categoryName = '';
              this.form.productName = '';
              this.form.productPrice = '';
              this.file = [];
            } else {
              ElMessage.error('Failed to update Product Reference');
            }
          })
          .catch((error) => {
            ElMessage.error('An error occurred: ' + error.message);
            console.error(error);
          });
      }
    },
    // DELETE PRODUCT
    deleteProduct(productId) {
      axios.delete(`${this.url}/ProductReference/${productId}`).then((response) => {
        if (response.data == 'success') {
          ElMessage.success('Product deleted successfully');
          this.getProduct('');
        } else {
          ElMessage.error('Failed to delete product');
        }
      });
    },

    // PREVIEW IMAGE
    onPreview(file) {
      this.previewImg = file.url || file.thumbUrl;
      this.dialog.previewImage = true;
      console.log(this.file);
    },

    // SELECTED IMAGES
    onSuccess(res, file) {
      this.file.push(file.raw);
      console.log(this.file);
    },

    // REMOVE SELECTED IMAGE
    onRemove(file) {
      this.file = this.file.filter((f) => f.uid !== file.uid);

      console.log(this.file);
    },

    // CHECK FILE FORMAT / FILE SIZE
    beforeUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        ElMessage.warning('File type should be JPG, PNG');
        return false;
      }
      if (file.size > 10000000) {
        ElMessage.warning('File size should be less than 10MB');
        return false;
      }
    },
    clear() {
      this.isLoadingImage = false;
      this.dialog.product = false;
      this.dialog.previewImage = false;
      this.fileList = [];
      this.file = [];
      this.form.productName = '';
      this.form.productDescription = '';
      this.form.expiryDate = '';
      this.form.quantity = 0;
      this.form.productPrice = 0;
      this.form.categoryName = 'Vegetables';
    },
    openForm(title, data) {
      this.fileList = [];
      this.file = [];

      // EDIT PRODUCT
      if (title === 'Edit Product') {
        this.dialog.product = true;
        this.title = 'Edit Product';
        this.form.productReferenceId = data.productReferenceId;
        this.form.productName = data.name;
        this.form.productPrice = data.price;
        this.form.categoryName = data.categoryName;

        this.isLoadingImage = true;
        console.log(this.form.productReferenceId);
        console.log(this.form.productName);
        console.log(this.form.productPrice);
        console.log(this.form.categoryName);
        axios
          .get(`${this.url}/ProductReference/${data.productReferenceId}`, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            console.log(response);
            if (response.data == 'No image not found') {
              ElMessage.error('Image has been deleted from the server');
              return;
            }
            const base64Image = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );

            this.fileList.push({
              name: '',
              url: `data:${response.headers['content-type']};base64,${base64Image}`,
              type: response.headers['content-type'],
              fileId: data.productReferenceId,
            });
            this.isLoadingImage = false;
          });
      }

      //ADD PRODUCT
      if (title === 'Add Product') {
        this.dialog.product = true;
        this.title = 'Add Product';
      }
    },

    formatDate(date1) {
      if (!date1) {
        return '';
      }

      const months = [
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
      ];

      const date = new Date(date1);
      const year = date.getFullYear();
      const monthIndex = date.getMonth(); // Month index (0-11)
      const month = months[monthIndex]; // Get the month abbreviation
      const day = date.getDate().toString().padStart(2, '0');

      return `${month} ${day}, ${year}`;
    },

    // GET PRODUCT
    getProduct(data) {
      axios.get(`${this.url}/ProductReference?search=${data}`).then((response) => {
        this.products = response.data;
        this.tableLoading = false;
      });
    },
  },
  mounted() {
    this.getProduct('');
  },
};
</script>
<style></style>
