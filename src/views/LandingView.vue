<template>
  <!-- Landing Page Background -->
  <div
    v-if="!triggerLandingPage"
    class="bg-[url('../src/assets/Images/cult-background.png')] h-screen bg-cover bg-center"
  >
    <div class="flex h-screen justify-center items-center fade-in-slide-down">
      <!-- Get Started Button -->
      <button
        @click="handleLandingPage"
        class="p-6 rounded-full px-10 hover:bg-slate-500 hover:text-white font-bold bg-white"
      >
        Get Started
      </button>
    </div>
  </div>

  <!-- Landing Page Content -->
  <div
    v-if="triggerLandingPage"
    class="h-screen fixed top-0 left-0 w-screen bg-[url('../src/assets/Images/raw-bg-landing-page.png')] bg-cover fade-in-slide-down bg-center"
  >
    <NavLinks @navigate-login="handleLoginPage" />
    <section class="-translate-y-52 scale-75 sm:scale-100">
      <div class="flex flex-col sm:flex-row h-screen px-4 sm:px-40 py-6 sm:py-0">
        <!-- Left Column Content -->
        <div class="flex-col text-[20px] sm:text-[24px] space-y-4 sm:space-y-6">
          <div class="text-[40px] sm:text-[60px] font-extrabold drop-shadow-md">
            CultivaTrade
          </div>
          <div class="text-[20px] sm:text-[30px] font-medium italic mt-4 sm:mt-10 drop-shadow-md">
            Where Freshness Meets Quality
          </div>
          <div class="mt-4 sm:mt-10 text-[16px] sm:text-[18px]">
            At CULTIVATRADE, we bring you the freshest produce straight
          </div>
          <div class="text-[16px] sm:text-[18px]">
            from the fields to your table.
          </div>
          <div class="mt-4 sm:mt-10 text-[16px] sm:text-[18px] w-full sm:w-3/6">
            Enjoy a seamless shopping experience, whether you're a consumer, retailer, or business
            owner, and support local farmers by choosing from a wide variety of vegetables, fruits,
            and more.
          </div>
          <div class="mt-4 sm:mt-10 text-[16px] sm:text-[18px] w-full sm:w-3/6">
            Join us in cultivating a community that values quality, sustainability, and the essence
            of farm-to-table goodness.
          </div>
          <div class="mt-4 sm:mt-10 text-nowrap">
            <button
              @click="handleLoginPage"
              class="bg-[#1A4D2E] text-white p-6 rounded-full px-10 hover:bg-[#2c7e4d] sm:px-10 sm:py-6"
            >
              SHOP NOW!
            </button>
          </div>
        </div>

        <!-- Right Column (empty for now) -->
        <div class="flex-col hidden sm:block"></div>
      </div>
    </section>
  </div>
</template>

<script>
import router from '@/router';
import NavLinks from '../components/homeNavigation.vue';
export default {
  components: {
    NavLinks,
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      triggerLandingPage: false,
      triggerLogin: false,
    };
  },
  methods: {
    handleLandingPage() {
      this.triggerLandingPage = true;
    },
    handleLoginPage() {
      router.push('login');
    },
  },
  mounted() {},
};
</script>

<style></style>
