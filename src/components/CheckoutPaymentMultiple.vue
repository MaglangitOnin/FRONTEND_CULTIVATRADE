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
  order: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits();

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
  const mappedData = props.order.map((item) => ({
    totalAmount: item.totalAmount,
  }));

  const totalOrderAmount = mappedData.reduce((total, item) => total + item.totalAmount, 0);

  console.log('Creating order...', totalOrderAmount);

  return actions.order.create({
    purchase_units: [
      {
        amount: {
          value: totalOrderAmount.toFixed(2),
        },
      },
    ],
  });
}

function onApprove(data, actions) {
  const paymentSource = data.paymentSource;
  const payerId = data.payerID;
  const paymentCodeId = data.paymentID;

  const mappedData = props.order.map((data) => ({
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    productId: data.productId,
    paymentOption: data.paymentOption,
    quantityBought: data.quantityBought,
    totalAmount: data.totalAmount,
    deliveryAddress: data.deliveryAddress,
    paymentSource: paymentSource,
    payerId: payerId,
    paymentCodeId: paymentCodeId,
  }));

  try {
    axios
      .post(`https://localhost:7175/api/Order/Multiple`, mappedData)
      .then(() => {
        //
        for (let i = 0; i < props.order.length; i++) {
          axios
            .delete(`https://localhost:7175/api/Cart/${props.order[i].cartId}`)
            .then((response) => {
              if (response.data == 'success') {
                emit('done', true);
              } else {
                ElMessage.error('Failed to remove product from cart');
              }
            });
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
