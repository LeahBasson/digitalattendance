<template>
  <div>
    <section class="row">
      <HeaderComp />
    </section>
    <section class="row" id="home" style="min-height: 100dvh;">
      <DashboardComp />
    </section>
    <section class="row">
      <FooterComp />
    </section>
  </div>
</template>

<script setup>
import HeaderComp from '@/components/HeaderComp.vue' 
import DashboardComp from '@/components/DashboardComp.vue';
import FooterComp from '@/components/FooterComp.vue'



</script>


