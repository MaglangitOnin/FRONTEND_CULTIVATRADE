<template>
  <div class="min-h-screen bg-gray-50 flex justify-center items-center">
    <div class="flex bg-white shadow-lg rounded-lg w-3/4 h-3/4 overflow-hidden">
      <!-- Left Section -->
      <div class="w-1/2 p-8 flex flex-col justify-center items-center bg-gray-100">
        <!-- Log In Section -->
        <div v-if="!showSignUp && !showForgotPassword" class="w-full">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
          <el-form class="w-full space-y-4">
            <!-- Email Field -->
            <el-form-item>
              <label class="block text-sm font-medium text-gray-700">Username</label>
              <el-input v-model="form.username" class="w-full" placeholder="Enter your Username" />
            </el-form-item>
            <!-- Password Field -->
            <el-form-item>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <el-input
                v-model="form.password"
                type="password"
                class="w-full"
                placeholder="Enter your password"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                class="bg-green-600 w-full py-3 text-center text-white rounded-md hover:bg-green-700"
                @click="submitForm('Login')"
              >
                Login now
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- Right Section with Background Image -->
      <div
        class="w-1/2 bg-cover bg-center"
        style="background-image: url('../src/assets/Images/loginBackground.png')"
      ></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
export default {
  data() {
    return {
      showSignUp: false,
      showForgotPassword: false,
      showPasswordFields: false,
      form: {
        username: '',
        password: '',
      },
      formData: {
        name: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    submitForm(title) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const payload = {
        username: this.form.username,
        password: this.form.password,
      };
      if (title == 'Login') {
        if (this.form.username == '' || this.form.password == '') {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Invalid email or password');
          }, 1000);
          return;
        }
        axios.post(`${this.url}/Admin/Login`, payload).then((response) => {
          if (response.data == 'error') {
            ElMessage.error(`Invalid username or password`);
          } else {
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.replace('./adminHome');
          }
          loading.close();
        });
      }
    },
    // btnLogin() {
    //   router.push('/adminHome');
    // },
    // login() {
    //   if (this.formData.email && this.formData.password) {
    //     alert('Logged in successfully!');
    //   } else {
    //     alert('Please fill in both email and password.');
    //   }
    // },
    // signup() {
    //   if (this.formData.name && this.formData.email && this.formData.password) {
    //     alert('Signed up successfully!');
    //   } else {
    //     alert('Please fill in all fields.');
    //   }
    // },
    // resetPassword() {
    //   if (this.formData.email) {
    //     this.showPasswordFields = true; // Show the password fields when the code is sent
    //     alert('Password reset code sent!');
    //   } else {
    //     alert('Please enter your email.');
    //   }
    // },
    // confirmResetPassword() {
    //   if (this.formData.newPassword && this.formData.confirmPassword) {
    //     if (this.formData.newPassword === this.formData.confirmPassword) {
    //       alert('Password has been reset successfully!');
    //       // Handle the password reset logic here
    //     } else {
    //       alert('Passwords do not match. Please try again.');
    //     }
    //   } else {
    //     alert('Please fill in both password fields.');
    //   }
    // },
    // btnSignUp() {
    //   this.showSignUp = true;
    //   this.showForgotPassword = false;
    // },
    // btnSignIn() {
    //   this.showSignUp = false;
    //   this.showForgotPassword = false;
    //   this.showPasswordFields = false;
    // },
  },
};
</script>

<style scoped>
.el-input {
  width: 100%;
}
</style>
