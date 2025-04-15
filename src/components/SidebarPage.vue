<template>
  <q-drawer show-if-above bordered :width="200" class="sidebar bg-green">
    <q-list>
      <!-- Logo -->
      <div class="logo-container">
        <q-img src="/src/assets/tagum.png" class="logo" />
        <div class="text-logo">ERAC</div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br>
      <br>
      <!-- Menu Items -->
      <q-item clickable v-ripple to="/admin-panel/dashboard" exact active-class="active-menu">
        <q-item-section avatar>
          <q-icon name="bar_chart" />
        </q-item-section>
        <q-item-section>Dashboard</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/admin-panel/continuing" exact active-class="active-menu">
        <q-item-section avatar>
          <q-icon name="trending_up" />
        </q-item-section>
        <q-item-section>Continuing</q-item-section>
      </q-item>

      <q-expansion-item
        expand-separator
        icon="supervisor_account"
        label="Users Control"
        :default-opened="$route.path.includes('/admin-panel/user-control')"
        header-class="text-bold"
      >
        <q-list class="q-pl-lg">
          <q-item
            clickable
            v-ripple
            to="/admin-panel/user-control-pending"
            active-class="active-submenu"
          >
            <q-item-section avatar>
              <q-icon name="pending" size="xs" />
            </q-item-section>
            <q-item-section>Pending</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/admin-panel/user-control-accepted"
            active-class="active-submenu"
          >
            <q-item-section avatar>
              <q-icon name="check_circle" size="xs" />
            </q-item-section>
            <q-item-section>Accepted</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>

      <q-item clickable v-ripple to="/admin-panel/user-access" exact active-class="active-menu">
        <q-item-section avatar>
          <q-icon name="vpn_key" />
        </q-item-section>
        <q-item-section>User Access</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/admin-panel/logs" exact active-class="active-menu">
        <q-item-section avatar>
          <q-icon name="article" />
        </q-item-section>
        <q-item-section>Logs</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
export default {
  name: 'SideBarPage',
}
</script>

<style scoped>
.logo {
  width: 130px;
  height: 130px;
  display: block;
  margin-top: 105px;
}
.text-logo {
  font-size: 16px;
  color: #000000;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
}

.q-item {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.q-item:hover {
  background-color: rgba(163, 193, 159, 0.5);
}

.active-menu {
  background-color: #066406 !important;
  color: #f1f1f1 !important;
  font-weight: bold;
  border-radius: 5px;
}

.active-submenu {
  background-color: #066406 !important;
  color: #f1f1f1 !important;
  font-weight: bold;
  border-radius: 5px;
  margin-right: 10px;
}

:deep(.sidebar) {
  background: linear-gradient(to bottom, #e9f3e6, #c8e6c9, #58b265) !important;
}

/* Make the expansion header bold */
:deep(.text-bold) {
  font-weight: bold !important;
}
</style>
