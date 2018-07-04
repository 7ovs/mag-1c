<template>
  <div id="app">
    <v-app>
      <v-content>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'mag1c',
    data: () => ({
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    })
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  /* Global CSS */
  #app {
    background-image: url("/static/bg/005-wood-grain.png");
    background-repeat: repeat;
    font: 200 16px 'Roboto-Condensed';
  }
</style>
