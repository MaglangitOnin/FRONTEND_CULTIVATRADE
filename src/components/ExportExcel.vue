<template>
  <button @click="exportToExcel">Export Data</button>
</template>

<script>
import * as XLSX from 'xlsx'; // Import the xlsx library

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    exportToExcel() {
      if (!this.data || this.data.length === 0) {
        alert('No data to export');
        return;
      }

      // Convert JSON data to worksheet
      const ws = XLSX.utils.json_to_sheet(this.data);

      // Create a new workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Write the workbook to an Excel file
      XLSX.writeFile(wb, 'exported_data.xlsx');
    },
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
