<template>
  <v-app>
      <Login/>
  </v-app>
</template>

<script>
//import Viewer from './components/Viewer';
import Login from './components/Login';

export default {
    name: 'App',
    components: {
        Login,
        //Viewer,
    },


    data: () => ({
        //
    }),
};
</script>

<style>


</style>
