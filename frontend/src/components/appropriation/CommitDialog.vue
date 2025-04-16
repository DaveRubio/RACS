<template>
  <q-dialog v-model="appropriationStore.showAllocationDialog" persistent>
    <q-card class="allocation-card">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Allocate Amounts</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-mb-md">
          <div class="col-md-6 col-12 q-mb-sm">
            <strong>Total:</strong>
            {{ appropriationStore.formatCurrency(appropriationStore.selectedRow.total) }}
          </div>
          <div class="col-md-6 col-12">
            <strong>Total Unappropriated:</strong>
            {{ appropriationStore.formatCurrency(appropriationStore.remainingUnappropriated) }}
          </div>
        </div>

        <q-input
          outlined
          dense
          placeholder="Search accounts..."
          class="q-mb-md"
          v-model="appropriationStore.searchQuery"
          style="max-width: 500px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          flat
          bordered
          :rows="appropriationStore.filteredAccounts"
          :columns="appropriationStore.accountColumns"
          :pagination="{ rowsPerPage: appropriationStore.recordsPerPage }"
          row-key="id"
          hide-pagination
          class="allocation-table"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                :class="{
                  'text-weight-bold': props.row.isMainCategory,
                  'q-pl-lg': props.row.indent > 0,
                }"
              >
                {{ props.row.name }}
              </q-td>
              <q-td>
                <q-input
                  v-if="!props.row.isMainCategory"
                  dense
                  outlined
                  v-model="props.row.amount"
                  prefix="₱"
                  mask="#,##0.00"
                  fill-mask="0"
                  reverse-fill-mask
                  :rules="[(val) => validateAmount(val) || 'Invalid amount']"
                  @update:model-value="updateUnappropriated"
                />
                <div v-else class="text-right">
                  {{ appropriationStore.formatCurrency(getMainCategoryTotal(props.row.id)) }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row items-center q-mt-md">
          <div class="col-auto">
            <q-select
              outlined
              dense
              :options="[5, 10, 20, 50]"
              v-model="appropriationStore.recordsPerPage"
              label="Records per page"
              style="width: 150px"
            />
          </div>
          <div class="col q-ml-sm">
            {{ paginationRange }}
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn
          label="Save"
          color="primary"
          @click="appropriationStore.saveAllocation"
          :disable="appropriationStore.remainingUnappropriated < 0"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useAppropriationStore } from '../../stores/appropriationStore'
import { computed } from 'vue'

const appropriationStore = useAppropriationStore()

// Calculate main category totals
const getMainCategoryTotal = (id) => {
  const mainCat = appropriationStore.accounts.find((a) => a.id === id)
  if (!mainCat) return 0

  return mainCat.children.reduce((sum, child) => {
    const amount = parseFloat(child.amount?.replace(/,/g, '')) || 0
    return sum + amount
  }, 0)
}

// Validate amount input
const validateAmount = (val) => {
  if (!val) return true
  const amount = parseFloat(val.replace(/,/g, ''))
  return !isNaN(amount) && amount >= 0
}

// Update unappropriated amount automatically
const updateUnappropriated = () => {
  appropriationStore.selectedRow.unappropriated = appropriationStore.remainingUnappropriated
}

// Pagination display text
const paginationRange = computed(() => {
  const pageSize = appropriationStore.recordsPerPage
  const total = appropriationStore.filteredAccounts.length
  const end = Math.min(pageSize, total)
  return `1-${end} of ${total}`
})
</script>

<style scoped>
.allocation-card {
  min-width: 300px;
  max-width: 1000px;
  width: 90vw;
}

.allocation-table {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 600px) {
  .allocation-card {
    width: 95vw;
  }

  .q-table {
    font-size: 0.9rem;
  }

  .q-input {
    font-size: 0.9rem;
  }
}
</style>
