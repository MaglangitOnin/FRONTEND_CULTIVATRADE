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
    type: Object,
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
  console.log('Creating order...', props.order.totalAmount);
  return actions.order.create({
    purchase_units: [
      {
        amount: {
          value: props.order.totalAmount,
        },
      },
    ],
  });
}

function onApprove(data, actions) {
  const payload = {
    buyerId: props.order.buyerId,
    sellerId: props.order.sellerId,
    productId: props.order.productId,
    paymentOption: props.order.paymentOption,
    quantityBought: props.order.quantityBought,
    totalAmount: props.order.totalAmount,
    deliveryAddress: props.order.deliveryAddress,
    paymentSource: data.paymentSource,
    payerId: data.payerID,
    paymentCodeId: data.paymentID,
  };

  try {
    axios
      .post(`https://localhost:7175/api/Order`, payload)
      .then((response) => {
        ElMessage.success('Order successful');
        const orderId = response.data;
        axios
          .put(
            `https://localhost:7175/api/Product/${props.order.productId}/Quantity/${props.order.quantityBought}`
          )
          .then((response) => {
            if (response.data == 'success') {
              //
            } else {
              ElMessage.error("Cannot buy not enough kilo/s'");
              return;
            }
          });

        axios
          .post(`https://localhost:7175/api/Notification`, {
            buyerId: props.order.buyerId,
            userId: props.order.sellerId,
            productId: props.order.productId,
            message: 'Product bought waiting for seller to prepare your order',
            orderId: orderId,
          })
          .then((response) => {
            if (response.data == 'success') {
              // this.getNotificationByUserId();
              axios
                .delete(`https://localhost:7175/api/Cart/${props.order.cartId}`)
                .then((response) => {
                  if (response.data == 'success') {
                    emit('done', true);
                  } else {
                    ElMessage.error('Failed to remove product from cart');
                  }
                });
            } else {
              return;
            }
          });
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
