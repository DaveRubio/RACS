<template>
  <div class="q-pa-md">
    <!-- Search Bar -->
    <div class="row q-mb-md">
      <q-input
        dense
        outlined
        v-model="search"
        placeholder="Search users..."
        class="search-input"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- User Access Table -->
    <q-table
      flat
      bordered
      :rows="filteredUsers"
      :columns="columns"
      row-key="id"
      class="user-access-table"
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions-column">
          <q-btn
            label="Access"
            color="primary"
            size="sm"
            @click="openAccessModal(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Access Modal -->
    <q-dialog v-model="accessModal.show" persistent>
      <q-card style="width: 350px; max-height: 450px; overflow: hidden;">
        <!-- Centered Title with Close Button -->
        <q-card-section class="relative-position">
          <div class="text-h6 text-center full-width">Manage User Access</div>
          <q-btn
            class="absolute-top-right"
            flat
            dense
            round
            icon="close"
            @click="closeAccessModal"
          />
          <div class="text-subtitle1 q-mt-sm text-start">
            Username: <strong>{{ accessModal.selectedUser?.username || 'N/A' }}</strong>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="access-grid">
            <div
              v-for="(permission, key) in accessModal.permissions"
              :key="key"
              class="access-row"
            >
              <span class="access-label">{{ permission.label }}</span>
              <q-toggle v-model="permission.value" color="primary" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Save" color="primary" @click="saveAccess" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "UserAccessPage",
  data() {
    return {
      search: "",
      users: [
        { id: 1, fullname: "John Doe", position: "Manager", username: "johndoe" },
        { id: 2, fullname: "Jane Smith", position: "Developer", username: "janesmith" },
        // Add more users as needed
      ],
      columns: [
        { name: "id", label: "ID", field: "id", align: "left", sortable: true },
        { name: "fullname", label: "Full Name", field: "fullname", align: "left", sortable: true },
        { name: "position", label: "Position", field: "position", align: "left", sortable: true },
        { name: "username", label: "Username", field: "username", align: "left", sortable: true },
        { name: "actions", label: "Actions", align: "center", sortable: false },
      ],
      accessModal: {
        show: false,
        selectedUser: null,
        permissions: {
          view: { label: "Access View:", value: false },
          add: { label: "Access Add:", value: false },
          edit: { label: "Access Edit:", value: false },
          delete: { label: "Access Delete:", value: false },
          print: { label: "Access Print:", value: false },
        },
      },
    };
  },
  computed: {
    filteredUsers() {
      const searchTerm = this.search.toLowerCase();
      return this.users.filter(
        (user) =>
          user.fullname.toLowerCase().includes(searchTerm) ||
          user.position.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm)
      );
    },
  },
  methods: {
    openAccessModal(user) {
      this.accessModal.selectedUser = user;
      this.accessModal.show = true;
    },
    closeAccessModal() {
      this.accessModal.show = false;
    },
    saveAccess() {
      console.log("Saving access for:", this.accessModal.selectedUser.username);
      console.log("Permissions:", this.accessModal.permissions);

      this.$q.notify({
        type: "positive",
        message: "Access permissions saved successfully!",
      });

      this.closeAccessModal();
    },
  },
};
</script>

<style scoped>
.search-input {
  width: 300px;
}

.user-access-table {
  border-radius: 8px;
  overflow: hidden;
}

.actions-column {
  white-space: nowrap;
}

.access-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.access-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.access-label {
  font-size: 1rem;
  color: #333;
}
</style>
