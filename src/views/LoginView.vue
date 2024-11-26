<template>
  <div class="h-screen w-screen bg-gray-100">
    <div class="flex flex-col lg:flex-row h-screen justify-center items-center border border-black">
      <!-- Left Section -->
      <div class="flex flex-col justify-start w-full lg:w-1/2 p-4 sm:p-8">
        <div class="flex flex-col justify-center p-8 fade-in-slide-down">
          <!-- Main Login Form -->
          <div v-if="!toggleForgotPassword" class="scale-75 sm:scale-100">
            <div class="flex flex-row justify-center mb-8">
              <img
                src="../assets/Images/welcome-words.png"
                alt="Welcome Words"
                class="max-w-[80%] sm:max-w-full"
              />
            </div>
            <div class="flex flex-row justify-center w-full">
              <el-form label-position="top" class="w-full sm:w-auto">
                <!-- Email -->
                <el-form-item label="Email" class="w-full sm:w-[427px] h-[76px]">
                  <el-input
                    v-model="form.login.email"
                    class="w-full rounded h-11"
                    placeholder="Enter Email"
                  />
                </el-form-item>
                <!-- Password -->
                <el-form-item label="Password" class="w-full sm:w-[427px] h-[76px]">
                  <el-input
                    v-model="form.login.password"
                    type="password"
                    class="w-full rounded h-11"
                    placeholder="Enter Password"
                    show-password
                  />
                </el-form-item>
                <!-- Forgot Password Link -->
                <div class="flex flex-row justify-end w-full sm:w-[427px]">
                  <button @click="btnForgotPassword" class="text-[#4F6F52] hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <!-- Login Button -->
                <el-form-item class="w-full sm:w-[427px]">
                  <button
                    type="button"
                    class="bg-[#3e6b27] w-full py-2 text-white hover:bg-[#5e9d3f]"
                    @click="submitForm('Login')"
                  >
                    Login now
                  </button>
                </el-form-item>
                <!-- Sign Up Link -->
                <div class="flex w-full justify-center items-center mt-4">
                  <a href="./signup" class="text-blue-600 hover:underline">
                    Don't have an account? <span class="font-bold">Sign Up</span>
                  </a>
                </div>
              </el-form>
            </div>
          </div>

          <!-- Forgot Password Form -->
          <div
            v-if="toggleForgotPassword"
            class="border rounded-lg p-10 bg-white w-full sm:w-[80%] md:w-[60%] lg:w-[50%]"
          >
            <div class="text-lg font-bold text-[#3E6B27] mb-6">Forgot Password</div>

            <!-- Email Input -->
            <div v-if="toggleSendCode" class="flex flex-col items-center">
              <el-form class="w-full flex justify-center">
                <el-form-item class="w-1/2">
                  <el-input
                    v-model="form.sendCode.email"
                    class="w-full rounded h-11"
                    placeholder="Enter Email"
                  />
                </el-form-item>
              </el-form>
              <div class="flex justify-center mt-4 mb-4 w-full">
                <button
                  :disabled="isButtonDisabled"
                  type="button"
                  class="bg-[#3e6b27] w-1/2 p-2 text-white hover:bg-[#5e9d3f]"
                  @click="submitForm('Send Code')"
                >
                  Send Code
                </button>
              </div>
            </div>

            <!-- Code Input -->
            <div v-if="showCodeInput" class="flex flex-col items-center">
              <el-form class="w-full flex justify-center">
                <el-form-item class="w-1/2">
                  <el-input hidden v-model="form.verifyCode.email" />
                  <el-input
                    v-model="form.verifyCode.verificationCode"
                    class="w-full rounded h-11"
                    placeholder="Enter Code"
                    maxlength="4"
                    show-word-limit
                    :formatter="(value) => value.replace(/\D/g, '')"
                  />
                </el-form-item>
              </el-form>
              <div class="flex justify-center mt-4 mb-4 w-full">
                <button
                  type="button"
                  class="bg-[#3e6b27] w-1/2 p-2 text-white hover:bg-[#5e9d3f]"
                  @click="submitForm('Verify Code')"
                >
                  Verify Code
                </button>
              </div>
            </div>

            <!-- Password and Confirm Password Inputs -->
            <div v-if="codeVerified" class="flex flex-col items-center">
              <el-form class="w-full" label-position="top">
                <!-- New Password -->
                <el-form-item label="New Password" class="w-full flex">
                  <el-input hidden v-model="form.resetPassword.email" />
                  <el-input
                    v-model="form.resetPassword.password1"
                    type="password"
                    class="w-full rounded h-11"
                    placeholder="Enter New Password"
                    show-password
                  />
                </el-form-item>

                <!-- Confirm New Password -->
                <el-form-item label="Confirm New Password" class="w-full flex">
                  <el-input
                    v-model="form.resetPassword.password2"
                    type="password"
                    class="w-full rounded h-11"
                    placeholder="Confirm New Password"
                    show-password
                  />
                </el-form-item>
              </el-form>
              <div class="flex justify-center mt-4 mb-4 w-full">
                <button
                  type="button"
                  class="bg-[#3e6b27] w-1/2 p-2 text-white hover:bg-[#5e9d3f]"
                  @click="submitForm('Reset Password')"
                >
                  Confirm
                </button>
              </div>
            </div>

            <!-- Cancel Button -->
            <div class="flex justify-end mt-4">
              <button
                @click="cancelForgotPassword"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col w-full lg:w-1/2 bg-cover bg-center h-screen sm:block hidden"
        style="background-image: url('../src/assets/Images/loginBackground.png')"
      ></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import { ElMessage, ElLoading } from 'element-plus';
export default {
  data() {
    return {
      toggleSendCode: false,
      form: {
        login: {
          email: '',
          password: '',
        },
        sendCode: {
          email: '',
        },
        verifyCode: {
          email: '',
          verificationCode: '',
        },
        resetPassword: {
          email: '',
          password1: '',
          password2: '',
        },
      },
      toggleForgotPassword: false,
      showCodeInput: false,
      codeVerified: false,
    };
  },
  computed: {
    isButtonDisabled() {
      return !this.isValidEmail(this.form.sendCode.email);
    },
  },
  methods: {
    // EMAIL VALIDATION
    isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },

    submitForm(title) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      // LOGIN
      if (title == 'Login') {
        if (this.form.login.email == '' || this.form.login.password == '') {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Invalid email or password');
          }, 1000);
          return;
        }
        axios
          .get(
            `${this.url}/User/Email/${this.form.login.email}/Password/${this.form.login.password}`
          )
          .then((response) => {
            if (response.data == 'error') {
              ElMessage.error('Invalid email or password');
            } else {
              if (response.data.isSeller == true && response.data.isApproved == true) {
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.replace('./sellerHome');
              } else {
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.replace('./home');
              }
            }
            loading.close();
          });
        return;
      }

      // SEND CODE
      if (title == 'Send Code') {
        if (this.form.sendCode.email == '') {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Please input email');
          }, 1000);
          return;
        }
        axios
          .get(`${this.url}/User/Email/${this.form.sendCode.email}`)
          .then((response) => {
            if (response.data == 'error') {
              ElMessage.error('Failed to send verification code');
            } else {
              this.form.verifyCode.email = response.data.email;
              this.showCodeInput = true;
              this.toggleSendCode = false;
              this.form.sendCode.email = '';
            }
            loading.close();
          })
          .catch(() => {
            ElMessage.error('Failed to send code');
            loading.close();
          });
        return;
      }

      // VERIFY CODE
      if (title == 'Verify Code') {
        if (this.form.verifyCode.verificationCode == '') {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Please enter verification code');
          }, 1000);
          return;
        }
        axios
          .get(
            `${this.url}/User/Email/${this.form.verifyCode.email}/VerificationCode/${this.form.verifyCode.verificationCode}`
          )
          .then((response) => {
            if (response.data == 'error') {
              ElMessage.error('Failed to verify code');
            } else {
              this.form.resetPassword.email = response.data.email;
              this.codeVerified = true;
              this.showCodeInput = false;
              this.form.verifyCode.verificationCode = '';
            }
            loading.close();
          })
          .catch(() => {
            ElMessage.error('Failed to verify code');
            loading.close();
          });
        return;
      }

      // RESET PASSWORD
      if (title == 'Reset Password') {
        if (this.form.resetPassword.password1 != this.form.resetPassword.password2) {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Password not match');
          }, 1000);
          return;
        }
        if (this.form.resetPassword.password1 == '' || this.form.resetPassword.password2 == '') {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Please input new password and confirm password');
          }, 1000);
          return;
        }
        axios
          .put(
            `${this.url}/User/Email/${this.form.resetPassword.email}/Password/${this.form.resetPassword.password1}`
          )
          .then((response) => {
            if (response.data == 'success') {
              ElMessage.success('Password reset successfully');
              loading.close();
              this.toggleForgotPassword = false;
              this.codeVerified = false;
              this.form.resetPassword.password1 = '';
              this.form.resetPassword.password2 = '';
            } else {
              ElMessage.error('Failed to reset password');
              loading.close();
            }
          })
          .catch(() => {
            ElMessage.error('Failed to reset password');
            loading.close();
          });
        return;
      }
    },
    btnForgotPassword() {
      this.toggleForgotPassword = true;
      this.showCodeInput = false;
      this.codeVerified = false;
      this.toggleSendCode = true;
    },

    cancelForgotPassword() {
      this.toggleForgotPassword = false;
      this.showCodeInput = false;
      this.form.code = '';
    },
  },
};
</script>
