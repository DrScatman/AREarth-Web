<template>
  <v-app>
      <Viewer/>
  </v-app>
</template>

<script>
import Viewer from './components/Viewer';

export default {
    name: 'App',
    components: {
        Viewer,
    },


    data: () => ({
        //
    }),
};
</script>

<style>


</style>
