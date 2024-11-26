<template>
  <div class="h-full mb-10">
    <nav class="flex items-center justify-between flex-wrap px-4 sm:px-9 py-4">
      <!-- Logo or Home Button -->
      <div class="flex items-center flex-shrink-0 text-black">
        <button
          @click="btnViewHomePage"
          class="block mt-4 lg:inline-block lg:mt-0 text-black text-[24px] sm:text-[30px] font-semibold drop-shadow-sm mr-4"
        >
          HOME
        </button>
      </div>

      <!-- Navigation Buttons -->
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto ml-auto">
        <div class="text-sm lg:flex-grow flex justify-between sm:justify-end flex-wrap gap-4">
          <!-- Inventory Button -->
          <button
            :style="
              toggleViewSellerInventory
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewSellerInventory"
            class="block mt-4 lg:inline-block lg:mt-0 text-black text-[18px] sm:text-[24px] hover:-translate-y-1 hover:transition-all"
          >
            Inventory
          </button>

          <!-- Notifications Button -->
          <button
            :style="
              toggleViewAllNotification
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewAllNotifications"
            class="block mt-4 lg:inline-block lg:mt-0 text-black text-[18px] sm:text-[24px] hover:-translate-y-1 hover:transition-all"
          >
            Notification ({{ totalNotifications }})
          </button>

          <!-- Prices Button -->
          <button
            :style="
              toggleViewAllPricing
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="
              btnViewAllPrices();
              getVegetables();
            "
            class="block mt-4 lg:inline-block lg:mt-0 text-black text-[18px] sm:text-[24px] hover:-translate-y-1 hover:transition-all"
          >
            Prices
          </button>

          <!-- Message Button -->
          <button
            :style="
              toggleViewContact
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewContacts"
            class="block mt-4 lg:inline-block lg:mt-0 text-black text-[18px] sm:text-[24px] hover:-translate-y-1 hover:transition-all"
          >
            Message
          </button>

          <!-- Orders Button -->
          <button
            :style="
              toggleViewOrder
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnViewOrder"
            class="block mt-4 lg:inline-block lg:mt-0 text-black text-[18px] sm:text-[24px] hover:-translate-y-1 hover:transition-all"
          >
            Orders ({{ orderPagination.totalElements }})
          </button>

          <!-- Profile Button -->
          <button
            :style="
              toggleViewProfile || toggleEditProfile
                ? { paddingTop: '2px', borderTop: '3px solid black' }
                : { borderTop: 'none' }
            "
            @click="btnOpenProfile"
            class="block mt-4 lg:inline-block lg:mt-0 text-black text-[18px] sm:text-[24px] hover:-translate-y-1 hover:transition-all"
          >
            Profile
          </button>
        </div>

        <!-- Logout Button -->
        <div class="ms-4 mt-4">
          <button @click="logout" class="hover:-translate-y-1 hover:transition-all">
            <img src="../../assets/Images/icon-logout.png" alt="logout" />
          </button>
        </div>
      </div>
    </nav>

    <!-- START ORDERS -->
    <div v-if="toggleViewOrder" class="flex flex-col w-full h-full justify-center items-center">
      <!-- Header with Back Button -->
      <div class="flex justify-start w-full p-2 border-b border-red-500">
        <button @click="btnViewHomePage" class="px-9">
          <i class="bi bi-arrow-left text-lg font-bold"></i>
        </button>
      </div>

      <!-- Order Table -->
      <div class="w-full overflow-x-auto">
        <el-table :data="orders" class="w-full min-w-max">
          <el-table-column label="Product Image" width="150">
            <template #default="scope">
              <img :src="scope.row.productImage" class="w-20 h-20 object-cover" />
            </template>
          </el-table-column>

          <el-table-column label="Product Name" prop="productName" width="150" />
          <el-table-column label="Total Amount" prop="totalAmount" width="100" />
          <el-table-column label="Payment Option" prop="paymentOption" width="150" />
          <el-table-column label="Total Kilo/s Bought" width="150">
            <template #default="scope">
              {{ `${scope.row.quantityBought} kilo/s bought` }}
            </template>
          </el-table-column>
          <el-table-column label="Buyer" width="150">
            <template #default="scope">
              <img :src="scope.row.buyerImage" class="w-8 h-8 rounded-full inline-block mr-2" />
              {{ `${scope.row.buyerFirstname} ${scope.row.buyerLastname}` }}
            </template>
          </el-table-column>

          <el-table-column label="Delivery Date">
            <template #default="scope">
              {{ `${formatDate(scope.row.deliveryDate)}` }}
            </template>
          </el-table-column>

          <el-table-column label="Delivery Courier" prop="deliveryCourier" />
          <el-table-column label="Delivery Address" prop="deliveryAddress" />

          <!-- Order Status with Search Input -->
          <el-table-column prop="orderStatus">
            <template #header>
              <div class="flex w-full">
                <el-input
                  v-model="searchOrder"
                  placeholder="Type to search order..."
                  class="filterInput flex-grow"
                  clearable
                  @clear="btnViewOrder()"
                />
                <el-button
                  type="button"
                  class="flex ms-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  @click="btnViewOrder()"
                >
                  <i class="bi bi-search"></i>
                </el-button>
              </div>
            </template>
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
          </el-table-column>

          <!-- Action Buttons -->
          <el-table-column>
            <template #default="scope">
              <div class="flex justify-center gap-2">
                <el-button
                  @click="btnOpenDeliveryDate(scope.row)"
                  v-if="scope.row.orderStatus == 'Pending'"
                  type="primary"
                  class="w-full sm:w-auto"
                >
                  Approve Order
                </el-button>
                <el-button
                  @click="updateOrderStatus(scope.row, 'Declined')"
                  v-if="scope.row.orderStatus == 'Pending'"
                  type="danger"
                  class="w-full sm:w-auto"
                >
                  Decline Order
                </el-button>
                <el-button
                  @click="updateOrderStatus(scope.row, 'Out for delivery')"
                  v-if="scope.row.orderStatus == 'Approved'"
                  class="w-full sm:w-auto"
                >
                  Out for delivery
                </el-button>
                <el-button
                  v-if="scope.row.orderStatus == 'Return and Refund'"
                  type="warning"
                  @click="updateOrderStatus(scope.row, 'Settle')"
                  class="w-full sm:w-auto"
                >
                  Settle
                </el-button>
                <el-button @click="btnViewMessage(scope.row.buyerId)" class="w-full sm:w-auto">
                  Message Buyer
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- END ORDERS -->

    <!-- MESSAGES -->
    <div v-loading="messageLoading" v-if="toggleViewMessage">
      <div class="flex justify-center items-center">
        <div class="border h-screen w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl">
          <button @click="btnViewContacts" class="px-9">
            <i class="bi bi-arrow-left text-lg font-bold"></i>
          </button>
          <div class="flex text-[32px] font-semibold mb-4">Message</div>
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
          <div class="flex items-center space-x-2 mt-4">
            <el-input
              :rows="3"
              v-model="message"
              type="textarea"
              placeholder="Message..."
              class="flex-grow"
            />
            <el-button class="whitespace-nowrap" type="primary" @click="sendMessage"
              >Send</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <!-- CONTACTS -->
    <div v-loading="contactLoading" v-if="toggleViewContact">
      <div class="flex justify-center items-center">
        <div
          class="border h-screen w-full sm:w-3/4 md:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl"
        >
          <div class="flex text-[32px] font-semibold mb-4">Contacts</div>
          <div class="overflow-y-scroll h-[70%]">
            <template v-if="contacts.length > 0">
              <div
                v-for="(contact, index) in contacts"
                @click="btnViewMessage(contact.buyerId)"
                :key="index"
                class="flex justify-between items-center mt-10 border-b pb-4 cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition duration-150 ease-in-out relative"
              >
                <div class="flex flex-row items-center">
                  <div class="flex flex-col">
                    <img :src="contact.buyerImage" alt="contact" class="w-16 h-16 rounded-full" />
                  </div>
                  <div class="flex flex-col ms-4">
                    <div class="text-[14px] font-semibold">
                      {{ `${contact.buyerFirstname} ${contact.buyerLastname}` }}
                    </div>
                  </div>
                </div>
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

    <!-- toggleViewHomePage -->
    <div
      v-if="toggleViewHomePage"
      class="flex flex-col w-full bg-[url('../assets/Images/cultivate-bg-home.png')] bg-no-repeat bg-cover border h-auto sm:h-[500px]"
    >
      <!-- Logo Section -->
      <div class="flex items-center justify-start w-40 sm:w-[206px] h-20 sm:h-[90px] p-4">
        <img
          src="../../assets/Images/cultivatradeLogo.png"
          alt="Logo"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Content Section -->
      <div class="flex flex-col items-start px-4 sm:px-24 lg:px-96 fade-in-slide-down">
        <div class="text-white flex flex-col scale-90 sm:scale-100">
          <!-- Heading -->
          <div class="text-lg sm:text-2xl lg:text-[36px] font-bold text-center sm:text-left">
            Fresh from the Farm to Your Table
          </div>
          <!-- Description -->
          <div
            class="text-sm sm:text-base lg:text-[24px] mt-4 sm:mt-5 sm:w-10/12 lg:w-9/12 text-center sm:text-left"
          >
            Experience the taste of freshness with produce sourced directly from local farmers. Our
            marketplace connects you to the best fruits and vegetables, ensuring top quality while
            empowering our community growers. Enjoy the bounty of nature and support our local
            farmers.
          </div>
          <!-- Button -->
          <div class="flex justify-center sm:justify-start mt-6 sm:mt-9">
            <button
              @click="btnViewAllProducts"
              class="p-3 sm:p-4 rounded bg-[#1A4D2E] text-white text-sm sm:text-[16px] hover:bg-[#297346]"
            >
              Browse Produce
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="toggleViewFeaturedProducts"
      class="flex flex-col items-center justify-center p-5 sm:p-10 bg-gray-50"
    >
      <div class="container mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row gap-y-2 sm:gap-y-0 items-center justify-between mb-5">
          <div class="text-2xl sm:text-3xl font-semibold text-gray-800">Featured Products</div>
        </div>

        <!-- Grid Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <!-- Add Product Button -->
          <div
            class="w-full flex justify-center border border-gray-300 rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <el-button
              @click="openForm('Add Product')"
              type="text"
              class="flex flex-col items-center"
            >
              <div
                class="bg-[#008475] w-16 h-16 flex items-center justify-center rounded-full shadow-md"
              >
                <i class="bi bi-plus-lg text-white text-3xl"></i>
              </div>
              <p class="mt-2 text-sm text-center text-gray-700">CLICK HERE TO ADD PRODUCT</p>
            </el-button>
          </div>

          <!-- Product Cards -->
          <div
            v-for="product in products"
            :key="product.productId"
            class="rounded-lg shadow-lg bg-white p-4 flex flex-col transition-all duration-300 hover:shadow-xl"
          >
            <div class="flex justify-end mb-2 space-x-2">
              <el-popconfirm
                hide-icon="true"
                width="300px"
                confirm-button-text="Confirm"
                cancel-button-text="Cancel"
                :title="`Do you want to ${product.isDisabled ? 'Disable' : 'Enable'} this product?`"
                @confirm="disableProduct(product)"
                @cancel="getProduct('', this.user.userId)"
              >
                <template #reference>
                  <el-switch v-model="product.isDisabled" :disabled="isNotAdmin" />
                </template>
              </el-popconfirm>

              <div class="flex space-x-2">
                <el-button
                  @click="getBoostProductByProductId(product.productId)"
                  size="small"
                  class="text-blue-500"
                >
                  Boost History
                </el-button>
                <el-button
                  @click="getReportByProductId(product.productId)"
                  size="small"
                  class="text-yellow-500"
                >
                  <i class="bi bi-exclamation-triangle font-bold"></i>
                </el-button>
                <el-button @click="btnBoostProduct(product)" size="small" class="text-green-500">
                  <i class="bi bi-rocket"></i>
                </el-button>
                <el-popconfirm
                  @confirm="deleteProduct(product.productId)"
                  title="Do you want to delete this product?"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      :disabled="isButtonDisabled(product)"
                      class="text-red-500"
                    >
                      <i class="bi bi-trash"></i>
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>

            <!-- Product Image -->
            <div class="flex justify-center mb-4">
              <img
                :src="product.productImage"
                alt="Product Image"
                class="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>

            <!-- Product Details -->
            <div class="mt-4">
              <div class="flex flex-col sm:flex-row sm:justify-between w-full items-center">
                <!-- Left side with name and price -->
                <div class="flex flex-col items-start">
                  <p class="text-lg font-semibold text-gray-800">{{ product.productName }}</p>
                  <p class="text-green-500 text-sm">P {{ product.productPrice }} / kilo</p>
                </div>
                <div class="text-sm text-[#989595]">
                  Expiry: {{ formatDate(product.expiryDate) }}
                </div>
                <div>
                  <button
                    @click="openForm('Edit Product', product)"
                    class="p-2 bg-[#008475] text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- View All Button -->
          <div class="flex justify-center items-center mt-6">
            <button
              @click="btnViewAllProducts"
              class="p-4 bg-[#1A4D2E] text-white rounded-lg shadow-lg w-full sm:w-auto hover:bg-[#2A6C46]"
            >
              View All Products
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW SELLER INVENTORY -->
    <div v-if="toggleViewSellerInventory" class="flex flex-col items-start justify-center p-5">
      <div class="w-full px-4">
        <!-- Search and Button Section -->
        <div class="flex flex-wrap items-center gap-4 sm:gap-6 w-full ms-10">
          <!-- Search Button -->
          <el-button
            type="button"
            class="flex items-center justify-center p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            @click="btnViewSellerInventory()"
          >
            <i class="bi bi-search"></i>
          </el-button>

          <!-- Search Input -->
          <el-input
            v-model="searchInventory"
            placeholder="Type to search product..."
            class="filterInput w-full sm:w-[300px]"
            clearable
            @clear="
              this.searchInventory = '';
              btnViewSellerInventory();
            "
          />
        </div>

        <!-- Inventory Table -->
        <el-table :data="inventoryData" class="w-full mt-4">
          <el-table-column prop="productName" label="Product"></el-table-column>
          <el-table-column prop="productPrice" label="Total Amount"></el-table-column>
          <el-table-column prop="totalSold" label="Total Sold"></el-table-column>
          <el-table-column prop="quantity" label="Quantity Left"></el-table-column>

          <!-- Action Buttons -->
          <el-table-column label="Actions" align="center">
            <template v-slot="scope">
              <el-button type="primary" @click="btnHandleUpdate(scope.row)">Update</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination Section -->
      <el-pagination
        v-model:current-page="inventoryPagination.currentPage"
        v-model:page-size="inventoryPagination.elementsPerPage"
        layout="prev, pager, next, jumper"
        :total="inventoryPagination.totalElements"
        @size-change="btnViewSellerInventory"
        @current-change="btnViewSellerInventory"
        class="mt-4"
      />
    </div>
  </div>
  <!-- Update Inventory Dialog -->
  <el-dialog title="Update Inventory" v-model="dialog.inventoryData" :width="'90%'">
    <div class="flex flex-col items-center p-4">
      <!-- Product Image and Name -->
      <img
        :src="selectedRow.productImage"
        alt="Product"
        class="w-20 h-20 object-cover mb-4 sm:w-32 sm:h-32"
      />
      <h2 class="font-bold text-lg sm:text-xl">{{ selectedRow.product }}</h2>
    </div>

    <!-- Form -->
    <el-form :model="form" label-width="120px">
      <el-form-item label="Quantity">
        <el-input-number v-model="form.quantity" :min="1" />
      </el-form-item>
    </el-form>

    <!-- Footer (Buttons) -->
    <template #footer>
      <div class="flex justify-between w-full">
        <el-button @click="dialog.inventoryData = false" class="w-full sm:w-auto">
          Cancel
        </el-button>
        <el-button type="primary" @click="btnUpdateInventory" class="w-full sm:w-auto">
          Update
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- View All Products -->

  <!-- toggleViewAllProducts -->
  <div v-if="toggleViewAllProducts">
    <!-- Search Form -->
    <el-form class="flex justify-end mb-6">
      <div class="flex w-full gap-4 sm:w-auto">
        <el-button
          type="button"
          class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
          @click="getProduct(searchProduct, user.userId)"
        >
          <i class="bi bi-search"></i>
        </el-button>

        <el-input
          v-model="searchProduct"
          placeholder="Type to search product..."
          class="filterInput flex-1 sm:w-[250px] lg:w-[300px] py-2 px-4 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
          clearable
          @clear="getProduct('', user.userId)"
        />
      </div>
    </el-form>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-10">
      <div
        v-for="product in products"
        :key="product.productId"
        class="rounded-lg shadow-lg bg-white overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl"
      >
        <!-- Product Actions -->
        <div class="flex justify-between p-4">
          <el-popconfirm
            hide-icon="true"
            width="300px"
            confirm-button-text="Confirm"
            cancel-button-text="Cancel"
            :title="`Do you want to ${product.isDisabled ? 'Disable' : 'Enable'} this product?`"
            @confirm="disableProduct(product)"
            @cancel="getProduct('', this.user.userId)"
          >
            <template #reference>
              <el-switch v-model="product.isDisabled" :disabled="isNotAdmin" />
            </template>
          </el-popconfirm>

          <div class="flex gap-2">
            <el-button @click="getBoostProductByProductId(product.productId)" class="text-blue-500">
              Boost History
            </el-button>
            <el-button @click="getReportByProductId(product.productId)" class="text-yellow-500">
              <i class="bi bi-exclamation-triangle font-bold"></i>
            </el-button>
          </div>
        </div>

        <!-- Product Image -->
        <div class="flex justify-center py-4">
          <img
            :src="product.productImage"
            alt="Product Image"
            class="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
          />
        </div>

        <!-- Product Details -->
        <div class="p-4 flex flex-col gap-2">
          <div class="flex flex-col sm:flex-row w-full items-center justify-between">
            <div class="flex flex-col">
              <p class="text-lg font-semibold text-gray-800">{{ product.productName }}</p>
              <p class="text-green-500">P {{ product.productPrice }} / kilo</p>
            </div>
            <div class="flex flex-col sm:ml-4 mt-2 sm:mt-0">
              <p class="text-gray-500">Expiry: {{ formatDate(product.expiryDate) }}</p>
            </div>
          </div>

          <div class="flex justify-between mt-4">
            <button
              @click="openForm('Edit Product', product)"
              class="p-2 bg-[#008475] text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <div class="flex gap-2">
              <el-popconfirm
                @confirm="deleteProduct(product.productId)"
                title="Do you want to delete this product?"
              >
                <template #reference>
                  <el-button v-if="!isButtonDisabled(product)" class="text-red-500">
                    <i class="bi bi-trash"></i>
                  </el-button>
                </template>
              </el-popconfirm>

              <el-button @click="btnBoostProduct(product)" class="text-green-500">
                <i class="bi bi-rocket"></i>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <el-card class="w-full sm:w-auto">
        <el-pagination
          v-model:current-page="productPagination.currentPage"
          v-model:page-size="productPagination.elementsPerPage"
          layout="prev, pager, next, jumper"
          :total="productPagination.totalElements"
          @size-change="getProduct('', user.userId)"
          @current-change="getProduct('', user.userId)"
          class="w-full sm:w-auto"
        />
      </el-card>
    </div>
  </div>

  <div v-if="toggleViewAllNotification">
    <div class="flex justify-center items-center">
      <div
        class="border h-screen w-full sm:w-3/4 md:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl"
      >
        <div class="flex text-[32px] font-semibold mb-4">Notification</div>
        <div class="overflow-y-scroll h-[70%]">
          <template v-if="notifications.length > 0">
            <div
              v-for="notification in notifications"
              :key="notification.notificationId"
              @click="btnOpenOrderUpdate(notification)"
              class="flex justify-between items-center mt-10 border-b pb-4 cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition duration-150 ease-in-out relative"
            >
              <div class="flex flex-row items-center">
                <div class="flex flex-col">
                  <div v-if="notification.buyerImage != null">
                    <img
                      :src="notification.buyerImage"
                      alt="notification"
                      class="w-16 h-16 rounded-full"
                    />
                  </div>
                </div>
                <div class="flex flex-col ms-4">
                  <div class="text-[14px] font-semibold">
                    <div
                      v-if="
                        notification.message ==
                        'Product bought waiting for seller to prepare your order'
                      "
                    >
                      {{
                        `${notification.buyerFirstname} ${notification.buyerLastname} bought ${notification.productName} from you`
                      }}
                    </div>
                    <div v-else-if="notification.message == 'Receive your product'">
                      {{
                        `${notification.buyerFirstname} ${notification.buyerLastname} successfully received ${notification.productName} from you`
                      }}
                    </div>
                    <div v-else-if="notification.message == 'Return and Refund'">
                      {{
                        `${notification.buyerFirstname} ${notification.buyerLastname} request a return and refund in your ${notification.productName} product`
                      }}
                    </div>
                    <div
                      v-if="
                        notification.message ==
                        'You have been approved as seller you can now sell your goods'
                      "
                    >
                      Admin: You have been approved as seller you can now sell your goods
                    </div>
                    <div v-if="notification.message == 'Your account has been revert as buyer'">
                      Admin: Your account has been revert as buyer
                    </div>
                  </div>
                  <div class="text-[13px] text-[#717171]">
                    {{ formatDateTime(notification.dateTimeCreated) }}
                  </div>
                </div>
              </div>
              <div class="flex">
                <!-- Button to delete notification (optional) -->
                <!--
              <button
                type="button"
                class="text-xl z-10"
                @click="deleteNotification(notification.notificationId)"
              >
                <i class="bi bi-x-lg"></i>
              </button>
              --></div>
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

  <div v-if="toggleViewAllPricing">
    <div class="flex justify-center items-center">
      <div
        class="border h-screen w-full sm:w-3/4 md:w-1/2 p-6 drop-shadow-2xl shadow-xl rounded-xl"
      >
        <div class="flex text-[32px] font-semibold mb-4">Pricing</div>
        <div class="overflow-y-scroll h-[70%]">
          <div class="flex gap-2 mb-4">
            <button class="btn border rounded p-3 w-full sm:w-auto" @click="btnVegetableSRP">
              Vegetables
            </button>
            <button class="btn border rounded p-3 w-full sm:w-auto" @click="btnFruitSRP">
              Fruits
            </button>
          </div>

          <!-- Vegetable Table -->
          <div v-if="toggleVegetableSRP" class="mt-4">
            <h3 class="text-xl font-semibold mb-4">Vegetables</h3>
            <el-table :data="vegetables" style="width: 100%">
              <!-- Image Column -->
              <el-table-column label="Image">
                <template #default="scope">
                  <img
                    :src="scope.row.productImage"
                    alt="product"
                    class="w-12 h-12 object-cover rounded-full"
                  />
                </template>
              </el-table-column>

              <!-- Product Name Column -->
              <el-table-column prop="name" label="Product Name"></el-table-column>

              <!-- Price Column -->
              <el-table-column prop="price" label="Price"></el-table-column>
            </el-table>
          </div>

          <!-- Fruit Table -->
          <div v-if="toggleFruitSRP" class="mt-4">
            <h3 class="text-xl font-semibold mb-4">Fruits</h3>
            <el-table :data="fruits" style="width: 100%">
              <!-- Image Column -->
              <el-table-column label="Image">
                <template #default="scope">
                  <img
                    :src="scope.row.productImage"
                    alt="product"
                    class="w-12 h-12 object-cover rounded-full"
                  />
                </template>
              </el-table-column>

              <!-- Product Name Column -->
              <el-table-column prop="name" label="Product Name"></el-table-column>

              <!-- Price Column -->
              <el-table-column prop="price" label="Price"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="toggleViewProfile">
    <!-- Profile Header Section -->
    <div class="flex w-full bg-[#508D4E] h-[326px] justify-center items-center">
      <img
        :src="user.profileDataUrl"
        alt="profile"
        height="200"
        width="200"
        class="rounded-full translate-y-16 sm:translate-y-0"
      />
    </div>

    <!-- Profile Name and Edit Button -->
    <div class="flex flex-col sm:flex-row justify-between items-center px-5 mt-5 sm:mt-0">
      <div class="flex flex-col text-[32px] sm:text-[64px] font-semibold text-center sm:text-left">
        {{ `${user.firstname} ${user.lastname}` }}
      </div>
      <div class="flex flex-col justify-center mt-4 sm:mt-0">
        <button @click="btnEditProfile" class="rounded p-2 px-4 border border-black">
          Edit Profile
        </button>
      </div>
    </div>

    <!-- Profile Details -->
    <div class="p-5">
      <div class="flex flex-col sm:flex-row text-[20px] sm:text-[40px] opacity-[69%]">
        <div>Email: {{ user.email }}</div>
        <div class="mt-4 sm:mt-0 sm:ml-8">Contact Number: {{ user.phone }}</div>
      </div>
      <div class="flex flex-col sm:flex-row text-[20px] sm:text-[40px] opacity-[69%] mt-10">
        <div>Address: {{ user.address }}</div>
      </div>
    </div>
  </div>

  <div v-if="toggleEditProfile">
    <div class="flex justify-center items-center p-4">
      <!-- Container for the form with responsive width -->
      <div
        class="border h-auto sm:w-1/2 md:w-2/3 lg:w-1/3 p-6 drop-shadow-2xl shadow-xl rounded-xl w-full"
      >
        <!-- Title and Upload Section -->
        <div class="flex flex-row justify-between items-center mb-6">
          <div class="text-[32px] sm:text-[45px] font-semibold">Edit Profile</div>
          <div class="flex flex-col justify-center items-center">
            <div class="flex flex-row justify-center items-center gap-x-2">
              <!-- Upload Section -->
              <div class="flex flex-col">
                <el-upload
                  v-model:file-list="fileList"
                  action="getUploadTrigger"
                  :on-success="onSuccess"
                  :on-preview="onPreview"
                  :on-remove="onRemove"
                  :before-upload="beforeUpload"
                  :limit="1"
                  method="get"
                  accept="image/jpeg, image/png, image/jpg"
                >
                  <el-button type="primary">Click to upload</el-button>
                  <template #tip>
                    <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
                  </template>
                </el-upload>
              </div>
              <!-- Profile Image -->
              <div class="flex flex-col">
                <img
                  :src="user.profileDataUrl"
                  alt="sampleImage"
                  class="rounded-full w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <el-form label-position="top" class="mt-8">
          <!-- Grid for Form Fields (Responsive Grid) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[16px] sm:text-[26px]">
            <el-form-item label="First Name">
              <el-input
                v-model="form.firstname"
                class="h-[50px] w-full"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="Last Name">
              <el-input
                v-model="form.lastname"
                class="h-[50px] w-full"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="Email" class="col-span-2">
              <el-input
                :disabled="true"
                v-model="form.email"
                class="h-[50px]"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="Address" class="col-span-2">
              <el-input v-model="form.address" class="h-[50px]" />
            </el-form-item>
            <el-form-item label="Contact Number" class="col-span-2">
              <el-input v-model="form.phone" class="h-[50px]" maxlength="11" show-word-limit />
            </el-form-item>

            <!-- Change Password Section -->
            <el-form-item class="col-span-2">
              <!-- Button with pencil icon on mobile -->
              <el-button
                @click="changePassword"
                class="w-full sm:w-auto flex justify-center items-center"
              >
                <span class="mr-2 sm:hidden">
                  <i class="bi bi-pencil"></i>
                  <!-- Bootstrap pencil icon -->
                </span>
                Change Password
              </el-button>
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

          <!-- Submit Button -->
          <div class="mt-4">
            <el-button @click="submitForm()" type="primary" class="w-full sm:w-auto"
              >Confirm</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>

  <!-- START PREVIEW IMAGE DIALOG -->
  <el-dialog v-model="dialog.previewImage">
    <div class="content-center">
      <div>
        <img :src="previewImg" style="width: 300px" />
      </div>
    </div>
  </el-dialog>
  <!-- el dialog Boost All Products-->
  <el-dialog v-model="dialog.boostAllProduct" title="Boost All Products" width="300">
    <main>
      <h5 class="font-bold text-center">Boost it for</h5>
      <div class="flex items-center justify-center">
        <el-input-number v-model="daysNum" :min="1" :max="10" />
      </div>
      <h5 class="text-center">Day/s</h5>
      <h5 class="pt-5 font-bold text-center">Choose Payment Method</h5>
      <div class="py-5 flex justify-center">
        <el-button type="primary">Paypal</el-button>
      </div>
    </main>
    <template #footer>
      <span class="dialog-footer">
        <el-button color="rgb(78.1, 141.8, 46.6)" @click="submitBoostProduct">Confirm</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- el dialog Boost Specific Products-->
  <el-dialog v-model="this.dialog.boostProduct" title="Boost Products" width="500">
    <main>
      <div class="flex row">
        <!-- desc -->
        <div class="col">
          <h5 class="font-bold">Boost it for</h5>
          <el-input-number v-model="daysNum" :min="1" :max="10" @change="handleChangePrice" />
          <h5 class="text-center">Day/s</h5>
          <h5 class="pt-5 font-bold">Choose Payment Method</h5>
          <div class="py-5">
            <BoostProduct :boostProduct="boostProduct" @paymentSuccess="paymentSuccess" />
          </div>
        </div>
        <!-- img -->
        <div class="col w-full flex justify-end">
          <img :src="this.sampleImage" alt="sample Image" width="250" />
        </div>
      </div>
    </main>
  </el-dialog>
  <!-- END PREVIEW IMAGE DIALOG -->

  <!-- START FORM -->
  <!-- Add New Product Dialog -->
  <el-dialog :before-close="clear" v-model="dialog.product" :title="title" :width="'90%'">
    <!-- Product Image -->
    <div v-loading="isLoadingImage" class="mb-4">
      <el-upload
        class="upload-demo"
        v-model:file-list="fileList"
        action="getUploadTrigger"
        list-type="picture-card"
        :on-success="onSuccess"
        :on-preview="onPreview"
        :on-remove="onRemove"
        :before-upload="beforeUpload"
        method="get"
        accept="image/jpeg, image/png, image/jpg"
        :limit="5"
      >
        <i class="bi bi-plus"></i>
      </el-upload>
    </div>

    <!-- Form -->
    <el-form label-position="top">
      <el-form-item class="mb-4" label="Category">
        <el-radio-group v-model="form.categoryName">
          <el-radio :value="'Vegetables'" size="large">Vegetables</el-radio>
          <el-radio :value="'Fruits'" size="large">Fruits</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item class="mb-4" label="Name">
        <el-input
          v-model="form.productName"
          placeholder="Enter product name"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item class="mb-4" label="Description">
        <el-input
          type="textarea"
          v-model="form.productDescription"
          placeholder="Enter product description"
        />
      </el-form-item>

      <el-form-item class="mb-4" label="Expiration Date">
        <el-date-picker
          label="Expiration Date"
          v-model="form.expiryDate"
          type="date"
          placeholder="Pick date and time"
        />
      </el-form-item>

      <el-form-item class="mb-4" label="Quantity (per kilo)">
        <el-input-number v-model="form.quantity" :min="1" label="Quantity"></el-input-number>
      </el-form-item>

      <el-form-item class="mb-4" label="Price (per kilo)">
        <el-input
          v-model="form.productPrice"
          placeholder="Enter price"
          :formatter="
            (value) => {
              return value.replace(/[^0-9.]/g, '').replace(/(\..*)\..*/g, '$1');
            }
          "
        />
      </el-form-item>
    </el-form>

    <!-- Modal Footer -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm()" class="w-full sm:w-auto">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- END FORM -->

  <!-- START DELIVERY DATE -->
  <el-dialog title="Delivery Date" v-model="dialog.deliveryDate" width="400">
    <el-form label-position="top">
      <el-form-item label="Delivery Schedule">
        <el-date-picker
          :disabled-date="disabledDate"
          v-model="deliveryDate"
          type="date"
          placeholder="Pick date"
        />
      </el-form-item>
      <el-form-item label="Delivery Courier">
        <el-select v-model="courier">
          <el-option
            v-for="(courier, index) in couriers"
            :key="index"
            :label="courier.name"
            :value="courier.name"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        :disabled="deliveryAddress == ''"
        type="primary"
        @click="updateOrderStatus('', 'Approved')"
        >Confirm</el-button
      >
    </template>
  </el-dialog>
  <!-- END DELIVERY DATE -->

  <!-- START REPORT DIALOG -->
  <el-dialog label="Report History" v-model="dialog.report" :width="'90%'">
    <el-table :data="reports" class="w-full">
      <el-table-column label="Reason" prop="reason" />
      <el-table-column label="Reported by" prop="buyerFirstname">
        <template #default="scope">{{
          `${scope.row.buyerFirstname} ${scope.row.buyerLastname}`
        }}</template>
      </el-table-column>
      <el-table-column label="Date/Time Reported" prop="dateTimeCreated">
        <template #default="scope">{{ formatDateTime(scope.row.dateTimeCreated) }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- END REPORT DIALOG -->

  <!-- START BOOST PRODUCT DIALOG -->
  <el-dialog width="90%" label="Boost Product History" v-model="dialog.boostProductHistory">
    <el-table :data="boostProductHistory" class="w-full">
      <el-table-column label="No. of days" prop="numberOfDays" />
      <el-table-column label="Boost Cost" prop="boostCost" />
      <el-table-column label="Expiration Date" prop="expirationDate">
        <template #default="scope">{{ formatDateTime(scope.row.expirationDate) }}</template>
      </el-table-column>
      <el-table-column label="Date/Time Paid" prop="dateTimeCreated">
        <template #default="scope">{{ formatDateTime(scope.row.dateTimeCreated) }}</template>
      </el-table-column>
      <el-table-column label="Is Expired" prop="isExpired" />
    </el-table>
  </el-dialog>
  <!-- END BOOST PRODUCT DIALOG -->
</template>

<script>
import router from '@/router';

import { faker } from '@faker-js/faker';
import { ElMessage, ElLoading } from 'element-plus';
import axios from 'axios';
import BoostProduct from '@/components/BoostProduct.vue';

export default {
  components: { BoostProduct },

  data() {
    return {
      vegetables: [],
      fruits: [],
      selectedRow: {},
      inventoryData: [],
      boostProductPrice: 100,
      boostProduct: {},
      productId: '',
      vegetableInventoryProducts: [],
      fruitInventoryProducts: [],
      couriers: [
        { name: 'J&T Express' },
        { name: 'Lalamove' },
        { name: 'LBC Express' },
        { name: 'Ninja Van' },
        { name: 'Shopee Express' },
        { name: 'Toktok' },
        { name: 'Transportify' },
      ],
      daysNum: 1,
      totalNotifications: '',
      courier: '',
      deliveryDate: '',
      buyerId: '',
      contacts: [],
      messages: [],
      message: '',
      status: '',
      isLoadingImage: false,
      isChangePassword: false,

      form: {
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
        productId: '',
        sellerId: '',
        productName: '',
        productDescription: '',
        expiryDate: '',
        quantity: 1,
        productPrice: '',
        categoryName: 'Vegetables',

        firstname: '',
        lastname: '',
        email: '',
        address: '',
        phone: '',
        password1: '',
        password2: '',
      },
      dialog: {
        product: false,
        previewImage: false,
        deliveryDate: false,
        boostAllProduct: false,
        boostProduct: false,
        report: false,
        boostProductHistory: false,
        inventoryData: false,
      },
      title: '',
      searchProduct: '',
      searchInventory: '',
      searchOrder: '',
      reports: [],
      boostProductHistory: [],
      orders: [],
      products: [],
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
      inventoryPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0,
      },
      fileList: [],

      file: [],
      productImages: [],
      user: {},

      newProduct: {
        type: '', // 'Fruits' or 'Vegetables'
        image: null,
        name: '',
        perishableTime: '',
        quantity: 0,
        price: 0,
        description: '',
      },
      sampleDescription: faker.commerce.productDescription(),
      sampleInt: faker.number.int({ max: 100 }),
      sampleImage: faker.image.avatar(),
      sampleName: faker.person.fullName(),
      sampleEmail: faker.internet.email(),
      sampleNumber: faker.phone.number(),
      sampleAddress: faker.location.secondaryAddress(),
      sampleCity: faker.location.city(),
      toggleViewHomePage: true,
      toggleViewAllProducts: false,
      toggleViewAllNotification: false,
      toggleViewAllPricing: false,
      toggleOrderUpdate: false,
      toggleEditProfile: false,
      toggleViewContact: false,
      toggleViewMessage: false,
      toggleViewFeaturedProducts: true,
      toggleViewOrder: false,
      toggleViewSellerInventory: false,
      toggleVegetableSRP: false,
      toggleFruitSRP: false,

      notifications: [],
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

      contactLoading: false,
      messageLoading: false,
      productLoading: false,
      error: false,
      orderId: '',
    };
  },

  methods: {
    // generateSampleData() {
    //   this.inventoryData = Array.from({ length: 10 }).map(() => ({
    //     product: faker.commerce.productName(),
    //     totalAmount: faker.commerce.price(50, 500, 2, '$'),
    //     totalSold: faker.number.int({ min: 0, max: 100 }),
    //     lastUpdated: faker.date.past().toLocaleDateString(),
    //   }));
    // },
    isButtonDisabled(product) {
      return product.orders && product.orders.some((order) => order.orderStatus === 'Pending');
    },
    disabledDate(time) {
      const date = new Date();
      const previousDate = date.setDate(date.getDate() - 1);
      return time.getTime() < previousDate;
    },
    btnBoostAllProduct() {
      this.dialog.boostAllProduct = true;
    },
    btnBoostProduct(data) {
      //console.log(data);
      this.productId = data.productId;
      this.dialog.boostProduct = true;
      this.boostProduct = {
        productId: data.productId,
        boostCost: this.boostProductPrice * this.daysNum,
        numberOfDays: this.daysNum,
      };
      //console.log(this.boostProduct);
    },
    handleChangePrice(numberOfDays) {
      this.boostProduct.boostCost = this.boostProductPrice * numberOfDays;
      this.boostProduct.numberOfDays = numberOfDays;
      //console.log(this.boostProduct);
    },
    btnOpenDeliveryDate(data) {
      //console.log(data);
      this.orderId = data.orderId;
      this.dialog.deliveryDate = true;
      //console.log(this.orderId);
    },

    btnHandleUpdate(data) {
      console.log(data);
      this.selectedRow = {
        productImage: faker.image.avatar(),
        ...data,
      };
      this.orderId = data.orderId;
      this.dialog.inventoryData = true;
    },
    btnUpdateInventory() {
      console.log('Updated Quantity:', this.form.quantity);
      console.log('Updated Product:', this.selectedRow);
      axios
        .put(
          `${this.url}/Product/${this.selectedRow.productId}/Quantity/${this.form.quantity}?isInventory=true`
        )
        .then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Product quantity updated');
            this.btnViewSellerInventory();
            this.form.quantity = 1;
          }
        });
      // Add your logic to update inventory
      this.dialog.inventoryData = false; // Close dialog
    },
    btnVegetableSRP() {
      this.toggleVegetableSRP = true;
      this.toggleFruitSRP = false;
      if (this.toggleVegetableSRP && this.vegetableInventoryProducts.length === 0) {
        this.generateFakeVegetables();
      }
      this.getVegetables();
    },
    // Method for toggling fruit SRP
    btnFruitSRP() {
      this.toggleFruitSRP = true;
      this.toggleVegetableSRP = false;
      if (this.toggleFruitSRP && this.fruitInventoryProducts.length === 0) {
        this.generateFakeFruits();
      }
      this.getFruits();
    },
    // Generate fake vegetable products using Faker.js
    generateFakeVegetables() {
      this.vegetableInventoryProducts = Array.from({ length: 10 }).map(() => ({
        image: faker.image.avatar(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(1, 10, 2),
      }));
      console.log('vegetableInventoryProducts', this.vegetableInventoryProduct);
    },
    // Generate fake fruit products using Faker.js
    generateFakeFruits() {
      this.fruitInventoryProducts = Array.from({ length: 10 }).map(() => ({
        image: faker.image.avatar(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(1, 10, 2),
      }));
      console.log('fruitInventoryProducts', this.fruitInventoryProducts);
    },
    btnViewAllPrices() {
      this.toggleViewAllPricing = true;

      this.toggleViewSellerInventory = false;
      this.toggleViewHomePage = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewAllProducts = false;
      this.toggleViewAllNotification = false;
      this.toggleOrderUpdate = false;
      this.toggleEditProfile = false;
      this.toggleViewContact = false;
      this.toggleViewMessage = false;
      this.toggleViewOrder = false;
      this.toggleVegetableSRP = true;
      this.toggleFruitSRP = false;
      this.toggleViewFeaturedProducts = false;
    },
    btnViewSellerInventory() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Order/Inventory/User/${this.user.userId}?search=${this.searchInventory}&currentPage=${this.inventoryPagination.currentPage}&elementsPerPage=${this.inventoryPagination.elementsPerPage}`
        )
        .then((response) => {
          this.inventoryData = response.data.results;
          this.inventoryPagination.totalElements = response.data.totalElements;
          loading.close();
        });
      this.toggleViewAllPricing = false;
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = true;
      this.toggleViewHomePage = true;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewAllProducts = false;
      this.toggleViewAllNotification = false;
      this.toggleOrderUpdate = false;
      this.toggleEditProfile = false;
      this.toggleViewContact = false;
      this.toggleViewMessage = false;
      this.toggleViewOrder = false;
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },
    btnViewMessage(buyerId) {
      //console.log(buyerId);
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewOrder = false;
      this.messageLoading = true; // LOADING
      this.viewMessage(buyerId);
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
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },

    // VIEW CONTACTS
    btnViewContacts() {
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewOrder = false;
      this.contactLoading = true; // LOADING
      this.buyerId = '';
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
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },

    btnViewAllProducts() {
      this.getProduct('', this.user.userId);

      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewMessage = false;
      this.toggleViewOrder = false;
      this.toggleViewContact = false;
      this.toggleViewAllProducts = true;
      this.toggleViewHomePage = false;
      this.toggleViewAllNotification = false;
      this.toggleEditProfile = false;
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },
    btnViewAllNotifications() {
      this.getTotalNotifications();
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewMessage = false;
      this.toggleViewOrder = false;
      this.toggleViewContact = false;
      this.getNotificationByUserId();
      this.title = '';
      this.fileList = [];
      this.file = [];
      this.toggleViewProfile = false;
      this.toggleViewAllNotification = true;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleEditProfile = false;
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },
    btnViewHomePage() {
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewMessage = false;
      this.toggleViewOrder = false;
      this.toggleViewContact = false;
      this.title = '';
      this.fileList = [];
      this.file = [];
      this.getProduct('', this.user.userId);
      this.toggleViewHomePage = true;
      this.toggleViewFeaturedProducts = true;
      this.toggleViewAllNotification = false;
      this.toggleViewAllProducts = false;
      this.toggleViewProfile = false;
      this.toggleEditProfile = false;
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },
    btnOpenOrderUpdate() {
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewMessage = false;

      this.toggleViewContact = false;
      this.toggleOrderUpdate = true;
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },
    btnOpenProfile() {
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.getUser();
      this.toggleViewMessage = false;
      this.toggleViewOrder = false;
      this.toggleViewContact = false;
      this.title = '';
      this.fileList = [];
      this.file = [];
      this.toggleViewProfile = true;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleOrderUpdate = false;
      this.toggleViewAllNotification = false;
      this.toggleEditProfile = false;
      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
    },
    btnEditProfile() {
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
      this.toggleViewFeaturedProducts = false;
      this.toggleViewMessage = false;

      this.toggleVegetableSRP = false;
      this.toggleFruitSRP = false;
      this.toggleViewContact = false;
      this.title = 'Update User';
      //console.log(this.title);
      this.fileList = [];
      this.file = [];
      this.form.firstname = this.user.firstname;
      this.form.lastname = this.user.lastname;
      this.form.email = this.user.email;
      this.form.address = this.user.address;
      this.form.phone = this.user.phone;
      this.toggleViewOrder = false;
      this.toggleViewProfile = false;
      this.toggleEditProfile = true;
      this.toggleViewAllProducts = false;
      this.toggleViewHomePage = false;
      this.toggleOrderUpdate = false;
      this.toggleViewAllNotification = false;
    },
    logout() {
      localStorage.clear();
      window.location.replace('/login');
    },

    openForm(title, data) {
      this.fileList = [];
      this.file = [];
      // ADD PRODUCT
      if (title == 'Add Product') {
        //console.log('ADD');
        this.title = 'Add Product';
        this.dialog.product = true;
        return;
      }
      // EDIT PRODUCT
      if (title === 'Edit Product') {
        this.dialog.product = true;
        this.title = 'Edit Product';
        this.toggleViewOrder = false;
        this.form.productId = data.productId;
        this.form.productName = data.productName;
        this.form.productDescription = data.productDescription;
        this.form.expiryDate = data.expiryDate;
        this.form.quantity = data.quantity;
        this.form.productPrice = data.productPrice;
        this.form.categoryName = data.categoryName;

        this.isLoadingImage = true;

        let loadedImagesCount = 0;
        const totalImages = data.productFiles.length;

        for (let i = 0; i < totalImages; i++) {
          const productFileId = data.productFiles[i].productFileId;

          axios
            .get(`${this.url}/ProductFile/${productFileId}`, {
              responseType: 'arraybuffer',
            })
            .then((response) => {
              //console.log(response);
              if (response.data == 'No image not found') {
                ElMessage.error('Image has been deleted from the server');
                return;
              }
              const base64Image = btoa(
                new Uint8Array(response.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              );

              this.fileList.push({
                name: '',
                url: `data:${response.headers['content-type']};base64,${base64Image}`,
                type: response.headers['content-type'],
                fileId: productFileId,
              });

              loadedImagesCount++;

              if (loadedImagesCount === totalImages) {
                this.isLoadingImage = false;
              }
            });
        }

        //console.log(this.file);
        //console.log(this.fileList);
        return;
      }
    },

    // VIEW PRODUCT
    btnViewProduct(data) {
      this.toggleViewMessage = false;

      this.toggleViewContact = false;
      //console.log('PRODUCT DETAILS: ', data);

      // Ensure productDetails is defined
      if (!this.form.productDetails) {
        this.form.productDetails = {};
      }
      this.toggleViewOrder = false;
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

      axios.get(`${this.url}/ProductFile/${data.productId}`).then((response) => {
        this.productImages = response.data;
      });

      this.toggleViewOrder = false;
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

    // DELETE NOTIFICATION
    deleteNotification(notificationId) {
      axios.delete(`${this.url}/Notification/${notificationId}`).then(() => {
        this.getNotificationByUserId();
        this.getTotalNotifications();
      });
    },

    // GET NOTIFICATION BY USER ID
    getNotificationByUserId() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(`${this.url}/Notification/${this.user.userId}?isPaginated=false`)
        .then((response) => {
          this.notifications = response.data;
          loading.close();
        });
    },

    // GET TOTAL NOTIFICATION
    getTotalNotifications() {
      axios
        .get(`${this.url}/Notification/${this.user.userId}?isPaginated=true`)
        .then((response) => {
          this.totalNotifications = response.data.totalElements;
          //console.log(this.totalNotifications);
        });
    },

    disableProduct(product) {
      axios.delete(`${this.url}/Product/${product.productId}/User`).then((response) => {
        if (response.data == 'success') {
          if (product.isDisabled == true) {
            ElMessage.success('Product disabled');
          } else {
            ElMessage.success('Product enabled');
          }
          this.getProduct('', this.user.userId);
        } else {
          ElMessage.error('Failed to delete product');
        }
      });
    },

    // GET PRODUCT
    getProduct(data, userId) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Product/User/${userId}?search=${data}&currentPage=${this.productPagination.currentPage}&elementsPerPage=${this.productPagination.elementsPerPage}`
        )
        .then((response) => {
          this.products = response.data.results;
          //console.log('PRODUCTS: ', this.products);
          this.productPagination.totalElements = response.data.totalElements;
          loading.close();
        });
    },

    // GUID GENERATOR
    uuidv4() {
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
      );
    },

    // SUBMIT FORM
    submitForm() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      if (this.title == 'Add Product') {
        const expiryDate = new Date(this.form.expiryDate);
        expiryDate.setHours(expiryDate.getHours() + 8);
        const expiryDateISO = expiryDate.toISOString();
        const productId = this.uuidv4();
        const payload = {
          productId: productId,
          sellerId: this.user.userId,
          productName: this.form.productName,
          productDescription: this.form.productDescription,
          expiryDate: expiryDateISO,
          quantity: this.form.quantity,
          productPrice: this.form.productPrice,
          categoryName: this.form.categoryName,
        };
        // ADD PRODUCT
        axios.post(`${this.url}/Product`, payload).then((response) => {
          if (response.data == 'success') {
            // CHECK FILE HAS IMAGES
            if (this.file.length > 0) {
              const formData = new FormData();
              this.file.forEach((file) => {
                formData.append('productId', productId);
                formData.append('files', file);
              });
              // ADD PRODUCT FILES
              axios.post(`${this.url}/ProductFile`, formData).then((response1) => {
                if (response1.data == 'success') {
                  ElMessage.success('Product added successfully');
                  this.getProduct('', this.user.userId);
                  this.dialog.product = false;
                } else {
                  ElMessage.error('Failed to add product');
                }
                loading.close();
              });
              this.form.productName = '';
              this.form.productDescription = '';
              this.form.expiryDate = '';
              this.form.quantity = 0;
              this.form.productPrice = '';
            } else {
              ElMessage.error('Failed to add product');
            }
          } else {
            ElMessage.error('Failed to add product');
          }
        });
        return;
      }
      // EDIT PRODUCT
      else if (this.title == 'Edit Product') {
        const expiryDate = new Date(this.form.expiryDate);
        expiryDate.setHours(expiryDate.getHours() + 8);
        const expiryDateISO = expiryDate.toISOString();
        var payload = {
          productName: this.form.productName,
          productDescription: this.form.productDescription,
          expiryDate: expiryDateISO,
          quantity: this.form.quantity,
          productPrice: this.form.productPrice,
          categoryName: this.form.categoryName,
        };
        axios.put(`${this.url}/Product/${this.form.productId}`, payload).then((response) => {
          if (response.data == 'success') {
            // CHECK FILE HAS IMAGES
            if (this.file.length > 0) {
              const formData = new FormData();
              this.file.forEach((file) => {
                formData.append('productId', this.form.productId);
                formData.append('files', file);
              });
              // ADD PRODUCT FILES
              axios.post(`${this.url}/ProductFile`, formData).then((response1) => {
                if (response1.data == 'success') {
                  ElMessage.success('Product updated successfully');
                  this.getProduct('', this.user.userId);
                  this.dialog.product = false;
                } else {
                  ElMessage.error('Failed to update product');
                }
                loading.close();
              });
            }
            // UPDATE DIRECLTY
            else {
              ElMessage.success('Product update successfully');
              this.getProduct('', this.user.userId);
              loading.close();
              this.dialog.product = false;
            }
          } else {
            ElMessage.error('Failed to update product');
          }
        });
        return;
      }

      // UPDATE USER
      if (this.title == 'Update User') {
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
    // SEND MESSAGE
    sendMessage() {
      const payload = {
        message: this.message,
        buyerId: this.user.userId,
        sellerId: this.buyerId,
      };
      axios.post(`${this.url}/Message`, payload).then(() => {
        this.message = '';
        this.viewMessage(this.buyerId);
      });
    },

    getOrderByUserId() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios
        .get(
          `${this.url}/Order?search=${this.searchOrder}&sellerId=${this.user.userId}&currentPage=${this.orderPagination.currentPage}&elementsPerPage=${this.orderPagination.elementsPerPage}`
        )
        .then((response) => {
          this.orders = response.data.results;
          this.orderPagination.totalElements = response.data.totalElements;
          loading.close();
        })
        .catch((e) => {
          loading.close();
        });
    },

    // VIEW ORDER
    btnViewOrder() {
      this.getOrderByUserId();
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
      this.toggleViewFeaturedProducts = false;
      this.toggleViewAllPricing = false;
      this.toggleViewSellerInventory = false;
    },

    // VIEW MESSAGE
    viewMessage(buyerId) {
      this.buyerId = buyerId;
      axios
        .get(`${this.url}/Message/Buyer/${buyerId}/Seller/${this.user.userId}`)
        .then((response) => {
          this.messages = response.data;
          this.messageLoading = false;
        });
    },

    // GET CONTACT
    getContact() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios.get(`${this.url}/Message?sellerId=${this.user.userId}`).then((response) => {
        this.contacts = response.data;
        this.contactLoading = false;
        loading.close();
      });
    },

    // GET USER
    getUser() {
      axios.get(`${this.url}/User/${this.user.userId}`).then((response) => {
        this.user = response.data;
      });
    },

    // DELETE PRODUCT
    deleteProduct(productId) {
      axios.delete(`${this.url}/Product/${productId}`).then((response) => {
        if (response.data == 'success') {
          ElMessage.success('Product deleted successfully');
          this.getProduct('', this.user.userId);
        } else {
          ElMessage.error('Failed to delete product');
        }
      });
    },

    // PREVIEW IMAGE
    onPreview(file) {
      this.previewImg = file.url || file.thumbUrl || URL.createObjectURL(file.raw);
      this.dialog.previewImage = true;
      //console.log(file.url);
      //console.log(file.thumbUrl);
      //console.log(file);
      //console.log('AW');
    },

    // SELECTED IMAGES
    onSuccess(res, file) {
      this.file.push(file.raw);
      //console.log(this.file);
    },

    // REMOVE SELECTED IMAGE
    onRemove(file) {
      if (file.fileId != null || file.fileId != undefined) {
        axios.delete(`${this.url}/ProductFile/${file.fileId}`).then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Image delete successfully');
          } else {
            ElMessage.error('Failed to delete image');
          }
        });
      } else {
        this.file = this.file.filter((f) => f.uid !== file.uid);
      }
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

    updateOrderStatus(data, status) {
      let deliveryDate = '';
      if (this.deliveryDate != '') {
        deliveryDate = new Date(this.deliveryDate);
        deliveryDate.setHours(deliveryDate.getHours() + 8);
      }

      let deliveryDateISO = deliveryDate ? deliveryDate.toISOString() : null;
      if (status == 'Out for delivery' || status == 'Settle') {
        const payload = {
          orderStatus: status,
          orderDateReceived: null,
          deliveryDate: data.deliveryDate,
          deliveryCourier: data.deliveryCourier,
        };
        axios
          .put(`${this.url}/Order/${this.orderId != '' ? this.orderId : data.orderId}`, payload)
          .then((response) => {
            if (response.data == 'success') {
              ElMessage.success('Order updated successfully');
              this.btnViewOrder();
              this.dialog.deliveryDate = false;
              this.deliveryDate = '';
              this.courier = '';
            } else {
              ElMessage.error('Failed to update order');
            }
          });
        return;
      }
      const payload = {
        orderStatus: status,
        orderDateReceived: null,
        deliveryDate: deliveryDateISO,
        deliveryCourier: this.courier,
      };
      axios
        .put(`${this.url}/Order/${this.orderId != '' ? this.orderId : data.orderId}`, payload)
        .then((response) => {
          if (response.data == 'success') {
            ElMessage.success('Order updated successfully');
            this.btnViewOrder();
            this.dialog.deliveryDate = false;
            this.deliveryDate = '';
            this.courier = '';
          } else {
            ElMessage.error('Failed to update order');
          }
        });
    },

    getBoostProductByProductId(productId) {
      axios.get(`${this.url}/BoostedProduct/${productId}`).then((response) => {
        this.dialog.boostProductHistory = true;
        this.boostProductHistory = response.data;
      });
    },

    getReportByProductId(productId) {
      axios.get(`${this.url}/Report/${productId}`).then((response) => {
        this.dialog.report = true;

        this.reports = response.data;
      });
    },

    clear() {
      this.getProduct('', this.user.userId);
      this.isLoadingImage = false;
      this.dialog.product = false;
      this.dialog.previewImage = false;
      this.fileList = [];
      this.file = [];
      this.form.productName = '';
      this.form.productDescription = '';
      this.form.expiryDate = '';
      this.form.quantity = 0;
      this.form.productPrice = 0;
      this.form.categoryName = 'Vegetables';
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

    getVegetables() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios.get(`${this.url}/ProductReference?search=&isVegetables=true`).then((response) => {
        this.vegetables = response.data;
        this.tableLoading = false;
        loading.close();
      });
    },
    getFruits() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Please wait...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      axios.get(`${this.url}/ProductReference?search=&isFruits=true`).then((response) => {
        this.fruits = response.data;
        this.tableLoading = false;
        loading.close();
      });
    },
  },
  watch: {
    paymentSuccess() {
      if (this.paymentSuccess == 'Payment successful') {
        ElMessage.success(this.paymentSuccess);
      } else {
        ElMessage.error(this.paymentSuccess);
      }
    },
  },
  mounted() {
    // this.generateSampleData();

    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      router.push('login');
      ElMessage.error('Please login first');
    }
    this.getTotalNotifications();
    this.getOrderByUserId();
    this.getProduct('', this.user.userId);
    this.getVegetables();
    this.getFruits();
    //console.log(this.user);
  },
};
</script>

<style></style>
