<template>
  <div class="h-full mb-10">
    <nav class="flex flex-wrap items-center justify-between p-4 bg-white shadow-md">
      <!-- Logo and Home Button -->
      <div class="flex items-center flex-shrink-0 text-black">
        <button
          @click="btnViewHomePage"
          class="ms-4 block text-[30px] font-semibold drop-shadow-sm mr-4 lg:text-[24px]"
        >
          HOME
        </button>
      </div>

      <!-- Navigation Links Section -->
      <div class="w-full lg:w-auto flex items-center justify-between mt-4 lg:mt-0">
        <div class="text-sm flex flex-wrap justify-center lg:justify-end gap-4">
          <!-- Notification Button -->
          <button
            :style="
              toggleViewAllNotification
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewAllNotifications"
            class="text-black text-[20px] hover:-translate-y-1 hover:transition-all"
          >
            Notification ({{ totalNotifications }})
          </button>

          <!-- Message Button -->
          <button
            :style="
              toggleViewContact
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewContacts"
            class="text-black text-[20px] hover:-translate-y-1 hover:transition-all"
          >
            Message
          </button>

          <!-- My Cart Button -->
          <button
            :style="
              toggleMyCart
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnMyCart('')"
            class="text-black text-[20px] hover:-translate-y-1 hover:transition-all"
          >
            My Cart ({{ myCartPagination.totalElements }})
          </button>

          <!-- My Orders Button -->
          <button
            :style="
              toggleViewOrder
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewOrder"
            class="text-black text-[20px] hover:-translate-y-1 hover:transition-all"
          >
            My Orders ({{ orderPagination.totalElements }})
          </button>

          <!-- Profile Button -->
          <button
            :style="
              toggleViewProfile || toggleEditProfile
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnOpenProfile"
            class="text-black text-[20px] hover:-translate-y-1 hover:transition-all"
          >
            Profile
          </button>

          <!-- Transactions Button -->
          <button
            @click="openTransactions"
            class="text-black text-[20px] hover:-translate-y-1 hover:transition-all"
          >
            Transactions
          </button>
        </div>

        <!-- Sell Now Button -->
        <div class="mt-4 lg:mt-0 ms-4">
          <button
            @click="btnSellNow"
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-[#151515] text-[20px] mt-4 lg:mt-0 hover:bg-[#252424] hover:text-white hover:-translate-y-1 hover:transition-all"
          >
            Sell Now
          </button>
        </div>

        <!-- Logout Button -->
        <div class="mt-4 ms-4 me-4 lg:mt-0">
          <button @click="logout" class="hover:-translate-y-1 hover:transition-all">
            <img src="../assets/Images/icon-logout.png" alt="logout" class="w-8 h-8" />
          </button>
        </div>
      </div>
    </nav>

    <!-- toggleSellerRegistration-->
    <div v-if="toggleViewRegisterSeller">
      <div class="flex justify-center items-center">
        <div class="border h-screen w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl">
          <div class="flex text-[32px] font-semibold mb-4">Seller Registration</div>
          <div class="flex text-[32px] font-normal mb-4">
            Please fill out the necessary information
          </div>
          <el-form label-position="top" class="w-auto">
            <el-form-item label="Farm Name">
              <el-input
                v-model="form.farm.farmName"
                class="w-full rounded h-11"
                placeholder="Enter Farm name"
            /></el-form-item>
            <el-form-item label="Farm Address">
              <el-input
                v-model="form.farm.farmAddress"
                class="w-full rounded h-11"
                placeholder="Enter Address"
            /></el-form-item>
            <el-form-item label="Farm Description">
              <el-input
                v-model="form.farm.farmDescription"
                class="w-full rounded h-11"
                placeholder="Enter Description"
            /></el-form-item>
            <el-form-item class="mt-2" label="Attach your business permit here">
              <el-upload
                ref="uploader"
                v-model:file-list="fileList"
                action="getUploadTrigger"
                list-type="picture-card"
                :on-success="onSuccess"
                :on-preview="onPreview"
                :on-remove="onRemove"
                :before-upload="beforeUpload"
                method="get"
                accept="image/jpeg, image/png, image/jpg"
                :limit="1"
                :on-exceed="onExceed"
              >
                <i class="bi bi-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <div class="flex justify-center mt-10">
            <button
              @click="submitForm('Seller Application')"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- START ORDERS -->
    <div v-if="toggleViewOrder" class="flex flex-col w-full h-full justify-center items-center">
      <div class="flex justify-start w-full border-red-500 p-2">
        <button @click="btnViewHomePage" class="px-9">
          <i class="bi bi-arrow-left text-lg font-bold"></i>
        </button>
      </div>
      <el-table :data="orders" class="w-full min-w-max">
        <el-table-column label="Product Image" width="150">
          <template #default="scope">
            <el-button @click="btnViewProduct(scope.row)">
              <img :src="scope.row.productImage" class="w-20 h-20 object-cover" />
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="Product Name" prop="productName" width="150" />
        <el-table-column label="Total Amount" prop="totalAmount" width="100" />
        <el-table-column label="Payment Option" prop="paymentOption" width="150" />

        <el-table-column label="Total Kilo/s Bought">
          <template #default="scope">
            {{ `${scope.row.quantityBought} kilo/s bought` }}
          </template>
        </el-table-column>

        <el-table-column label="Seller" width="150">
          <template #default="scope">
            <img :src="scope.row.sellerImage" class="w-8 h-8 rounded-full inline-block mr-2" />
            {{ `${scope.row.sellerFirstname} ${scope.row.sellerLastname}` }}
          </template>
        </el-table-column>

        <el-table-column label="Delivery Date">
          <template #default="scope">
            {{ `${formatDate(scope.row.deliveryDate)}` }}
          </template>
        </el-table-column>

        <el-table-column label="Delivery Courier" prop="deliveryCourier" />
        <el-table-column label="Delivery Address" prop="deliveryAddress" />

        <el-table-column prop="orderStatus">
          <template #default="scope">
            <div v-if="scope.row.orderStatus == 'Pending'">
              <el-tag type="warning">Pending</el-tag>
            </div>
            <div v-else-if="scope.row.orderStatus == 'Approved'">
              <el-tag type="success">Approved</el-tag>
            </div>
            <div v-else-if="scope.row.orderStatus == 'Declined'">
              <el-tag type="danger">Declined</el-tag>
            </div>
            <div v-else-if="scope.row.orderStatus == 'Out for delivery'">
              <el-tag type="primary">Out for delivery</el-tag>
            </div>
            <div v-else-if="scope.row.orderStatus == 'Return and Refund'">
              <el-tag type="danger">Return and Refund</el-tag>
            </div>
            <div v-else-if="scope.row.orderStatus == 'Received'">
              <el-tag type="success">Completed</el-tag>
            </div>
            <div v-else>
              <el-tag type="success">Settled</el-tag>
            </div>
          </template>
          <template #header>
            <div class="flex">
              <el-input
                v-model="searchOrder"
                placeholder="Type to search order..."
                class="filterInput"
                clearable
                @clear="btnViewOrder()"
              />
              <el-button
                type="button"
                class="flex items-center justify-center ms-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                @click="btnViewOrder()"
              >
                <i class="bi bi-search"></i>
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column>
          <template #default="scope">
            <el-button
              @click="
                updateOrderStatus(
                  scope.row,
                  scope.row.sellerId,
                  scope.row.productId,
                  scope.row.orderId,
                  'Received'
                )
              "
              v-if="scope.row.orderStatus == 'Out for delivery'"
              >Order Received</el-button
            >
            <el-button
              type="danger"
              v-if="scope.row.orderStatus == 'Out for delivery'"
              @click="
                updateOrderStatus(
                  scope.row,
                  scope.row.sellerId,
                  scope.row.productId,
                  scope.row.orderId,
                  'Return and Refund'
                )
              "
              >Return and Refund</el-button
            >

            <el-button
              v-if="
                scope.row.orderStatus == 'Return and Refund' ||
                scope.row.orderStatus == 'Received' ||
                scope.row.orderStatus == 'Settle'
              "
              @click="openRateProduct(scope.row)"
              >Rate Product</el-button
            >
            <el-button @click="btnViewMessage(scope.row.sellerId)">Message Seller</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- END ORDERS -->

    <!-- MESSAGES -->
    <div v-if="toggleViewMessage">
      <div class="flex justify-center items-center p-4">
        <div
          class="border h-screen max-w-full sm:w-full md:w-2/3 lg:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl"
        >
          <!-- Back Button -->
          <button @click="btnViewContacts" class="px-9">
            <i class="bi bi-arrow-left text-lg font-bold"></i>
          </button>

          <!-- Message Title -->
          <div class="flex text-[28px] sm:text-[32px] font-semibold mb-4">Message</div>

          <!-- Message List -->
          <div class="overflow-y-scroll h-[70%]">
            <div v-for="(message, index) in messages" :key="index" class="mt-4 flex">
              <div v-if="message.buyerId == user.userId" class="flex justify-end w-full">
                <div class="flex items-end space-x-2">
                  <div class="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                    <div class="flex items-center">
                      <img
                        :src="message.buyerImage"
                        alt="buyer"
                        class="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <div class="text-[14px] font-semibold">{{ message.message }}</div>
                        <div class="text-[13px] text-[#ffffff]">
                          {{ formatDateTime(message.dateTimeCreated) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="flex justify-start w-full">
                <div class="flex items-end space-x-2">
                  <div class="bg-gray-200 p-2 rounded-lg max-w-xs">
                    <div class="flex items-center">
                      <img
                        style="cursor: pointer"
                        @click="
                          form.productDetails.sellerName = `${message.buyerFirstname} ${message.buyerLastname}`;
                          form.productDetails.sellerImage = message.buyerImage;
                          form.productDetails.sellerId = message.buyerId;
                          btnViewUserProfile();
                        "
                        :src="message.buyerImage"
                        alt="seller"
                        class="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <div class="text-[14px] font-semibold">{{ message.message }}</div>
                        <div class="text-[13px] text-[#717171]">
                          {{ formatDateTime(message.dateTimeCreated) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="flex items-center space-x-2 mt-4">
            <el-input
              :rows="3"
              v-model="message"
              type="textarea"
              placeholder="Message..."
              class="flex-grow"
            />
            <el-button class="whitespace-nowrap" type="primary" @click="sendMessage">
              Send
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- END MESSAGES -->

    <!-- START CONTACTS -->
    <div v-if="toggleViewContact">
      <div class="flex justify-center items-center p-4">
        <div
          class="border h-screen max-w-full sm:w-full md:w-2/3 lg:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl"
        >
          <!-- Contacts Title -->
          <div class="flex text-[28px] sm:text-[32px] font-semibold mb-4">Contacts</div>

          <!-- Contacts List -->
          <div class="overflow-y-scroll h-[70%]">
            <template v-if="contacts.length > 0">
              <div
                v-for="(contact, index) in contacts"
                @click="btnViewMessage(contact.sellerId)"
                :key="index"
                class="flex justify-between items-center mt-10 border-b pb-4 cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition duration-150 ease-in-out relative"
              >
                <div class="flex flex-row items-center">
                  <!-- Seller Image -->
                  <div class="flex flex-col">
                    <img :src="contact.sellerImage" alt="contact" class="w-16 h-16 rounded-full" />
                  </div>

                  <!-- Seller Name -->
                  <div class="flex flex-col ms-4">
                    <div class="text-[14px] font-semibold">
                      {{ `${contact.sellerFirstname} ${contact.sellerLastname}` }}
                    </div>
                  </div>
                </div>

                <!-- Delete Button -->
                <div class="flex">
                  <button class="text-xl z-10" @click.stop>
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="flex flex-col justify-center items-center h-full text-gray-500 text-lg font-medium"
              >
                <i class="bi bi-person-x text-4xl mb-2"></i>
                No contacts available at the moment.
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- END CONTACTS -->

    <!-- START HOME -->
    <div v-if="toggleViewHomePage">
      <!-- Home Section with background image -->
      <div
        class="flex flex-col w-full bg-[url('../assets/Images/cultivate-bg-home.png')] bg-no-repeat bg-cover border h-[500px] md:h-[600px]"
      >
        <div class="flex items-center justify-start w-[206px] h-[90px] p-4">
          <img
            src="../assets/Images/cultivatradeLogo.png"
            alt="Logo"
            class="w-full h-auto object-contain"
          />
        </div>
        <div class="flex flex-col p-4 md:ps-96">
          <div class="text-white flex flex-col md:scale-75">
            <div class="text-[24px] md:text-[36px] font-bold">
              Fresh from the Farm to Your Table
            </div>
            <div class="text-[16px] md:text-[24px] mt-5 md:w-9/12">
              Experience the taste of freshness with produce sourced directly from local farmers.
              Our marketplace connects you to the best fruits and vegetables, ensuring top quality
              while empowering our community growers. Enjoy the bounty of nature and support our
              local farmers.
            </div>
            <div>
              <button
                @click="btnViewAllProducts"
                class="p-4 mt-9 rounded bg-[#1A4D2E] text-white text-[14px] md:text-[16px] hover:bg-[#297346]"
              >
                Browse Produce
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- START PRODUCTS -->
      <div v-if="error">
        <el-empty>
          <el-button type="success" @click="getProduct('')">Reload Products</el-button>
        </el-empty>
      </div>
      <div
        v-loading="productLoading"
        v-else
        class="flex flex-col items-center justify-center p-5 bg-gray-50"
      >
        <div class="container w-full max-w-screen-xl">
          <div class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-extrabold text-[#1A4D2E]">Featured Products</h2>
            <p class="text-gray-600 mt-2 text-lg md:text-xl">
              Browse our freshest and most popular products available in the market
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div
              v-for="(product, index) in products"
              :key="index"
              class="rounded-lg shadow-lg overflow-hidden bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <!-- Boosted product label -->
              <div
                v-if="product.boostExpiration.length > 0 && product.isExpired == false"
                class="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-md"
              >
                <i class="bi bi-rocket"></i> Boosted
              </div>

              <!-- Report button -->
              <div class="absolute top-2 right-2 z-10">
                <el-button
                  link
                  @click="btnReportProduct(product)"
                  class="text-yellow-500 hover:text-yellow-700"
                >
                  <i class="bi bi-exclamation-triangle font-bold"></i>
                </el-button>
              </div>

              <!-- Product Image -->
              <img
                :src="product.productImage"
                alt="Product Image"
                class="w-full h-[200px] object-cover transition-all duration-500 ease-in-out transform hover:scale-105"
              />

              <!-- Product Info -->
              <div class="p-4">
                <div class="flex flex-col space-y-2">
                  <p class="text-lg font-semibold text-gray-800 truncate">
                    {{ product.productName }}
                  </p>
                  <p class="text-md text-gray-600">
                    {{ `${product.sellerFirstname} ${product.sellerLastname}` }}
                  </p>
                  <p class="text-green-500 text-lg">P{{ product.productPrice }} / kilo</p>
                </div>

                <div class="flex justify-end mt-4">
                  <button
                    @click="btnViewProduct(product)"
                    class="p-3 bg-[#008475] text-white rounded-full hover:bg-[#006f5f] transition duration-200"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- END PRODUCTS -->

      <!-- View All Products Button -->
      <div class="flex flex-row justify-center items-center mt-6 md:scale-75">
        <button @click="btnViewAllProducts" class="p-4 px-4 bg-[#1A4D2E] text-white rounded">
          View All Products
        </button>
      </div>
    </div>

    <el-dialog v-model="dialog.reportProduct">
      <div class="content-center text-[32px] font-semibold mb-2">Report Product</div>
      <hr />
      <div class="pt-10 pb-3">Provide a valid reason to report</div>
      <div>
        <el-form>
          <el-input
            type="textarea"
            :rows="5"
            v-model="reportProductData"
            placeholder="Report product.."
          />
          <div class="flex justify-center pt-10">
            <el-button type="danger" @click="submitReport">Submit Report</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- END HOME -->
  </div>

  <!-- START VIEW PRODUCT -->
  <div v-if="toggleViewProduct" class="flex flex-col w-full justify-center items-center px-4">
    <div class="flex justify-start w-full p-2">
      <button @click="btnViewHomePage" class="px-9">
        <i class="bi bi-arrow-left text-lg font-bold"></i>
      </button>
    </div>

    <!-- Start View Product -->
    <div
      class="flex flex-col md:flex-row justify-center w-full max-w-[1200px] bg-white shadow-md rounded-lg p-6 mb-10 space-y-6 md:space-y-0 md:space-x-6"
    >
      <!-- Product Images Section -->
      <div class="flex flex-col gap-4 p-4 md:w-1/3">
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="data in productImages"
            :key="data.productFileId"
            class="bg-gray-100 hover:shadow-lg p-2 rounded-md cursor-pointer"
            @click="viewImage(data.productImage)"
          >
            <img
              class="w-full h-[150px] object-cover rounded-md border border-gray-300"
              :src="data.productImage"
              alt="Product Image"
            />
          </div>
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="flex flex-col max-w-[600px] p-6 space-y-4">
        <!-- Product Name -->
        <h1 class="text-2xl font-bold text-gray-800">{{ form.productDetails.productName }}</h1>
        <!-- Seller Name -->
        <p class="text-sm text-gray-600 mb-4">By {{ form.productDetails.sellerName }}</p>

        <!-- Price and Status -->
        <div class="flex items-center gap-4 mt-2">
          <span
            class="px-3 py-1 text-lg font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-md"
          >
            Php{{ form.productDetails.productPrice }}
          </span>
          <span class="text-sm text-green-600 font-semibold">Recently Listed</span>
        </div>

        <!-- Description -->
        <p class="text-gray-700 mt-4 leading-relaxed text-sm">
          {{ form.productDetails.productDescription }}
        </p>

        <!-- Quantity -->
        <p class="text-gray-500 mt-2 text-sm">
          <strong>{{ form.productDetails.quantity }}</strong> kilo/s left
        </p>

        <!-- Purchase Actions -->
        <div class="flex flex-col sm:flex-row items-center mt-6 gap-4">
          <!-- Quantity Input -->
          <div class="flex flex-col text-sm font-medium items-center">
            <label for="quantity" class="mb-1 text-gray-600">Quantity</label>
            <el-form>
              <el-form-item>
                <el-input-number id="quantity" v-model="quantity" />
              </el-form-item>
            </el-form>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-2 w-full sm:w-auto">
            <button
              @click="checkQuantity('Add To Cart')"
              :class="
                quantity <= 0
                  ? 'bg-orange-200 rounded-md shadow hover:bg-orange-400 text-white px-4 py-2'
                  : 'bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow'
              "
              :disabled="quantity <= 0"
              class="w-full sm:w-auto"
            >
              Add To Cart
            </button>
            <button
              @click="checkQuantity('Buy Now')"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow w-full sm:w-auto"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End View Product -->

    <div class="flex flex-row border-b-2 w-full"></div>

    <div class="flex flex-col sm:flex-row justify-start gap-x-5 w-full p-4 items-center">
      <div class="flex flex-col">
        <img :src="form.productDetails.sellerImage" class="rounded-full h-[57px] w-[57px]" />
      </div>
      <div class="flex flex-col text-[36px] font-semibold">
        {{ form.productDetails.sellerName }}
      </div>
      <div class="flex flex-col text-[15px] font-medium">
        <button @click="btnViewUserProfile">View Profile</button>
      </div>
      <div class="flex flex-col text-[15px] font-medium">
        <button @click="btnViewMessage(form.productDetails.sellerId)">Message this seller</button>
      </div>
    </div>

    <div class="text-[36px] font-semibold mt-8 mb-4">Reviews</div>

    <div
      v-if="feedbacks && feedbacks.length > 0"
      class="flex flex-col gap-y-6 w-full max-w-[1200px]"
    >
      <div
        v-for="(feedback, index) in feedbacks"
        :key="index"
        class="flex flex-row gap-x-4 p-4 bg-[#F9F9F9] shadow-md rounded-md"
      >
        <!-- Buyer Image -->
        <div class="flex-shrink-0">
          <img
            :src="feedback.buyerImage"
            alt="Buyer Image"
            class="w-16 h-16 rounded-full border border-gray-300"
          />
        </div>

        <!-- Feedback Details -->
        <div class="flex flex-col flex-grow">
          <!-- Buyer Name and Date -->
          <div class="flex flex-row justify-between items-center">
            <div class="text-[18px] font-semibold text-gray-800">
              {{ feedback.buyerName }}
            </div>
            <div class="text-[13px] text-gray-500">
              {{ formatDateTime(feedback.dateTimeCreated) }}
            </div>
          </div>

          <!-- Rating -->
          <div class="mt-1">
            <el-rate v-model="feedback.rating" disabled class="text-[#F5A623]" />
          </div>

          <!-- Feedback Message -->
          <div class="mt-2 text-[14px] text-gray-700">
            {{ feedback.message }}
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback for No Reviews -->
    <div v-else class="text-[20px] text-gray-600 mt-4">
      No reviews yet. Be the first to leave feedback!
    </div>
  </div>
  <!-- END VIEW PRODUCT -->

  <!-- START MY CART -->
  <div v-if="toggleMyCart" class="flex flex-col w-full justify-center items-center">
    <!-- Back Button -->
    <div class="flex justify-start w-full border-red-500 p-2">
      <button @click="btnViewHomePage" class="px-9">
        <i class="bi bi-arrow-left text-lg font-bold"></i>
      </button>
    </div>

    <!-- Table -->
    <el-table
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
      :data="myCartProducts"
      class="w-full sm:w-auto"
    >
      <!-- Selection Column -->
      <el-table-column type="selection" width="55" />

      <!-- Product Image Column -->
      <el-table-column label="Product Image">
        <template #default="scope">
          <el-button @click="btnViewProduct(scope.row)">
            <img :src="scope.row.productImage" class="w-16 h-16 object-cover" />
          </el-button>
        </template>
      </el-table-column>

      <!-- Product Name Column -->
      <el-table-column label="Product Name" prop="productName" />

      <!-- Product Price Column -->
      <el-table-column label="Product Price" prop="productPrice" />

      <!-- Product Quantity Column -->
      <el-table-column label="Product Quantity">
        <template #default="scope">
          {{ `${scope.row.productQuantity} left` }}
        </template>
      </el-table-column>

      <!-- Product Expiration Date Column -->
      <el-table-column label="Product Expiration Date">
        <template #default="scope">
          {{ `${formatDate(scope.row.expiryDate)}` }}
        </template>
      </el-table-column>

      <el-table-column label="Seller" width="150">
        <template #default="scope">
          <img :src="scope.row.sellerImage" class="w-8 h-8 rounded-full inline-block mr-2" />
          {{ `${scope.row.sellerFirstname} ${scope.row.sellerLastname}` }}
        </template>
      </el-table-column>

      <el-table-column>
        <template #default="scope">
          <el-input-number
            v-model="scope.row.quantity"
            :min="1"
            @change="changeQuantityBought(scope.row.cartId, scope.row.quantity)"
          />
        </template>
      </el-table-column>

      <!-- Action Buttons Column -->
      <el-table-column label="" align="right">
        <template #header>
          <div class="flex items-center justify-between">
            <el-input
              v-model="searchMyCartProduct"
              placeholder="Type to search product..."
              class="filterInput w-full sm:w-1/3 md:w-1/4 lg:w-1/4"
              clearable
              @clear="btnMyCart('')"
            />
            <el-button
              type="button"
              class="flex justify-start ms-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              @click="btnMyCart(searchMyCartProduct)"
            >
              <i class="bi bi-search"></i>
            </el-button>
          </div>
        </template>

        <template #default="scope">
          <!-- <el-button
            @click="checkQuantity('Change Cart Quantity', scope.row)"
            class="w-full sm:w-auto"
          >
            Quantity</el-button
          > -->
          <el-button @click="checkQuantity('Buy Now from Cart', scope.row)" class="w-full sm:w-auto"
            >Buy Now</el-button
          >
          <el-button
            type="danger"
            @click="submitForm('Delete Cart', scope.row)"
            class="w-full sm:w-auto"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- Change product quantity -->
    <el-dialog
      v-model="dialog.changeQuantity"
      title="Change Quantity"
      width="90%"
      :before-close="closeDialog"
      class="sm:max-w-md"
    >
      <div
        class="flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-6 space-y-4 sm:space-y-0"
      >
        <!-- Quantity Input -->
        <el-input-number
          v-model="quantity"
          :min="1"
          :max="maxQuantity"
          :step="1"
          controls-position="right"
          class="w-24 text-center border border-gray-300 rounded-lg"
        />
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end mt-6 space-x-4">
        <el-button
          size="large"
          @click="closeDialog"
          class="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </el-button>
        <el-button
          size="large"
          type="primary"
          @click="confirmQuantityChange"
          class="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <!-- Buy Selected Products Button -->
    <div class="pt-2 w-full flex justify-end">
      <el-button
        @click="checkQuantity('Buy Selected Products', searchMyCartProduct)"
        type="primary"
        v-if="multipleSelection.length > 0"
        class="w-full sm:w-auto"
      >
        Buy Selected Products
      </el-button>
    </div>
  </div>
  <!-- END MY CART -->

  <!-- END MY CART -->

  <!-- START HOME PRODUCT -->
  <div v-loading="productLoading" v-if="toggleViewAllProducts">
    <!-- Search Bar -->
    <el-form class="flex justify-end items-center mb-6 p-4 bg-white rounded-lg shadow-lg">
      <div class="flex items-center space-x-4">
        <el-input
          v-model="searchProduct"
          placeholder="Search for products..."
          class="filterInput py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          clearable
          @clear="getProduct('')"
          :style="{ width: 'auto', maxWidth: '350px' }"
        />
        <el-button
          type="button"
          class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          @click="getProduct(searchProduct)"
        >
          <i class="bi bi-search"></i>
        </el-button>
      </div>
    </el-form>

    <!-- Product Grid -->
    <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105"
      >
        <!-- Boosted Product -->
        <div
          v-if="product.boostExpiration.length > 0 && product.isExpired == false"
          class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs rounded-full shadow-md"
        >
          <i class="bi bi-rocket"></i> Boosted
        </div>

        <!-- Report Button -->
        <div class="flex justify-end absolute top-2 right-2">
          <el-button
            link
            @click="btnReportProduct(product)"
            class="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500"
          >
            <i class="bi bi-exclamation-triangle text-lg font-bold"></i>
          </el-button>
        </div>

        <!-- Product Image -->
        <img
          :src="product.productImage"
          alt="Product Image"
          class="w-full h-48 object-cover rounded-t-xl"
        />

        <!-- Product Info -->
        <div class="p-4">
          <div class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
            <div class="flex flex-col space-y-2 sm:space-y-0">
              <p class="text-lg font-semibold text-gray-800">{{ product.productName }}</p>
              <p class="text-md text-gray-600">
                {{ `${product.sellerFirstname} ${product.sellerLastname}` }}
              </p>
              <p class="text-green-600 font-semibold">P{{ product.productPrice }} / kilo</p>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-x-4 mt-2 sm:mt-0">
              <p class="text-sm text-gray-500">Expiry: {{ formatDate(product.expiryDate) }}</p>
              <button
                @click="btnViewProduct(product)"
                class="mt-3 sm:mt-0 px-4 py-2 bg-[#008475] text-white rounded-lg shadow-md hover:bg-[#006f59] transition-all duration-300"
              >
                <i class="bi bi-plus-lg text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-10">
      <el-card class="shadow-lg rounded-lg">
        <el-pagination
          v-model:current-page="productPagination.currentPage"
          v-model:page-size="productPagination.elementsPerPage"
          layout="prev, pager, next, jumper"
          :total="productPagination.totalElements"
          @size-change="getProduct('')"
          @current-change="getProduct('')"
          class="bg-white p-4 rounded-lg shadow-md"
        />
      </el-card>
    </div>
  </div>
  <!-- END HOME PRODUCT -->

  <!-- START NOTIFICATION -->
  <div v-if="toggleViewAllNotification">
    <div class="flex justify-center items-center p-4">
      <div
        class="border h-screen max-w-full sm:w-full md:w-2/3 lg:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl"
      >
        <!-- Notification Title -->
        <div class="flex text-[28px] sm:text-[32px] font-semibold mb-4">Notification</div>

        <!-- Notification List -->
        <div class="overflow-y-scroll h-[70%]">
          <template v-if="notifications.length > 0">
            <div
              v-for="notification in notifications"
              :key="notification.notificationId"
              class="flex justify-between items-center mt-10 border-b pb-4 cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition duration-150 ease-in-out relative"
            >
              <div class="flex flex-row items-center">
                <!-- Seller Image -->
                <div class="flex flex-col">
                  <div v-if="notification.sellerImage != null">
                    <img
                      @click="btnViewOrder()"
                      :src="notification.sellerImage"
                      alt="notification"
                      class="w-16 h-16 rounded-full"
                    />
                  </div>
                </div>

                <!-- Notification Details -->
                <div class="flex flex-col ms-4">
                  <div class="text-[14px] font-semibold">
                    <div
                      v-if="
                        notification.message ==
                        'Product bought waiting for seller to prepare your order'
                      "
                    >
                      {{
                        `${notification.sellerFirstname} ${notification.sellerLastname} is preparing your ${notification.productName} order`
                      }}
                    </div>
                    <div v-else-if="notification.message == 'Receive your product'">
                      {{
                        `You have successfully received ${notification.productName} from ${notification.sellerFirstname} ${notification.sellerLastname}`
                      }}
                    </div>
                    <div v-else-if="notification.message == 'Return and Refund'">
                      {{
                        `You have requested return and refund on ${notification.productName} from ${notification.sellerFirstname} ${notification.sellerLastname}`
                      }}
                    </div>
                  </div>
                  <div class="text-[13px] text-[#717171]">
                    Quantity Bought: {{ notification.quantityBought }} kilo/s
                  </div>
                  <div class="text-[13px] text-[#717171]">
                    Total Amount: P{{ notification.totalAmount }}
                  </div>
                </div>
              </div>
              <div class="flex">
                <!-- Delete Button (optional) -->
                <!-- <button
                type="button"
                class="text-xl z-10"
                @click="deleteNotification(notification.notificationId)"
              >
                <i class="bi bi-x-lg"></i>
              </button> -->
              </div>
            </div>
          </template>
          <template v-else>
            <div
              class="flex flex-col justify-center items-center h-full text-gray-500 text-lg font-medium"
            >
              <i class="bi bi-bell-slash-fill text-4xl mb-2"></i>
              No new notification
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- END NOTIFICATION -->

  <!-- START VIEW SELLER PROFILE -->
  <div v-if="toggleViewUserProfile">
    <div class="flex justify-center items-center">
      <div class="border h-screen sm:w-full md:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl">
        <div class="flex text-[28px] sm:text-[24px] font-semibold mb-4">
          {{ userProducts[0].farmName }}
        </div>
        <img :src="userProducts[0].businessPermitImage" width="500" />
        <!-- Seller Info Section -->
        <div class="flex flex-col sm:flex-row justify-start gap-x-5 w-full p-4 items-center">
          <div class="flex flex-col mb-4 sm:mb-0">
            <img :src="form.productDetails.sellerImage" class="rounded-full h-[57px] w-[57px]" />
          </div>
          <div class="flex flex-col text-[32px] sm:text-[28px] font-semibold">
            {{ form.productDetails.sellerName }}
          </div>
          <div class="flex flex-col text-[15px] font-medium">
            <button @click="btnViewMessage(form.productDetails.sellerId)">
              Message this seller
            </button>
          </div>
        </div>

        <!-- START USER PRODUCTS -->
        <div class="overflow-y-scroll sm:h-auto h-[70%] max-h-[400px]">
          <div
            v-for="userProduct in userProducts"
            :key="userProduct.productId"
            class="flex justify-between items-center mt-10 border-b pb-4 cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition duration-150 ease-in-out relative"
          >
            <div class="flex flex-row items-center">
              <div class="flex flex-col">
                <img
                  :src="userProduct.productImage"
                  alt="notification"
                  class="w-16 h-16 rounded-full"
                />
              </div>
              <div class="flex flex-col ms-4">
                <div class="text-[14px] font-semibold">{{ userProduct.productName }}</div>
                <div class="text-[13px] text-[#717171]">P{{ userProduct.productPrice }}</div>
              </div>
            </div>
            <p class="text-sm">{{ userProduct.quantity }} kilo/s left</p>
            <div class="flex">
              <button
                @click="btnViewProduct(userProduct)"
                class="p-2 bg-[#008475] text-white rounded w-8 h-8 flex items-center justify-center"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
        </div>
        <!-- END USER PRODUCTS -->
      </div>
    </div>
  </div>
  <!-- END VIEW SELLER PROFILE -->

  <!-- START VIEW PROFILE -->
  <div v-if="toggleViewProfile">
    <div class="flex w-100 bg-[#508D4E] h-[326px] opacity-[77px]">
      <div class="flex justify-center items-center w-full">
        <img
          :src="user.profileDataUrl"
          alt="profile"
          height="200"
          width="200"
          class="rounded-full translate-y-32"
        />
      </div>
    </div>
    <div class="flex flex-row justify-between items-center px-5">
      <div class="flex flex-col text-[64px] font-semibold">
        {{ `${user.firstname} ${user.lastname}` }}
      </div>
      <div class="flex flex-col justify-center">
        <button @click="btnEditProfile" class="rounded p-2 px-4 border border-black">
          Edit Profile
        </button>
      </div>
    </div>
    <div class="p-5">
      <div class="flex flex-row text-[40px] opacity-[69%]">Email: {{ user.email }}</div>
      <div class="flex flex-row text-[40px] opacity-[69%] mt-10">
        Contact Number::{{ user.phone }}
      </div>
      <div class="flex flex-row text-[40px] opacity-[69%] mt-10">Address: {{ user.address }}</div>
    </div>
  </div>
  <!-- END VIEW PROFILE -->

  <!-- START EDIT PROFILE -->
  <div v-if="toggleEditProfile">
    <div class="flex justify-center items-center">
      <div class="border h-screen w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl">
        <div class="flex flex-row justify-between">
          <div class="flex flex-col text-[45px] font-semibold">Edit Profile</div>
          <div class="flex flex-col justify-center items-center">
            <div class="flex flex-row justify-center items-center gap-x-2">
              <div class="flex flex-col">
                <el-upload
                  v-model:file-list="fileList"
                  action="getUploadTrigger"
                  :on-success="onSuccess"
                  :on-preview="onPreview"
                  :on-remove="onRemove"
                  :before-upload="beforeUpload"
                  :limit="1"
                  :on-exceed="handleExceed"
                  method="get"
                  accept="image/jpeg, image/png, image/jpg"
                >
                  <el-button type="primary">Click to upload</el-button>
                  <template #tip>
                    <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
                  </template>
                </el-upload>
              </div>
              <div class="flex flex-col">
                <img
                  :src="user.profileDataUrl"
                  alt="sampleImage"
                  class="rounded-full w-[120px] h-[120px]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- el-form starts here -->
        <el-form label-position="top" class="mt-8">
          <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-[26px]">
            <el-form-item label="First Name">
              <el-input v-model="form.firstname" class="h-[50px]" maxlength="50" show-word-limit />
            </el-form-item>
            <el-form-item label="Last Name">
              <el-input v-model="form.lastname" class="h-[50px]" maxlength="50" show-word-limit />
            </el-form-item>
            <el-form-item label="Email" class="col-span-2">
              <el-input :disabled="true" v-model="form.email" class="h-[50px]" />
            </el-form-item>
            <el-form-item label="Address" class="col-span-2">
              <el-input v-model="form.address" class="h-[50px]" />
            </el-form-item>
            <el-form-item label="Contact Number" class="col-span-2" maxlength="11" show-word-limit>
              <el-input v-model="form.phone" class="h-[50px]" />
            </el-form-item>
            <el-form-item>
              <el-button @click="changePassword">Change Password</el-button>
            </el-form-item>
            <div v-if="isChangePassword">
              <el-form-item label="New Password">
                <el-input v-model="form.password1" type="password" class="h-[50px]" show-password />
              </el-form-item>
              <el-form-item label="Confirm New Password">
                <el-input v-model="form.password2" type="password" class="h-[50px]" show-password />
              </el-form-item>
            </div>
          </div>

          <div>
            <el-button @click="submitForm()" type="primary">Confirm</el-button>
          </div>
        </el-form>
        <!-- el-form ends here -->
      </div>
    </div>
  </div>
  <!-- END EDIT PROFILE -->

  <!-- START PREVIEW IMAGE DIALOG -->
  <el-dialog v-modelel-dialog="dialog.previewImage" :before-close="clear">
    <div class="content-center">
      <img :src="previewImg" style="width: 300px" />
    </div>
  </el-dialog>
  <!-- END PREVIEW IMAGE DIALOG -->

  <!-- START CHECKOUT -->
  <el-dialog title="Checkout" v-model="dialog.checkOut" :before-close="clear">
    <el-form label-position="top">
      <el-form-item label="Delivery Address">
        <el-radio-group @change="handleAddressChange" v-model="deliveryAddress">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="(userAddress, index) in userAddresses"
              :key="index"
              class="flex flex-col items-start p-2"
            >
              <div class="border p-2">
                <!-- Radio Button -->
                <el-radio :value="userAddress.address" size="large" :label="userAddress.address" />

                <div class="flex space-x-4 mt-2">
                  <el-button
                    link
                    type="primary"
                    @click="openForm(userAddress, 'Edit')"
                    class="flex-shrink-0"
                  >
                    Edit
                  </el-button>
                  <el-popconfirm
                    @confirm="openForm(userAddress, 'Delete')"
                    title="Do you want to delete this address?"
                  >
                    <template #reference>
                      <el-button link type="danger" class="flex-shrink-0"> Delete </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </div>
          </div>
          <div class="p-2">
            <!-- Add Address Button -->
            <el-button @click="openForm([], 'Add')" class="mt-4 block"> Add Address </el-button>
          </div>
        </el-radio-group>
      </el-form-item>
      <div class="p-2">
        <el-form-item label="Payment Option">
          <el-radio-group :disabled="deliveryAddress == ''" v-model="paymentOption">
            <el-radio-button :value="'Cash on delivery'" size="large" label="Cash on delivery" />
            <el-radio-button
              @click="handleOrderSelection"
              :value="'Online payment'"
              size="large"
              label="Online payment"
            />
            <el-radio-button :value="'Pick up'" size="large" label="Pick up" />
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    {{ toggleMyCart }}
    {{ multipleSelection.length }}
    <template #footer>
      <div v-if="paymentOption == 'Cash on delivery' || paymentOption == 'Pick up'">
        <el-button :disabled="deliveryAddress == ''" type="primary" @click="submitForm('Buy Now')"
          >Confirm</el-button
        >
      </div>
      <div v-else-if="paymentOption == 'Online payment'">
        <div
          v-if="
            (!toggleMyCart && multipleSelection.length <= 0) ||
            (toggleMyCart && multipleSelection.length <= 0)
          "
        >
          <CheckoutPayment :order="order" @done="success()" />
        </div>
        <div v-else-if="toggleMyCart && multipleSelection.length > 0">
          <CheckoutPaymentMultiple
            v-show="toggleMyCart && multipleSelection.length > 0"
            :order="multipleOrder"
            @done="success()"
          />
        </div>
      </div>
    </template>
  </el-dialog>
  <!-- END CHECKOUT -->

  <!-- START EDIT ADDRESS -->
  <el-dialog :title="title" v-model="dialog.userAddress">
    <el-form>
      <el-form-item>
        <el-input v-model="userAddress" />
      </el-form-item>
      <div>
        <el-button @click="submitUserAddress">Confirm</el-button>
      </div>
    </el-form>
  </el-dialog>
  <!-- END EDIT ADDRESS -->

  <!-- START PREVIEW IMAGE DIALOG -->
  <el-dialog v-model="dialog.previewImage" :before-close="clear">
    <div class="content-center">
      <div>
        <img :src="previewImg" style="width: 300px" />
      </div>
    </div>
  </el-dialog>
  <!-- END PREVIEW IMAGE DIALOG -->

  <!-- START TRANSACTION -->
  <el-dialog v-model="dialog.transaction" :before-close="clear">
    <div class="content-center">
      <el-table :data="transactions">
        <el-table-column label="Product Image">
          <template #default="scope">
            <img :src="scope.row.productFile" />
          </template>
        </el-table-column>
        <el-table-column label="Product Name" prop="productName" />
        <el-table-column label="Payment Option" prop="paymentSource" />
        <el-table-column label="Payment Code" prop="paymentCode" />
        <el-table-column label="Total Paid" prop="totalAmount" />
        <el-table-column label="Transaction Date" prop="totalAmount">
          <template #default="scope">
            {{ formatDateTime(scope.row.dateTimeCreated) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <!-- END TRANSACTION -->

  <!-- START RATE PRODUCT -->
  <el-dialog title="Rate Product" v-model="dialog.rateProduct" :before-close="clear">
    <div class="content-center">
      <el-form>
        <el-form-item label="Rating">
          <el-rate v-model="rate.rating" />
        </el-form-item>
        <el-form-item label="Message">
          <el-input type="textarea" v-model="rate.message" />
        </el-form-item>
        <div>
          <el-button @click="rateProduct()">Confirm</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
  <!-- END RATE PRODUCT -->
</template>

<script>
import router from '@/router';

import { ElMessage, ElLoading } from 'element-plus';
import axios from 'axios';
import CheckoutPayment from '@/components/CheckoutPayment.vue';
import CheckoutPaymentMultiple from '@/components/CheckoutPaymentMultiple.vue';

export default {
  components: { CheckoutPayment, CheckoutPaymentMultiple },
  data() {
    return {
      cartId: '',
      quantityBought: '',
      multipleOrder: [],
      multipleSelection: [],
      title: '',
      userAddressId: '',
      userAddress: '',
      userAddresses: [],
      productId: '',
      feedbacks: [],
      totalNotifications: 0,
      order: {},
      totalAmount: 0,
      deliveryAddress: '',
      paymentOption: 'Cash on delivery',
      sellerId: '',
      message: '',
      previewImg: '',
      contacts: [],
      messages: [],
      products: [],
      orders: [],
      userProducts: [],
      myCartProducts: [],
      fileList: [],
      file: [],
      productImages: [],
      notifications: [],
      transactions: [],
      reportProductData: '',
      dialog: {
        previewImage: false,
        checkOut: false,
        transaction: false,
        rateProdict: false,
        reportProduct: false,
        userAddress: false,
        changeQuantity: false,
      },
      user: {},
      orderPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0,
      },
      productPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0,
      },

      myCartPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0,
      },
      searchMyCartProduct: '',
      searchProduct: '',
      searchOrder: '',
      rate: {
        productId: '',
        rating: '',
        message: '',
      },
      isChangePassword: false,
      form: {
        firstname: '',
        lastname: '',
        email: '',
        address: '',
        phone: '',
        password1: '',
        password2: '',

        product: {},
        productDetails: {
          buyerId: '',
          productId: '',
          quantity: '',
          productName: '',
          productDescription: '',
          productPrice: '',
          sellerId: '',
          sellerName: '',
          sellerImage: '',
          sellerEmail: '',
          sellerPhone: '',
          sellerAddress: '',
        },
        farm: {
          farmName: '',
          farmAddress: '',
          farmDescription: '',
        },
      },

      quantity: 0,

      toggleViewHomePage: true,
      toggleViewProduct: false,
      toggleViewAllProducts: false,
      toggleViewAllNotification: false,
      toggleOrderUpdate: false,
      toggleEditProfile: false,
      toggleMyCart: false,
      toggleViewUserProfile: false,
      toggleViewContact: false,
      toggleViewMessage: false,
      toggleViewOrder: false,

      toggleViewProfile: false,

      formData: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        contactNumber: '',
        city: '',
        password: '',
      },

      // contactLoading: false,
      // messageLoading: false,
      productLoading: false,
      error: false,
    };
  },
  methods: {
    success() {
      this.btnViewOrder();
      this.getMyCart('');
      this.dialog.checkOut = false;
    },
    changeQuantityBought(cartId, quantity) {
      console.log(cartId);
      console.log(quantity);
      axios.put(`${this.url}/Cart/${cartId}/Quantity/${quantity}`).then(() => {
        //
      });
    },
    handleSelectionChange(data) {
      this.multipleSelection = data;
      console.log(this.multipleSelection);
    },
    submitUserAddress() {
      if (this.title == 'Add Address') {
        const payload = {
          userId: this.user.userId,
          address: this.userAddress,
        };
        axios.post(`${this.url}/UserAddress`, payload).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Address updated successfully');
            this.getUserAddress();
            this.dialog.userAddress = false;
          } else {
            ElMessage.error('Failed to update address');
          }
        });
        return;
      }
      if (this.title == 'Edit Address') {
        const payload = {
          address: this.userAddress,
        };
        axios.put(`${this.url}/UserAddress/${this.userAddressId}`, payload).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Address updated successfully');
            this.getUserAddress();
            this.dialog.userAddress = false;
          } else {
            ElMessage.error('Failed to update address');
          }
        });
        return;
      }
    },
    openForm(data, title) {
      console.log(this.userAddressId);
      if (title == 'Add') {
        this.title = 'Add Address';
        this.dialog.userAddress = true;
        return;
      }
      if (title == 'Edit') {
        this.title = 'Edit Address';
        this.userAddress = data.address;
        this.userAddressId = data.userAddressId;
        this.dialog.userAddress = true;

        return;
      }
      if (title == 'Delete') {
        axios.delete(`${this.url}/UserAddress/${data.userAddressId}`).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Address deleted successfully');
            this.getUserAddress();
          } else {
            ElMessage.error('Failed to delete address');
          }
        });
        return;
      }
    },
    getUserAddress() {
      axios.get(`${this.url}/UserAddress/${this.user.userId}`).then((response) => {
        this.userAddresses = response.data;
      });
    },
    viewImage(image) {
      this.previewImg = image;
      this.dialog.previewImage = true;
    },
    submitReport() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const payload = {
        productId: this.productId,
        reason: this.reportProductData,
        buyerId: this.user.userId,
      };
      axios
        .get(`${this.url}/Report/User/${this.user.userId}/Product/${this.productId}`)
        .then((response) => {
          if (response.data == 'error') {
            ElMessage.error('You have already reported this product');
            this.dialog.reportProduct = false;
            loading.close();
          } else {
            axios.post(`${this.url}/Report`, payload).then((response) => {
              if (response.data == 'success') {
                ElMessage.success('Report submitted successfully');
                this.reportProductData = '';
                this.getProduct('');
              } else {
                ElMessage.error('Failed to report product');
              }
              loading.close();
              this.dialog.reportProduct = false;
            });
          }
        });
    },
    btnReportProduct(data) {
      this.dialog.reportProduct = true;
      this.productId = data.productId;
    },
    openRateProduct(data) {
      this.rate.productId = data.productId;
      this.dialog.rateProduct = true;
    },
    //

    rateProduct() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(`${this.url}/Feedback/User/${this.user.userId}/Product/${this.rate.productId}`)
        .then((response) => {
          if (response.data == 'error') {
            ElMessage.error('You already rated this product');
            loading.close();
          } else {
            const payload = {
              productId: this.rate.productId,
              buyerId: this.user.userId,
              rating: this.rate.rating,
              message: this.rate.message,
            };
            axios.post(`${this.url}/Feedback`, payload).then((response) => {
              if (response.data == 'success') {
                ElMessage.success('Product rated successfully');
                loading.close();
                this.clear();
              } else {
                ElMessage.error('Failed to rate product');
                loading.close();
                this.clear();
              }
            });
          }
        });
    },

    // DELETE NOTIFICATION
    deleteNotification(notificationId) {
      axios.delete(`${this.url}/Notification/${notificationId}`).then(() => {
        this.getNotificationByUserId();
        this.getTotalNotifications();
      });
    },
    getTotalNotifications() {
      axios
        .get(`${this.url}/Notification/${this.user.userId}/Buyer?isPaginated=true`)
        .then((response) => {
          this.totalNotifications = response.data.totalElements;
        });
    },
    openTransactions() {
      this.dialog.transaction = true;
      axios.get(`${this.url}/Payment/${this.user.userId}`).then((response) => {
        this.transactions = response.data;
        // console.log(this.transactions);
      });
    },

    disabledDate(time) {
      const date = new Date();
      const previousDate = date.setDate(date.getDate() - 1);
      return time.getTime() < previousDate;
    },
    // GET SELLER PRODUCTS
    getSellerProduct() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Product/User/${this.form.productDetails.sellerId}?search=&currentPage=${this.productPagination.currentPage}&elementsPerPage=${this.productPagination.elementsPerPage}`
        )
        .then((response) => {
          this.userProducts = response.data.results;
          loading.close();
          this.clear();
          // console.log('PRODUCTS: ', this.products);
          // this.productPagination.totalElements = response.data.totalElements;
        });
    },

    // VIEW ORDER
    btnViewOrder() {
      this.quantity = 0;

      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Order?search=${this.searchOrder}&buyerId=${this.user.userId}&currentPage=${this.orderPagination.currentPage}&elementsPerPage=${this.orderPagination.elementsPerPage}`
        )
        .then((response) => {
          this.orders = response.data.results;
          this.orderPagination.totalElements = response.data.totalElements;
          this.getOrdersByUserId();
          this.toggleViewOrder = true;
          this.toggleViewMessage = false;
          this.toggleViewContact = false;
          this.toggleViewUserProfile = false;
          this.toggleViewRegisterSeller = false;
          this.toggleViewProduct = false;
          this.toggleViewProfile = false;
          this.toggleViewAllNotification = false;
          this.toggleViewAllProducts = false;
          this.toggleViewHomePage = false;
          this.toggleEditProfile = false;
          this.toggleMyCart = false;
          loading.close();
        });
    },

    getOrdersByUserId() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Order?search=${this.searchOrder}&buyerId=${this.user.userId}&currentPage=${this.orderPagination.currentPage}&elementsPerPage=${this.orderPagination.elementsPerPage}`
        )
        .then((response) => {
          this.orders = response.data.results;
          this.orderPagination.totalElements = response.data.totalElements;
          loading.close();
        });
    },

    // VIEW ORDER
    // btnViewOrder() {
    //   this.getOrdersByUserId();
    //   this.toggleViewOrder = true;
    //   this.toggleViewMessage = false;
    //   this.toggleViewContact = false;
    //   this.toggleViewUserProfile = false;
    //   this.toggleViewRegisterSeller = false;
    //   this.toggleViewProduct = false;
    //   this.toggleViewProfile = false;
    //   this.toggleViewAllNotification = false;
    //   this.toggleViewAllProducts = false;
    //   this.toggleViewHomePage = false;
    //   this.toggleEditProfile = false;
    //   this.toggleMyCart = false;
    // },

    // VIEW MESSAGE
    btnViewMessage(sellerId) {
      this.quantity = 0;

      this.toggleViewOrder = false;

      this.messageLoading = true; // LOADING
      this.viewMessage(sellerId);
      this.toggleViewMessage = true;
      this.toggleViewContact = false;
      this.toggleViewUserProfile = false;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewProfile = false;
      this.toggleViewAllNotification = false;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // VIEW CONTACTS
    btnViewContacts() {
      this.quantity = 0;

      // this.contactLoading = true; // LOADING
      this.toggleViewOrder = false;
      this.sellerId = '';
      this.getContact();
      this.toggleViewContact = true;
      this.toggleViewMessage = false;
      this.toggleViewUserProfile = false;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewProfile = false;
      this.toggleViewAllNotification = false;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // VIEW SELLER PROFILE
    btnViewUserProfile() {
      this.quantity = 0;

      this.sellerId = '';
      this.toggleViewOrder = false;
      this.getSellerProduct();
      this.toggleViewMessage = false;

      this.toggleViewContact = false;
      this.toggleViewUserProfile = true;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewProfile = false;
      this.toggleViewAllNotification = false;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // VIEW ALL PRODUCTS
    btnViewAllProducts() {
      this.quantity = 0;
      this.getProduct('');
      this.sellerId = '';
      this.toggleViewOrder = false;
      this.toggleViewMessage = false;

      this.toggleViewUserProfile = false;
      this.toggleViewProduct = false;
      this.toggleViewAllProducts = true;
      this.toggleViewHomePage = false;
      this.toggleViewAllNotification = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // SELLER APPLICATION
    btnSellNow() {
      this.quantity = 0;

      this.toggleViewOrder = false;
      this.sellerId = '';
      this.toggleViewMessage = false;

      this.toggleViewUserProfile = false;
      this.toggleViewContact = false;
      this.toggleViewRegisterSeller = true;
      this.toggleViewProduct = false;
      this.toggleViewProfile = false;
      this.toggleViewAllNotification = false;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // VIEW NOTIFICATION
    btnViewAllNotifications() {
      this.quantity = 0;

      this.getTotalNotifications();
      this.toggleViewOrder = false;

      this.sellerId = '';
      this.toggleViewMessage = false;

      this.getNotificationByUserId();
      this.toggleViewUserProfile = false;
      this.toggleViewContact = false;

      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewProfile = false;
      this.toggleViewAllNotification = true;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // HOME
    btnViewHomePage() {
      this.quantity = 0;
      this.toggleViewOrder = false;
      this.sellerId = '';
      this.title = '';
      this.fileList = [];
      this.file = [];
      this.getProduct('');
      this.toggleViewUserProfile = false;
      this.toggleViewContact = false;
      this.toggleViewMessage = false;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewHomePage = true;
      this.toggleViewAllNotification = false;
      this.toggleViewAllProducts = false;
      this.toggleViewProfile = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // PROFILE
    btnOpenProfile() {
      this.quantity = 0;

      this.getUser();
      this.toggleViewOrder = false;
      this.sellerId = '';
      this.title = '';
      this.fileList = [];
      this.file = [];
      this.toggleViewMessage = false;
      this.toggleViewUserProfile = false;
      this.toggleViewContact = false;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewProfile = true;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleOrderUpdate = false;
      this.toggleViewAllNotification = false;
      this.toggleEditProfile = false;
      this.toggleMyCart = false;
    },

    // EDIT PROFILE
    btnEditProfile() {
      this.quantity = 0;

      this.toggleViewOrder = false;
      this.sellerId = '';
      this.title = 'Update User';
      // console.log(this.title);
      this.fileList = [];
      this.file = [];
      this.form.firstname = this.user.firstname;
      this.form.lastname = this.user.lastname;
      this.form.email = this.user.email;
      this.form.address = this.user.address;
      this.form.phone = this.user.phone;

      this.toggleViewContact = false;
      this.toggleViewMessage = false;
      this.toggleViewProfile = false;
      this.toggleEditProfile = true;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleOrderUpdate = false;
      this.toggleViewAllNotification = false;
    },

    // VIEW PRODUCT
    btnViewProduct(data) {
      this.feedbacks = data.feedbacks;
      this.toggleViewOrder = false;
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.sellerId = '';

      axios
        .get(`${this.url}/ProductFile/Product/${data.productId}`)
        .then((response) => {
          this.productImages = response.data;
          loading.close();
        })
        .catch(() => {
          ElMessage.error('An Error occured');
          loading.close();
        });

      this.form.productDetails.buyerId = this.user.userId;
      this.form.productDetails.productId = data.productId;
      this.form.productDetails.productName = data.productName;
      this.form.productDetails.productDescription = data.productDescription;
      this.form.productDetails.productPrice = data.productPrice;
      this.form.productDetails.sellerId = data.sellerId;
      this.form.productDetails.sellerName = `${data.sellerFirstname} ${data.sellerLastname}`;
      this.form.productDetails.sellerImage = data.sellerImage;
      this.form.productDetails.sellerEmail = data.sellerEmail;
      this.form.productDetails.sellerPhone = data.sellerPhone;
      this.form.productDetails.sellerAddress = data.sellerAddress;
      this.form.productDetails.quantity = data.quantity;

      this.toggleViewMessage = false;
      this.toggleViewUserProfile = false;
      this.toggleViewContact = false;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = true;
      this.toggleViewProfile = false;
      this.toggleEditProfile = false;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleOrderUpdate = false;
      this.toggleViewAllNotification = false;
      this.toggleMyCart = false;
    },

    // VIEW MY CART
    btnMyCart(data) {
      this.toggleViewOrder = false;
      this.sellerId = '';
      this.toggleViewMessage = false;
      this.toggleViewUserProfile = false;
      this.getMyCart(data);
      this.toggleViewContact = false;
      this.toggleMyCart = true;
      this.toggleViewRegisterSeller = false;
      this.toggleViewProduct = false;
      this.toggleViewProfile = false;
      this.toggleEditProfile = false;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleOrderUpdate = false;
      this.toggleViewAllNotification = false;
    },

    getMyCart(data) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Cart/${this.user.userId}?search=${data}&currentPage=${this.myCartPagination.currentPage}&elementsPerPage=${this.myCartPagination.elementsPerPage}`
        )
        .then((response) => {
          this.myCartProducts = response.data.results;
          this.myCartPagination.totalElements = response.data.totalElements;
          loading.close();
        });
    },

    handleOrderSelection() {
      if (this.multipleSelection.length > 0) {
        this.getMultipleOrder();
      } else {
        this.getOrderData();
      }
    },

    // Method for handling multiple orders
    getMultipleOrder() {
      console.log('Processing multiple orders...');
      this.multipleOrder = this.multipleSelection.map((data) => ({
        cartId: data.cartId,
        buyerId: this.user.userId,
        sellerId: data.sellerId,
        productId: data.productId,
        paymentOption: 'Online payment',
        quantityBought: data.quantity,
        totalAmount: data.quantity * data.productPrice,
        deliveryAddress: this.deliveryAddress,
      }));
      console.log(this.multipleOrder);
    },

    handleAddressChange(newValue) {
      console.log('Selected Address:', newValue);
      this.deliveryAddress = newValue;
    },
    // Method for handling a single order
    getOrderData() {
      console.log('Processing single order...');
      this.order = {
        cartId: this.cartId,
        buyerId: this.user.userId,
        sellerId: this.form.productDetails.sellerId,
        productId: this.form.productDetails.productId,
        paymentOption: 'Online payment',
        quantityBought: this.quantity,
        totalAmount: this.toggleMyCart
          ? this.totalAmount
          : this.quantity * this.form.productDetails.productPrice,
        deliveryAddress: this.deliveryAddress,
      };
      console.log(this.order);
    },

    // SUBMIT FORM
    submitForm(title, data) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      if (this.title == 'Buy Selected Products') {
        const mappedData = this.multipleSelection.map((data) => ({
          buyerId: this.user.userId,
          sellerId: data.sellerId,
          productId: data.productId,
          paymentOption: this.paymentOption,
          quantityBought: data.quantity,
          totalAmount: data.quantity * data.productPrice,
          deliveryAddress: this.deliveryAddress,
          paymentSource: 'Cash on delivery',
          payerId: '25REXAAABNLML',
          paymentCodeId: this.generateRandomString(17),
        }));
        axios.post(`${this.url}/Order/Multiple`, mappedData).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Order submitted successful');
            for (let i = 0; i < this.multipleSelection.length; i++) {
              axios
                .delete(`https://localhost:7175/api/Cart/${this.multipleSelection[i].cartId}`)
                .then((response) => {
                  if (response.data == 'success') {
                    this.btnViewOrder();
                    this.getMyCart('');
                  } else {
                    ElMessage.error('Failed to remove product from cart');
                  }
                });
            }
          } else {
            ElMessage.error('Failed to submit order');
          }
          this.btnMyCart('');
          this.getTotalNotifications();
          this.getOrdersByUserId();
          this.clear();
          loading.close();
        });
        return;
      }
      // SELLER APPLICATION
      if (title == 'Seller Application') {
        if (
          this.form.farm.farmName == '' ||
          this.form.farm.farmAddress == '' ||
          this.form.farm.farmDescription == ''
        ) {
          setTimeout(() => {
            loading.close();
          }, 1000);
          setTimeout(() => {
            ElMessage.error('Please input required fields');
          }, 1000);
          return;
        }

        const formData = new FormData();
        formData.append('farmName', this.form.farm.farmName);
        formData.append('farmAddress', this.form.farm.farmAddress);
        formData.append('farmDescription', this.form.farm.farmDescription);

        this.fileList.forEach((file) => {
          formData.append('businessPermitImage', file.raw);
        });

        // for (const [key, value] of formData.entries()) {
        //   // console.log(key, value);
        // }

        axios
          .put(`${this.url}/User/${this.user.userId}/Requirements`, formData)
          .then((response) => {
            if (response.data === 'success') {
              ElMessage.success('Seller requirements submitted');
              this.btnViewHomePage();
            } else {
              ElMessage.error('Failed to submit requirements');
            }
            loading.close();
          });
        return;
      }

      // ADD TO CART
      if (title == 'Add To Cart') {
        const payload = {
          buyerId: this.user.userId,
          productId: this.form.productDetails.productId,
          quantity: this.quantity,
        };
        axios.post(`${this.url}/Cart`, payload).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Product added to cart');
            this.getMyCart('');
          } else {
            ElMessage.error('Failed in adding to cart');
          }
          loading.close();
        });
        return;
      }

      // DELETE CART
      if (title == 'Delete Cart') {
        axios.delete(`${this.url}/Cart/${data.cartId}`).then((response) => {
          if (response.data == 'success') {
            this.btnMyCart('');
            ElMessage.success('Product removed from cart');
            loading.close();
          } else {
            ElMessage.error('Failed to remove product from cart');
          }
          loading.close();
        });

        return;
      }

      // BUY NOW
      if (title == 'Buy Now') {
        this.totalAmount = this.quantity * this.form.productDetails.productPrice;
        // FROM PRODUCT DETAILS
        if (data == undefined) {
          const payload = {
            buyerId: this.user.userId,
            sellerId: this.form.productDetails.sellerId,
            productId: this.form.productDetails.productId,
            paymentOption: this.paymentOption,
            quantityBought: this.quantity,
            totalAmount: this.quantity * this.form.productDetails.productPrice,
            deliveryAddress: this.deliveryAddress,
            paymentSource: 'Cash on delivery',
            payerId: '25REXAAABNLML',
            paymentCodeId: this.generateRandomString(17),
          };
          axios.post(`${this.url}/Order`, payload).then((response) => {
            ElMessage.success('Order successful');
            this.getProduct('');
            this.addNotification(response.data);
            // this.getNotificationByUserId();
            this.updateProductQuantity();
            this.quantity = 0;
            this.dialog.checkOut = false;
            this.deliveryAddress = '';
            this.paymentOption = 'Cash on delivery';
            if (this.cartId != '') {
              axios.delete(`${this.url}/Cart/${this.cartId}`).then((response) => {
                if (response.data == 'success') {
                  this.btnViewOrder();
                  this.getMyCart('');
                } else {
                  ElMessage.error('Failed to remove product from cart');
                }
              });
              loading.close();
            }
          });
        }
        // FROM CART
        else {
          const payload = {
            buyerId: this.user.userId,
            sellerId: data.sellerId,
            productId: data.productId,
            paymentOption: this.paymentOption,
            quantityBought: this.quantity,
            totalAmount: this.quantity * this.form.productDetails.productPrice,
            deliveryAddress: this.deliveryAddress,
            paymentSource: 'Cash on delivery',
            payerId: '25REXAAABNLML',
            paymentCodeId: this.generateRandomString(17),
          };
          axios.post(`${this.url}/Order`, payload).then((response) => {
            ElMessage.success('Order success waiting for seller approval');
            this.getProduct('');
            this.addNotification(response.data);
            // this.getNotificationByUserId();
            this.updateProductQuantity();
            this.quantity = 0;
            axios.delete(`${this.url}/Cart/${this.cartId}`).then((response) => {
              if (response.data == 'success') {
                this.btnViewOrder();
                this.getMyCart('');
                loading.close();
              } else {
                ElMessage.error('Failed to remove product from cart');
              }
              loading.close();
            });

            loading.close();
            return;
          });
        }

        return;
      }

      // UPDATE USER
      if (this.title == 'Update User') {
        //console.log('SUBMIT');
        if (this.isChangePassword) {
          if (this.form.password1 != this.form.password2) {
            ElMessage.error('Password not match');
            loading.close();
            return;
          }
          if (this.form.password1 == '' && this.form.password2 == '') {
            ElMessage.error('Please input password');
            loading.close();
            return;
          }
        }

        const formData = new FormData();

        formData.append('firstname', this.form.firstname);
        formData.append('lastname', this.form.lastname);
        formData.append('phone', this.form.phone);
        formData.append('address', this.form.address);
        formData.append('password', this.form.password1);

        this.file.forEach((file) => {
          formData.append('profileImage', file);
        });

        axios.put(`${this.url}/User/${this.user.userId}`, formData).then((response) => {
          if (response.data === 'success') {
            ElMessage.success('User updated successfully');
            this.getUser();
            this.btnOpenProfile();
            this.fileList = [];
            this.isChangePassword = false;
            this.form.password1 = '';
            this.form.password2 = '';
          } else {
            ElMessage.error('Failed to update user');
          }
          loading.close();
        });

        return;
      }
    },

    changePassword() {
      this.isChangePassword = !this.isChangePassword;
    },

    generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },

    // CHECK QUANTITY
    checkQuantity(title, data) {
      this.deliveryAddress = this.user.address;
      console.log(this.deliveryAddress);
      //  console.log(data);
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      if (title == 'Buy Now') {
        if (this.quantity == 0 || this.quantity == undefined) {
          ElMessage.error('Please enter a kilo');
          loading.close();

          return;
        }
        this.getUserAddress();

        axios
          .get(`${this.url}/Product/${this.form.productDetails.productId}`)
          .then((response) => {
            this.deliveryAddress = this.user.address;
            if (this.quantity > response.data.quantity) {
              ElMessage.error('Cannot buy not enough kilo/s');
              this.dialog.checkOut = false;
              loading.close();
            } else {
              this.dialog.checkOut = true;
              loading.close();
            }
          })
          .catch(() => {
            ElMessage.error('An Error occured');
            loading.close();
          });
      } else if (title == 'Add To Cart') {
        axios
          .get(`${this.url}/Product/${this.form.productDetails.productId}`)
          .then((response) => {
            if (this.quantity > response.data.quantity) {
              ElMessage.error('Cannot buy not enough kilo/s');
              this.dialog.checkOut = false;
              loading.close();
            } else {
              this.submitForm('Add To Cart');
            }
          })
          .catch(() => {
            ElMessage.error('An Error occured');
            loading.close();
          });
      } else if (title == 'Buy Now from Cart') {
        console.log(data.cartId);
        this.getUserAddress();
        this.cartId = data.cartId;
        // console.log('BUY NOW FROM CART');
        this.form.productDetails.sellerId = data.sellerId;
        this.form.productDetails.productId = data.productId;
        this.quantity = data.quantity;
        this.totalAmount = data.quantity * data.productPrice;
        axios
          .get(`${this.url}/Product/${data.productId}`)
          .then((response) => {
            if (data.quantity > response.data.quantity) {
              ElMessage.error('Cannot buy not enough kilo/s');
              this.dialog.checkOut = false;
              loading.close();
            } else {
              this.dialog.checkOut = true;
              loading.close();
            }
          })
          .catch(() => {
            ElMessage.error('An Error occured');
            loading.close();
          });
      } else if (title == 'Buy Selected Products') {
        this.title = title;
        this.dialog.checkOut = true;
        this.getUserAddress();
        loading.close();
      } else if (title == 'Change Cart Quantity') {
        loading.close();
        this.title = title;
        this.dialog.changeQuantity = true;
      }
    },

    // SEND MESSAGE
    sendMessage() {
      const payload = {
        message: this.message,
        buyerId: this.user.userId,
        sellerId: this.sellerId,
      };
      axios
        .post(`${this.url}/Message`, payload)
        .then(() => {
          this.message = '';
          this.viewMessage(this.sellerId);
        })
        .catch(() => {
          ElMessage.error('An Error occured');
          // loading.close();
        });
    },

    // VIEW MESSAGE
    viewMessage(sellerId) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.sellerId = sellerId;
      axios
        .get(`${this.url}/Message/Buyer/${this.user.userId}/Seller/${sellerId}`)
        .then((response) => {
          this.messages = response.data;
          // this.messageLoading = false;
          loading.close();
        })
        .catch(() => {
          ElMessage.error('An Error occured');
          loading.close();
        });
    },

    // GET CONTACT
    getContact() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(`${this.url}/Message?buyerId=${this.user.userId}`)
        .then((response) => {
          this.contacts = response.data;
          // this.contactLoading = false;
          loading.close();
        })
        .catch(() => {
          ElMessage.error('An Error occured');
          loading.close();
        });
    },

    getUser() {
      axios.get(`${this.url}/User/${this.user.userId}`).then((response) => {
        this.user = response.data;
      });
    },

    // UPDATE PRODUCT QUANTITY
    updateProductQuantity() {
      axios
        .put(`${this.url}/Product/${this.form.productDetails.productId}/Quantity/${this.quantity}`)
        .then((response) => {
          if (response.data == 'success') {
            //
          } else {
            ElMessage.error("Cannot buy not enough kilo/s'");
            return;
          }
        });
    },

    updateOrderStatus(data, sellerId, productId, orderId, status) {
      const payload = {
        orderStatus: status,
        orderDateReceived: new Date(),
        deliveryDate: data.deliveryDate,
        deliveryCourier: data.deliveryCourier,
      };
      axios.put(`${this.url}/Order/${orderId}`, payload).then((response) => {
        if (response.data == 'success') {
          ElMessage.success('Order updated successfully');
          this.btnViewOrder();
          const payload = {
            buyerId: this.user.userId,
            userId: sellerId,
            productId: productId,
            message: status == 'Receive' ? 'Receive' : 'Return and Refund',
            orderId: orderId,
          };
          if (status == 'Return and Refund') {
            axios.post(`${this.url}/Notification`, payload).then((response) => {
              if (response.data == 'success') {
                // this.getNotificationByUserId();
              } else {
                return;
              }
            });
          }
        } else {
          ElMessage.error('Failed to update order');
        }
      });

      this.getTotalNotifications();
    },

    // ADD NOTIFICATION
    addNotification(orderId) {
      const payload = {
        buyerId: this.user.userId,
        userId: this.form.productDetails.sellerId,
        productId: this.form.productDetails.productId,
        message: 'Product bought waiting for seller to prepare your order',
        orderId: orderId,
      };
      axios.post(`${this.url}/Notification`, payload).then((response) => {
        if (response.data == 'success') {
          // this.getNotificationByUserId();
        } else {
          return;
        }
      });
    },

    // GET NOTIFICATION BY USER ID
    getNotificationByUserId() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios.get(`${this.url}/Notification/${this.user.userId}/Buyer`).then((response) => {
        this.notifications = response.data;
        loading.close();
      });
    },

    // GET PRODUCT
    getProduct(data) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      this.productLoading = true;
      axios
        .get(
          `${this.url}/Product?userId=${this.user.userId}&search=${data}&currentPage=${this.productPagination.currentPage}&elementsPerPage=${this.productPagination.elementsPerPage}`
        )
        .then((response) => {
          this.error = false;
          this.products = response.data.results;
          this.productPagination.totalElements = response.data.totalElements;
          this.productLoading = false;
          loading.close();
        })
        .catch(() => {
          // console.log('error');
          this.error = true;
          loading.close();
        });
    },

    // CLEAR
    clear() {
      this.cartId = '';
      this.dialog.previewImage = false;
      this.dialog.transaction = false;
      this.dialog.rateProduct = false;
      this.dialog.userAddress = false;
      this.rate.rating = '';
      this.rate.message = '';
      this.title = '';
      this.deliveryAddress = '';
      this.paymentOption = '';
      this.multipleSelection.length = 0;
      this.dialog.checkOut = false;
      this.$refs.multipleTableRef.clearSelection();
    },

    // ON EXCEED
    onExceed(files) {
      this.$refs.uploader.clearFiles();
      this.$refs.uploader.handleStart(files[0]);
    },

    // PREVIEW IMAGE
    onPreview(file) {
      this.previewImg = file.url || file.thumbUrl || URL.createObjectURL(file.raw);
      this.dialog.previewImage = true;
    },

    // SELECTED IMAGES
    onSuccess(res, file) {
      this.file.push(file.raw);
    },

    // REMOVE SELECTED IMAGE
    onRemove(file) {
      this.file = this.file.filter((f) => f.uid !== file.uid);
    },

    // CHECK FILE FORMAT / FILE SIZE
    beforeUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        ElMessage.warning('File type should be JPG, PNG');
        return false;
      }
      if (file.size > 10000000) {
        ElMessage.warning('File size should be less than 10MB');
        return false;
      }
    },

    logout() {
      localStorage.clear();
      window.location.replace('/login');
    },

    formatDate(date1) {
      if (!date1) {
        return '';
      }

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const date = new Date(date1);
      const year = date.getFullYear();
      const monthIndex = date.getMonth(); // Month index (0-11)
      const month = months[monthIndex]; // Get the month abbreviation
      const day = date.getDate().toString().padStart(2, '0');

      return `${month} ${day}, ${year}`;
    },

    formatDateTime(date1) {
      if (!date1) {
        return '';
      }

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const date = new Date(date1);
      const year = date.getFullYear();
      const monthIndex = date.getMonth(); // Month index (0-11)
      const month = months[monthIndex]; // Get the month name
      const day = date.getDate().toString().padStart(2, '0');

      // Extracting hours and minutes
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');

      // Determine AM or PM suffix
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12; // Convert to 12-hour format
      hours = hours ? hours : 12; // Handle the case of 0 hours

      return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    if (this.user == null) {
      router.push('login');
      ElMessage.error('Please login first');
      return;
    }
    this.getMyCart('');
    this.getTotalNotifications();
    this.getProduct('');
    this.getOrdersByUserId();
  },
};
</script>

<style></style>
