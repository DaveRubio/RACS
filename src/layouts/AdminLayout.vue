<template>
  <q-layout view="lHh lpR ffr">
    <!-- Navbar -->
    <NavBarPage />

    <!-- Sidebar -->
    <SidebarPage />

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SidebarPage from 'components/SidebarPage.vue'
import NavBarPage from 'components/NavBarPage.vue'

export default {
  name: 'AdminLayout',
  components: {
    SidebarPage,
    NavBarPage,
  },
}
</script>
