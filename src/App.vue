<template>
  <app-header />
      <router-view />
  <app-footer />
</template>

<script>
import AppHeader from "./components/layouts/AppHeader.vue"
import AppFooter from "./components/layouts/AppFooter.vue"
import "../public/assets/css/bootstrap.min.css"
import "../public/assets/js/jquery-3.1.1.js"
import "../public/assets/js/bootstrap.min.js"
import "../public/assets/font-awesome/css/font-awesome.min.css"

export default {
  name: 'App',
  components: {
        AppHeader,
        AppFooter,
    }
}
</script>

<style>
body {
  height: 100%;
  margin-top: 0px !important;
}
</style>
