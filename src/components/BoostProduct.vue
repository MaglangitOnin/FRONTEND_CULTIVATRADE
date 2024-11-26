<template>
  <div v-if="!paid" id="paypal-button-container"></div>
  <!-- <div v-else id="confirmation">Order complete!</div> -->
</template>

<script setup>
import { loadScript } from '@paypal/paypal-js';
import { onBeforeMount, ref } from 'vue';
import { ElMessage } from 'element-plus';

import axios from 'axios';

const CLIENT_ID = 'test';

const props = defineProps({
  boostProduct: {
    type: Object,
    required: true,
  },
});

const paid = ref(false);

onBeforeMount(() => {
  loadScript({ 'client-id': CLIENT_ID }).then((paypal) => {
    paypal
      .Buttons({
        createOrder: createOrder,
        onApprove: onApprove,
      })
      .render('#paypal-button-container');
  });
});

function createOrder(data, actions) {
  console.log('Creating order...');
  return actions.order.create({
    purchase_units: [
      {
        amount: {
          value: props.boostProduct.boostCost,
        },
      },
    ],
  });
}

function onApprove(data, actions) {
  const payload = {
    productId: props.boostProduct.productId,
    boostCost: props.boostProduct.boostCost,
    numberOfDays: props.boostProduct.numberOfDays,
  };

  try {
    axios
      .post(`https://localhost:7175/api/BoostedProduct`, payload)
      .then((response) => {
        if (response.data == 'success') {
          this.$emit('paymentSuccess', 'Payment successful');
        } else {
          this.$emit('paymentSuccess', 'Failed to pay boost product');
        }
      })
      .catch((e) => {
        ElMessage.error(e);
      });
  } catch (e) {
    ElMessage.error(e);
  }

  return actions.order.capture().then(() => {
    paid.value = true;
    console.log('Order complete!');
  });
}
</script>

<style>
#paypal-button-container {
  width: 100%;
  margin: 30px 0;
}

#confirmation {
  color: green;
  margin-top: 1em;
  font-size: 2em;
}
</style>
