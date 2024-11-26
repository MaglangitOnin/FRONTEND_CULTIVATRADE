<template>
  <navigationBar />
  <div class="bg-[#4D8734] w-full h-full min-h-screen">
    <div class="flex flex-col items-center">
      <!-- Change to flex-col and center items -->
      <img src="../../assets/Images/cultivatrade-seller.png" class="scale-75" />

      <div class="bg-[#E0E0E0] rounded-lg bg-opacity-75 p-4 text-[#648E2A] w-1/2">
        <!-- Set a max-width for the dropdown container -->
        Status
        <div class="flex justify-start pb-2">
          <!-- Justify the select dropdown -->
          <el-select v-model="status" size="large" style="width: 240px" @change="getUserByStatus">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex justify-center w-full">
          <el-table v-loading="tableLoading" :data="users">
            <el-table-column prop="firstname" label="Firstname">
              <template #default="scope">
                <el-image :src="scope.row.profileDataUrl" />
              </template>
            </el-table-column>
            <el-table-column prop="firstname" label="Firstname">
              <template #default="scope">
                {{ `${scope.row.firstname} ${scope.row.lastname}` }}
              </template>
            </el-table-column>
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="phone" label="Phone" />
            <el-table-column prop="address" label="Address" />
            <el-table-column prop="status" label="Status" />
            <el-table-column label="Approval Decision">
              <template #default="scope">
                <div v-if="scope.row.isApproved == false">
                  <el-button @click="submitForm(scope.row, 'Approve')" type="success"
                    >Approve</el-button
                  >
                </div>
                <div v-else>
                  <el-button @click="submitForm(scope.row, 'Disapprove')" type="danger"
                    >Disapprove</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navigationBar from './NavigationView.vue';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';

export default {
  components: {
    navigationBar,
  },
  name: 'SampleSellerApplication',
  data() {
    return {
      tableLoading: false,
      status: false,
      users: [],
      options: [
        { label: 'Pending', value: false },
        { label: 'Approved', value: true },
      ],
    };
  },
  methods: {
    submitForm(data, title) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      if (title == 'Approve') {
        axios.put(`${this.url}/User/${data.userId}/ApproveDisapprove`).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('User approved');
            this.getUserByStatus(!this.status);
            this.addNotification('Approve', data.userId);
            loading.close();
          }
        });
        return;
      }
      if (title == 'Disapprove') {
        axios.put(`${this.url}/User/${data.userId}/ApproveDisapprove`).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('User disapproved');
            this.getUserByStatus(!this.status);
            this.addNotification('Disapprove', data.userId);
            loading.close();
          }
        });
        return;
      }
    },

    // APPROVE / DISAPPROVE
    addNotification(status, userId) {
      const payload = {
        userId: userId,
        message:
          status == 'Approve'
            ? 'You have been approved as seller you can now sell your goods'
            : 'Your account has been revert as buyer',
        productId: null,
      };
      axios.post(`${this.url}/Notification`, payload).then((response) => {});
    },

    getUserByStatus(status) {
      if (status == undefined) {
        status = false;
      }
      this.tableLoading = true;
      axios.get(`${this.url}/User/${status}/Status`).then((response) => {
        this.users = response.data;
        this.tableLoading = false;
      });
    },
  },
  mounted() {
    this.getUserByStatus();
  },
};
</script>
<style></style>
