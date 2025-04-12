<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-weight-bold">Accounts Library</div>
    </div>

    <!-- Top Controls -->
    <!-- Main Card -->
    <q-card
      class="q-pa-none shadow-3 rounded-borders q-mx-auto"
      style="overflow: hidden; max-width: 900px; height: 70vh"
    >
      <!-- Header Section -->
      <div class="row items-center justify-between bg-grey-3 q-pa-md">
        <q-select
          dense
          outlined
          label="Select Year"
          v-model="selectedYear"
          :options="years"
          style="width: 300px"
        />
        <div>
          <q-btn
            icon="add"
            label="Add Year"
            class="allocate-btn"
            @click="showAddYearDialog = true"
          />
          <q-btn
            icon="content_copy"
            label="Copy to Another Year"
            @click="showCopyDialog = true"
            :disable="!selectedYear || years.length < 2"
            class="q-ml-sm allocate-btn"
          />
        </div>
      </div>

      <!-- Inner Content Card -->
      <q-card flat class="q-pt-xs rounded-borders bg-white">
        <!-- Add Account Button -->
        <div class="scroll-content q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <!-- Search Input (left-aligned) -->
            <q-input
              v-model="searchQuery"
              dense
              outlined
              placeholder="Search..."
              class="col-md-4 col-sm-6 col-xs-12"
              style="min-width: 300px"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Add Account Button (right-aligned) -->
            <q-btn
              icon="add"
              label="Add Account"
              @click="showAddAccountDialog = true"
              :disable="!selectedYear"
              class="col-auto allocate-btn"
            />
          </div>

          <!-- Account Entries -->
          <div style="max-height: calc(70vh - 150px); overflow-y: auto">
            <template v-for="expenseClass in filteredExpenseClasses" :key="expenseClass.id">
              <div
                @mouseover="hoveredClass = expenseClass.id"
                @mouseleave="hoveredClass = null"
              ></div>
              <q-card flat bordered class="q-mb-sm shadow-1">
                <q-expansion-item
                  v-model="expandedClasses[expenseClass.id]"
                  class="rounded-borders"
                  header-class="q-pa-none"
                  expand-icon-class="hidden"
                  dense
                >
                  <template #header>
                    <div
                      class="bg-white q-pa-md full-width row items-center justify-between rounded-borders"
                      style="border: 1px solid #e0e0e0"
                    >
                      <div class="text-body1 text-weight-medium">{{ expenseClass.name }}</div>
                      <div class="row items-center q-gutter-sm">
                        <q-btn
                          dense
                          flat
                          round
                          icon="edit"
                          class="edit-btn"
                          @click.stop="editExpenseClass(expenseClass)"
                        />
                        <q-btn
                          dense
                          flat
                          round
                          icon="delete"
                          class="delete-btn"
                          @click.stop="confirmDeleteExpenseClass(expenseClass)"
                        />
                        <q-icon
                          :name="expandedClasses[expenseClass.id] ? 'expand_less' : 'expand_more'"
                          color="grey"
                        />
                      </div>
                    </div>
                  </template>

                  <!-- Expanded Content -->
                  <div class="q-pa-md">
                    <div class="text-subtitle1 text-weight-medium q-mb-xs"></div>
                    <div class="text-caption text-grey-7 q-mb-md">
                      Expenses under {{ expenseClass.name }}
                    </div>

                    <template
                      v-for="expenseType in getExpenseTypesForClass(expenseClass.id)"
                      :key="expenseType.id"
                    >
                      <div
                        @mouseover="hoveredType = expenseClass.id"
                        @mouseleave="hoveredType = null"
                      ></div>
                      <q-card flat bordered class="q-mb-xs shadow-1">
                        <div class="q-pa-md row items-center justify-between">
                          <div class="text-body2">{{ expenseType.name }}</div>
                          <div class="row items-center q-gutter-xs">
                            <q-btn
                              dense
                              flat
                              round
                              icon="edit"
                              class="edit-btn"
                              @click="editExpenseType(expenseType)"
                            />
                            <q-btn
                              dense
                              flat
                              round
                              icon="delete"
                              class="delete-btn"
                              @click="confirmDeleteExpenseType(expenseType)"
                            />
                          </div>
                        </div>
                      </q-card>
                    </template>
                  </div>
                </q-expansion-item>
              </q-card>
            </template>
          </div>
        </div>
      </q-card>
    </q-card>

    <!-- Add Year Dialog -->
    <q-dialog v-model="showAddYearDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add New Year</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newYear"
            filled
            label="Year"
            type="number"
            outlined
            :rules="[
              (val) => !!val || 'Year is required',
              (val) => val.length === 4 || 'Year must be 4 digits',
              (val) => !years.includes(val) || 'Year already exists',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" class="modal-save-btn" @click="addYear" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Account Dialog -->
    <q-dialog v-model="showAddAccountDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Account</div>
        </q-card-section>

        <q-card-section>
          <!-- Expense Class -->
          <q-select
            v-model="newExpenseClass"
            :options="expenseClassOptions"
            label="Expense Class"
            outlined
            use-input
            input-debounce="0"
            @filter="filterExpenseClasses"
            @new-value="createExpenseClass"
            :rules="[(val) => !!val || 'Expense Class is required']"
          >
            <template v-slot:after>
              <q-btn round dense flat icon="add" @click="newExpenseClass = 'Other'" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">No results</q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Custom Class Input -->
          <q-input
            v-if="newExpenseClass === 'Other'"
            v-model="customExpenseClass"
            filled
            label="Specify Expense Class"
            outlined
            class="q-mt-md"
            :rules="[(val) => !!val || 'Required when selecting Other']"
          />

          <!-- Expense Types -->
          <div class="text-subtitle2 q-mt-md q-mb-sm">Expense Types</div>
          <div
            v-for="(type, index) in expenseTypeInputs"
            :key="index"
            class="row items-center q-mb-sm"
          >
            <q-input
              v-model="type.value"
              filled
              outlined
              dense
              class="col-grow"
              :rules="[(val) => !!val || 'Expense Type is required']"
            />
            <q-btn
              v-if="expenseTypeInputs.length > 1"
              flat
              round
              dense
              icon="remove"
              color="negative"
              class="q-ml-sm"
              @click="removeExpenseTypeInput(index)"
            />
          </div>

          <q-btn
            filled
            label="Add Another Expense Type"
            flat
            color="primary"
            icon="add"
            dense
            @click="addExpenseTypeInput"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="resetAccountForm" />
          <q-btn flat label="Save" class="modal-save-btn" @click="saveAccount" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCopyDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Copy to Another Year</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Select Target Year:</div>
          <q-select
            v-model="copyTargetYear"
            :options="years.filter((y) => y !== selectedYear)"
            label="Target Year"
            outlined
            :rules="[(val) => !!val || 'Required']"
            @update:model-value="checkForDuplicates"
          />

          <div v-if="duplicateWarning" class="text-warning q-mt-sm q-mb-sm">
            <q-icon name="warning" /> {{ duplicateWarning }}
          </div>

          <div class="text-subtitle2 q-mt-md q-mb-sm">Select Classes to Copy:</div>
          <q-list bordered>
            <q-item
              v-for="expenseClass in filteredExpenseClasses"
              :key="expenseClass.id"
              tag="label"
            >
              <q-item-section side>
                <q-checkbox
                  v-model="selectedClassesToCopy"
                  :val="expenseClass.id"
                  :disable="classExistsInYear(expenseClass.name, copyTargetYear)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ expenseClass.name }}</q-item-label>
                <q-item-label caption>
                  {{ getExpenseTypesForClass(expenseClass.id).length }} types
                  <span
                    v-if="classExistsInYear(expenseClass.name, copyTargetYear)"
                    class="text-warning"
                  >
                    (Already exists in {{ copyTargetYear }})
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Copy" class="modal-save-btn" @click="copyClassesToYear" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Dialogs and Delete Confirmations -->
    <q-dialog v-model="showEditClassDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Edit Expense Class</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editingExpenseClass.name"
            label="Expense Class Name"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateExpenseClass" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Expense Type Dialog -->
    <q-dialog v-model="showEditTypeDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Edit Expense Type</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editingExpenseType.name"
            label="Expense Type Name"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateExpenseType" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>

        <q-card-section> Are you sure you want to delete {{ itemToDelete?.name }}? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- (Same as previous implementation) -->
  </q-page>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State
const searchQuery = ref('')
const selectedYear = ref(null)
const years = ref(['2024'])
const expenseClasses = ref([
  { id: 1, name: 'MOOE', year: '2024' },
  { id: 2, name: 'Personal Services', year: '2024' },
  { id: 3, name: 'Capital Outlay', year: '2025' },
])

const expenseTypes = ref([
  { id: 1, classId: 1, name: 'Travel Expenses', year: '2024' },
  { id: 2, classId: 1, name: 'Water Expenses', year: '2024' },
  { id: 3, classId: 2, name: 'Salaries', year: '2024' },
  { id: 4, classId: 3, name: 'Equipment', year: '2025' },
])

const showCopyDialog = ref(false)
const copyTargetYear = ref(null)
const selectedClassesToCopy = ref([])
const showAddYearDialog = ref(false)
const newYear = ref('')
const showAddAccountDialog = ref(false)
const newExpenseClass = ref(null)
const newExpenseType = ref('')
const filteredExpenseClassOptions = ref([])
const editingAccount = ref(null)
const showEditClassDialog = ref(false)
const editingExpenseClass = ref(null)
const showEditTypeDialog = ref(false)
const editingExpenseType = ref(null)
const showDeleteConfirm = ref(false)
const itemToDelete = ref(null)
const deleteType = ref('')
const expandedClasses = ref({})
const expenseTypeInputs = ref([{ value: '' }])
const customExpenseClass = ref('') // 'class' or 'type'
const hoveredClass = ref(null)
const hoveredType = ref(null)

// Computed properties

// Helper functions for checking existing items
const classExistsInYear = (className, year) => {
  return expenseClasses.value.some(
    (ec) => ec.name.toLowerCase() === className.toLowerCase() && ec.year === year,
  )
}

const typeExistsInClass = (typeName, classId) => {
  return expenseTypes.value.some(
    (et) => et.name.toLowerCase() === typeName.toLowerCase() && et.classId === classId,
  )
}
const filteredExpenseClasses = computed(() => {
  if (!selectedYear.value) return []

  return expenseClasses.value.filter(
    (ec) =>
      ec.year === selectedYear.value &&
      (ec.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        getExpenseTypesForClass(ec.id).some((et) =>
          et.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )),
  )
})

const addExpenseTypeInput = () => {
  expenseTypeInputs.value.push({ value: '' })
}

const removeExpenseTypeInput = (index) => {
  if (expenseTypeInputs.value.length > 1) {
    expenseTypeInputs.value.splice(index, 1)
  }
}

const expenseClassOptions = computed(() => {
  return expenseClasses.value.map((ec) => ec.name)
})

/// Methods
const addYear = () => {
  // Validation
  if (!newYear.value || newYear.value.length !== 4 || isNaN(newYear.value)) {
    $q.notify({
      type: 'negative',
      message: 'Please enter a valid 4-digit year',
      position: 'top',
    })
    return
  }

  if (years.value.includes(newYear.value)) {
    $q.notify({
      type: 'negative',
      message: 'Year already exists',
      position: 'top',
    })
    return
  }

  // Add the new year
  years.value.push(newYear.value)
  years.value.sort((a, b) => b - a) // Sort descending (newest first)

  // Set as selected year
  selectedYear.value = newYear.value

  // Optional: Initialize with default expense classes for new year
  const currentYear = new Date().getFullYear().toString()
  if (newYear.value === currentYear) {
    const defaultClasses = [
      {
        id: Math.max(...expenseClasses.value.map((ec) => ec.id), 0) + 1,
        name: 'MOOE',
        year: newYear.value,
      },
      {
        id: Math.max(...expenseClasses.value.map((ec) => ec.id), 0) + 2,
        name: 'Personal Services',
        year: newYear.value,
      },
    ]
    expenseClasses.value.push(...defaultClasses)
  }

  // Success notification
  $q.notify({
    type: 'positive',
    message: `Year ${newYear.value} added successfully`,
    position: 'top',
  })

  // Reset and close dialog
  newYear.value = ''
  showAddYearDialog.value = false
}

const filterExpenseClasses = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    filteredExpenseClassOptions.value = expenseClassOptions.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1,
    )
  })
}

const createExpenseClass = (val, done) => {
  if (val.length > 0) {
    const newId = Math.max(...expenseClasses.value.map((ec) => ec.id), 0) + 1
    const newClass = { id: newId, name: val }
    expenseClasses.value.push(newClass)
    newExpenseClass.value = val
    $q.notify({
      type: 'positive',
      message: `New expense class "${val}" created`,
      position: 'top',
    })
  }
  done()
}

const getExpenseTypesForClass = (classId) => {
  if (!selectedYear.value) return []
  return expenseTypes.value.filter((et) => et.classId === classId && et.year === selectedYear.value)
}

const saveAccount = () => {
  // Validate form
  if (!newExpenseClass.value) {
    $q.notify({ type: 'negative', message: 'Expense Class is required' })
    return
  }

  const expenseClassName =
    newExpenseClass.value === 'Other' ? customExpenseClass.value : newExpenseClass.value

  // Find or create the expense class
  let expenseClass = expenseClasses.value.find(
    (ec) => ec.name === expenseClassName && ec.year === selectedYear.value,
  )

  if (!expenseClass) {
    const newId = Math.max(...expenseClasses.value.map((ec) => ec.id), 0) + 1
    expenseClass = { id: newId, name: expenseClassName, year: selectedYear.value }
    expenseClasses.value.push(expenseClass)
  }

  // Add all expense types
  expenseTypeInputs.value.forEach((type) => {
    if (type.value) {
      const newId = Math.max(...expenseTypes.value.map((et) => et.id), 0) + 1
      expenseTypes.value.push({
        id: newId,
        classId: expenseClass.id,
        name: type.value,
        year: selectedYear.value,
      })
    }
  })
  // Reset and close
  resetAccountForm()
  showAddAccountDialog.value = false
}
const editExpenseClass = (expenseClass) => {
  editingExpenseClass.value = { ...expenseClass }
  showEditClassDialog.value = true
}

const updateExpenseClass = () => {
  const index = expenseClasses.value.findIndex((ec) => ec.id === editingExpenseClass.value.id)
  if (index !== -1) {
    expenseClasses.value[index] = { ...editingExpenseClass.value }
  }
  showEditClassDialog.value = false
}

const editExpenseType = (expenseType) => {
  editingExpenseType.value = { ...expenseType }
  showEditTypeDialog.value = true
}

const updateExpenseType = () => {
  const index = expenseTypes.value.findIndex((et) => et.id === editingExpenseType.value.id)
  if (index !== -1) {
    expenseTypes.value[index] = { ...editingExpenseType.value }
  }
  showEditTypeDialog.value = false
}

const confirmDeleteExpenseClass = (expenseClass) => {
  itemToDelete.value = expenseClass
  deleteType.value = 'class'
  showDeleteConfirm.value = true
}

const confirmDeleteExpenseType = (expenseType) => {
  itemToDelete.value = expenseType
  deleteType.value = 'type'
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  if (deleteType.value === 'class') {
    // Delete class and all its types
    expenseClasses.value = expenseClasses.value.filter((ec) => ec.id !== itemToDelete.value.id)
    expenseTypes.value = expenseTypes.value.filter((et) => et.classId !== itemToDelete.value.id)
  } else {
    // Delete just the type
    expenseTypes.value = expenseTypes.value.filter((et) => et.id !== itemToDelete.value.id)
  }
  showDeleteConfirm.value = false
}

const resetAccountForm = () => {
  newExpenseClass.value = null
  newExpenseType.value = ''
  expenseTypeInputs.value = [{ value: '' }]
  customExpenseClass.value = ''
  editingAccount.value = null
}

const copyClassesToYear = () => {
  if (!copyTargetYear.value || selectedClassesToCopy.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Please select a target year and at least one class',
      position: 'top',
    })
    return
  }

  // Get max IDs to avoid conflicts
  const maxClassId = Math.max(...expenseClasses.value.map((ec) => ec.id), 0)
  const maxTypeId = Math.max(...expenseTypes.value.map((et) => et.id), 0)

  let newClassId = maxClassId + 1
  let newTypeId = maxTypeId + 1
  let skippedClasses = 0
  let skippedTypes = 0

  // Create a mapping of old class IDs to new class IDs
  const classIdMap = {}

  // Copy selected classes
  selectedClassesToCopy.value.forEach((oldClassId) => {
    const oldClass = expenseClasses.value.find((ec) => ec.id === oldClassId)
    if (oldClass) {
      // Check if class already exists in target year
      if (classExistsInYear(oldClass.name, copyTargetYear.value)) {
        skippedClasses++
        return
      }

      const newClass = {
        ...oldClass,
        id: newClassId,
        year: copyTargetYear.value,
      }
      expenseClasses.value.push(newClass)
      classIdMap[oldClassId] = newClassId
      newClassId++
    }
  })

  // Copy associated expense types
  selectedClassesToCopy.value.forEach((oldClassId) => {
    const oldTypes = expenseTypes.value.filter(
      (et) => et.classId === oldClassId && et.year === selectedYear.value,
    )

    oldTypes.forEach((oldType) => {
      // Check if type already exists in the new class
      if (typeExistsInClass(oldType.name, classIdMap[oldClassId])) {
        skippedTypes++
        return
      }

      const newType = {
        ...oldType,
        id: newTypeId++,
        classId: classIdMap[oldClassId],
        year: copyTargetYear.value,
      }
      expenseTypes.value.push(newType)
    })
  })

  // Prepare notification message
  const copiedClasses = selectedClassesToCopy.value.length - skippedClasses
  const copiedTypes =
    expenseTypes.value.filter(
      (et) => selectedClassesToCopy.value.includes(et.classId) && et.year === copyTargetYear.value,
    ).length - skippedTypes

  let message = `Copied ${copiedClasses} classes and ${copiedTypes} types to ${copyTargetYear.value}`

  if (skippedClasses > 0 || skippedTypes > 0) {
    message += ` (skipped ${skippedClasses} duplicate classes and ${skippedTypes} duplicate types)`
  }

  $q.notify({
    type: 'positive',
    message,
    position: 'top',
  })

  // Reset and close
  selectedClassesToCopy.value = []
  copyTargetYear.value = null
  showCopyDialog.value = false
}

watch(selectedYear, (newYear) => {
  // Clear any open dialogs when year changes
  showAddAccountDialog.value = false
  resetAccountForm()

  if (newYear) {
    // In a real app, you might fetch data for the selected year here
    console.log(`Loading data for year ${newYear}`)
  }
})
</script>

<style scoped>
/* Hover effects for edit/delete buttons */
/* In your style section */
.q-expansion-item:hover {
  background-color: #f5f5f5;
}

.expense-type-item:hover {
  background-color: #f0f0f0;
}

.hover-effect {
  background-color: #f5f5f5;
  transition: background-color 0.3s;
}

.type-hover-effect {
  background-color: #f0f0f0;
  transition: background-color 0.3s;
}
.actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
