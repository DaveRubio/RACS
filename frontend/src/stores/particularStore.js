// particularStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useParticularStore = defineStore('particular', () => {
  const particularRow = ref([])

  const particularColumns = ref([
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    {
      name: 'particular',
      label: 'Particular',
      field: 'particular',
      align: 'center',
      sortable: true,
    },
    { name: 'action', label: 'Action', field: '', align: 'center' },
  ])

  return {
    particularRow,
    particularColumns,
  }
})
