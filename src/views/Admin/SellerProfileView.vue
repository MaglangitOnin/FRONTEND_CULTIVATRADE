<template>
  <NavigationBar />
  <div class="bg-[#4D8734] w-full h-full min-h-screen flex justify-center items-center">
    <div class="flex w-3/4 bg-green-500 rounded-lg shadow-lg">
      <!-- Profile Section -->
      <div class="flex flex-col items-center p-8 bg-green-600 rounded-l-lg text-white w-1/3">
        <div class="w-32 h-32 rounded-full overflow-hidden mb-4">
          <!-- Profile Image -->
          <img
            src="https://via.placeholder.com/150"
            alt="profile"
            class="object-cover w-full h-full"
          />
        </div>
        <h2 class="text-xl font-bold mb-2">Nino E. Maglangit</h2>
        <p class="text-sm text-gray-200 mb-4">Admin</p>
        <p class="text-sm mb-6">cultivatrade@gmail.com</p>
        <!-- Logout Button -->
        <button
          @click="logout"
          class="bg-green-800 px-4 py-2 text-white rounded-full hover:bg-green-700 transition duration-200"
        >
          LOGOUT
        </button>
      </div>

      <!-- Password Change Section -->
      <div class="flex-1 bg-[#F5F5E8] p-8 rounded-r-lg">
        <h2 class="text-2xl font-semibold text-green-900 mb-6">Password</h2>
        <el-form label-position="top" class="w-full">
          <el-form-item label="Current Password">
            <el-input
              type="password"
              placeholder="Current Password"
              v-model="currentPassword"
            ></el-input>
          </el-form-item>
          <el-form-item label="New Password">
            <el-input type="password" placeholder="New Password" v-model="newPassword"></el-input>
          </el-form-item>
          <el-form-item label="Confirm New Password">
            <el-input
              type="password"
              placeholder="Confirm New Password"
              v-model="confirmNewPassword"
            ></el-input>
          </el-form-item>
          <div class="flex justify-between items-center">
            <button class="text-green-900 underline"></button>
            <button
              type="button"
              @click="updatePassword"
              class="bg-green-700 px-4 py-2 text-white rounded-full hover:bg-green-600 transition duration-200"
            >
              Update
            </button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from './NavigationView.vue';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';

export default {
  components: {
    NavigationBar,
  },
  name: 'SellerProfile',
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      window.location.replace('/admin');
    },
    updatePassword() {
      if (this.newPassword != this.confirmNewPassword) {
        ElMessage.error('Password not match');
        return;
      }
      const payload = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmNewPassword: this.confirmNewPassword,
      };
      axios
        .put(`${this.url}/Admin/e93c37cd-0975-4ff7-9770-3168b33c42b5`, payload)
        .then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Password updated successfully');
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmNewPassword = '';
          } else if (response.data == 'error') {
            ElMessage.error('Failed to update password');
          }
        })
        .catch((error) => {
          if (error.response.status == 400) {
            ElMessage.error('Invalid current password');
          }
        });
    },
  },
};
</script>

<style scoped></style>
