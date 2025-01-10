<template>
  <div>
    <section class="row">
      <HeaderComp />
    </section>
    <section class="row" id="home">
      <DashboardComp />
    </section>
    <section class="row">
      <FooterComp />
    </section>
  </div>
</template>

<script>
import HeaderComp from '@/components/HeaderComp.vue' 
import DashboardComp from '@/components/DashboardComp.vue';
import FooterComp from '@/components/FooterComp.vue'

export default {
  name: 'HomeView',
  components: {
    HeaderComp,
    DashboardComp,
    FooterComp
  }
}
</script>
