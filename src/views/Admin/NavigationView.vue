<template>
  <nav class="flex items-center justify-between flex-wrap px-9 bg-[#68912E]">
    <router-link to="/adminHome">
      <div class="flex items-center flex-shrink-0 text-black">
        <img src="../../assets/Images/ctLogo.png" alt="logo" />
      </div>
    </router-link>

    <div class="ms-14 w-full block flex-grow lg:flex lg:items-center lg:w-auto ml-auto">
      <div class="text-sm lg:flex-grow flex justify-between scale-75">
        <router-link
          to="/sellerApplication"
          class="text-white block mt-4 lg:inline-block lg:mt-0 text-[32px] mr-4 hover:-translate-y-1 hover:transition-all"
        >
          Application
        </router-link>
        <router-link
          to="/marketplace"
          class="text-white block mt-4 lg:inline-block lg:mt-0 text-[32px] mr-4 hover:-translate-y-1 hover:transition-all"
          >Marketplace</router-link
        >
        <router-link
          to="/inventory"
          class="text-white block mt-4 lg:inline-block lg:mt-0 text-[32px] hover:-translate-y-1 hover:transition-all"
          >Inventory</router-link
        >
        <router-link
          to="/product"
          class="text-white block ms-4 me-4 mt-4 lg:inline-block lg:mt-0 text-[32px] hover:-translate-y-1 hover:transition-all"
        >
          Products
        </router-link>
        <router-link
          to="/report"
          class="text-white block mt-4 lg:inline-block lg:mt-0 text-[32px] hover:-translate-y-1 hover:transition-all"
        >
          Report
        </router-link>
      </div>
      <div class="ms-14">
        <router-link
          to="/sellerProfile"
          class="inline-block text-sm px-4 py-2 leading-none mt-4 lg:mt-0 hover:-translate-y-1 hover:transition-all"
        >
          <i class="bi bi-person-fill text-[50px] text-white"></i>
        </router-link>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'navigationBar',
};
</script>
