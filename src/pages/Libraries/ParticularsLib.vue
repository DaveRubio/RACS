<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-weight-bold">Particulars</div>
    </div>

    <!-- Search and Date Filter -->
    <div class="q-mb-md">
      <div class="row items-center justify-between q-gutter-sm">
        <!-- Search Input -->
        <q-input
          outlined
          dense
          placeholder="Search..."
          class="col-md-3 col-sm-5 custom-search-input"
          style="min-width: 450px"
          v-model="searchTerm"
          @update:model-value="filterParticulars"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="t q-px-xl"></div>

        <!-- Add Button -->
        <q-btn label="Add" icon="add" class="add-table-btn" @click="showAddDialog" />
      </div>

      <!-- Add/Edit Dialog -->
      <q-dialog v-model="showDialog">
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">{{ dialogTitle }}</div>
          </q-card-section>
          <div><br /></div>
          <q-card-section class="q-pt-none">
            <div class="q-mb-md">
              <strong>Particular:</strong><br />
              <q-input
                filled
                v-model="currentParticular.particular"
                placeholder="Budget for 2025"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right" class="custom-actions">
            <q-btn flat label="Cancel" v-close-popup class="modal-cancel-btn" />
            <q-btn label="Save" class="modal-save-btn" @click="saveParticular" />
          </q-card-actions>
          <div><br /></div>
        </q-card>
      </q-dialog>
    </div>

    <!-- Data Table -->
    <q-card>
      <q-table
        :rows="filteredParticulars"
        :columns="particularColumns"
        row-key="id"
        :pagination="pagination"
      >
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="button-group">
              <q-btn class="edit-btn" icon="edit" @click="editParticular(props.row)" />
              <q-btn class="delete-btn" icon="delete" @click="confirmDeleteParticular(props.row)" />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { useParticularStore } from 'src/stores/particularStore'
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'

const store = useParticularStore()
// Access store properties properly
const particularColumns = store.particularColumns
// Data
const showDialog = ref(false)
const dialogTitle = ref('Add Particular')
const currentParticular = ref({
  id: null,
  particular: '',
  date: '',
})
const searchTerm = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Pagination
const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
})

// Computed properties
const filteredParticulars = computed(() => {
  let filtered = store.particularRow

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (item) => item.particular.toLowerCase().includes(term) || item.id.toString().includes(term),
    )
  }

  // Filter by date range
  if (dateFrom.value || dateTo.value) {
    const fromDate = dateFrom.value ? date.extractDate(dateFrom.value, 'DD/MM/YYYY') : null
    const toDate = dateTo.value ? date.extractDate(dateTo.value, 'DD/MM/YYYY') : null

    filtered = filtered.filter((item) => {
      const itemDate = item.date ? date.extractDate(item.date, 'DD/MM/YYYY') : null

      if (fromDate && itemDate) {
        if (date.getDateDiff(fromDate, itemDate) > 0) return false
      }
      if (toDate && itemDate) {
        if (date.getDateDiff(itemDate, toDate) > 0) return false
      }
      return true
    })
  }

  return filtered
})

// Methods
const showAddDialog = () => {
  currentParticular.value = { id: null, particular: '', date: formatDate(new Date()) }
  dialogTitle.value = 'Add Particular'
  showDialog.value = true
}

const editParticular = (particular) => {
  currentParticular.value = { ...particular }
  dialogTitle.value = 'Edit Particular'
  showDialog.value = true
}

const saveParticular = () => {
  if (!currentParticular.value.particular.trim()) return

  if (currentParticular.value.id) {
    // Update existing
    const index = store.particularRow.findIndex((p) => p.id === currentParticular.value.id)
    if (index !== -1) {
      store.particularRow[index] = { ...currentParticular.value }
    }
  } else {
    // Add new
    const newId =
      store.particularRow.length > 0 ? Math.max(...store.particularRow.map((p) => p.id)) + 1 : 1
    store.particularRow.push({
      id: newId,
      particular: currentParticular.value.particular,
      date: formatDate(new Date()),
    })
  }

  showDialog.value = false
}

const confirmDeleteParticular = (particular) => {
  if (confirm(`Are you sure you want to delete "${particular.particular}"?`)) {
    deleteParticular(particular)
  }
}

const deleteParticular = (particular) => {
  store.particularRow = store.particularRow.filter((p) => p.id !== particular.id)
}

const filterParticulars = () => {
  // The computed property filteredParticulars will automatically update
}

const formatDate = (dateObj) => {
  return date.formatDate(dateObj, 'DD/MM/YYYY')
}

// Initialize with some sample data if empty
onMounted(() => {
  if (store.particularRow.length === 0) {
    store.particularRow = [
      {
        id: 1,
        particular: 'Office Supplies',
        date: formatDate(new Date()),
      },
      {
        id: 2,
        particular: 'Travel Expenses',
        date: formatDate(new Date()),
      },
      {
        id: 3,
        particular: 'Equipment Maintenance',
        date: formatDate(new Date()),
      },
    ]
  }
})
</script>

<style scoped>
/* Your existing styles remain unchanged */
</style>
