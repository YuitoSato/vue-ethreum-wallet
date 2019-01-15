<template>
  <section>
    <ul>
      <li>
        <router-link to="/sample">Go to Sample</router-link>
      </li>
      <li>
        <router-link to="/wallet">Go to Wallet</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </section>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from "nuxt-property-decorator"
  import Sample from '~/pages/Sample.vue'
  import Wallet from '~/pages/Wallet.vue'
  import VueRouter from 'vue-router'

  @Component({
    components: {
      Sample,
      Wallet
    }
  })

  export default class extends Vue {
    routes = [
      { name: 'wallet', path: '/wallet', component: Wallet },
      { name: 'sample', path: '/sample', component: Sample },
    ];

    router = new VueRouter({
      routes: this.routes
    });
  }
</script>
