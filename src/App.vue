<template>

  <div class="wrapper">
    <main class="container-fluid">
      <router-view />
    </main>
  </div>

</template>

<script setup>
import router from './router';
import store from './store';
import { onBeforeMount } from 'vue';

onBeforeMount(()=>{
  if (!store.state.user) {
    router.push({name: 'login'});
  }
})
</script>

<style src="./assets/css/style.css">
</style>