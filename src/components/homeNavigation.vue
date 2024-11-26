<template>
  <nav class="flex items-center justify-between p-6">
    <!-- Logo Section -->
    <div class="flex items-center flex-shrink-0 text-white">
      <img
        src="../assets/Images/cultivatrade-landing-logo.png"
        alt="Logo"
        class="w-[323px] h-[190px]"
      />
    </div>

    <!-- Navigation Section -->
    <div class="scale-75 hidden lg:flex ml-auto space-x-6 font-semibold text-[30px] me-10">
      <button @click="$emit('navigate-login')" class="text-gray-700 hover:text-gray-900">
        Home
      </button>
      <a href="#" class="text-gray-700 hover:text-gray-900">About</a>
      <a href="#" class="text-gray-700 hover:text-gray-900">Pricing</a>
      <a href="#" class="text-gray-700 hover:text-gray-900">Contact</a>
    </div>

    <!-- Mobile Menu Button -->
    <div class="lg:hidden">
      <button
        class="flex items-center px-3 py-2 rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
      >
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'navLinks',
  data() {
    return {};
  },
  methods() {},
};
</script>
<style></style>
