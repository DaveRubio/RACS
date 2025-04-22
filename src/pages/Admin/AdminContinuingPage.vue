<template>
  <div class="q-pa-md">
    <!-- Barangay Selector Dropdown -->
    <q-btn-dropdown color="primary" :label="selectedBarangay" class="barangay-selector-dropdown">
      <q-list>
        <q-item
          v-for="barangay in barangays"
          :key="barangay"
          clickable
          v-close-popup
          @click="updateBarangayAccounts(barangay)"
        >
          <q-item-section>
            <q-item-label>{{ barangay }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <!-- Continuing Account Table -->
    <q-table
      flat
      bordered
      :rows="barangayAccounts"
      :columns="columns"
      row-key="id"
      class="continuing-accounts-table"
      :pagination="{ rowsPerPage: 10 }"
    />
  </div>
</template>

<script>
export default {
  name: 'ContinuingAccountsPage',
  data() {
    return {
      selectedBarangay: 'Apokon', // Default barangay
      barangays: [
        'Apokon',
        'Bincungan',
        'Busaon',
        'Canocotan',
        'Cuambogan',
        'La Filipina',
        'Liboganon',
        'Madaum',
        'Magdum',
        'Mankilam',
        'New Balamban',
        'Nueva Fuerza',
        'Pagsabangan',
        'Pandapan',
        'Magugpo Poblacion',
        'San Agustin',
        'San Isidro',
        'San Miguel (Camp 4)',
        'Visayan Village',
        'Magugpo East',
        'Magugpo North',
        'Magugpo South',
        'Magugpo West',
      ],
      barangayAccounts: [
        { id: 1, account: 'Account 1', amount: '20,000.00' },
        { id: 2, account: 'Account 2', amount: '25,000.00' },
      ], // Default data for Apokon
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
        { name: 'account', label: 'Account', field: 'account', align: 'left', sortable: true },
        { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
      ],
    }
  },
  methods: {
    updateBarangayAccounts(barangay) {
      // Update the selected barangay and populate new data
      this.selectedBarangay = barangay
      this.barangayAccounts = [
        { id: 1, account: 'Account 1', amount: '20,000.00' },
        { id: 2, account: 'Account 2', amount: '25,000.00' },
      ]
    },
  },
}
</script>

<style scoped>
.barangay-selector-dropdown {
  margin-bottom: 20px;
}
.continuing-accounts-table {
  margin-top: 20px;
}
</style>
