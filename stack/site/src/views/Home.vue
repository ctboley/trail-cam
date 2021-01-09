<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
    </v-row>
      
    <Gallery />
  </v-container>
</template>

<script>
import Gallery from '@/components/Gallery.vue';

export default {
  name: 'Home',
  components: {
    Gallery,
  },
};
</script>
