<template>
  <div id="app">
    <file-mapper
      :markers-data="markersData"
      :columns="columns"
      :columns-mapping="columnsMapping"
      :columns-types="columnsTypes"
      :is-loading="isLoading"
      :has-markers="hasMarkers"
      :rows="rows"
      :saved-mapping="savedMapping"
      @save="saveCategories"
    >
    </file-mapper>
    <markers-list
      v-if="hasMarkers && categoriesColors"
      :markers="filteredMarkers"
      :categories="categoriesColors"
      @select-filter="setFilter"
    ></markers-list>
    <googlemaps-map
      v-if="hasMarkers"
      :center="filteredMarkers[0].position"
      :zoom="5">
      <template v-if="hasMarkers">
        <googlemaps-marker
          v-for="(marker, index) of filteredMarkers"
          :key="index"
          :icon="marker.icon"
          :position="marker.position"
        />
      </template>
    </googlemaps-map>
    <div class="found-markers" v-if="hasMarkers">
      Znalezionych lokalizacji
      <strong>
      {{this.markersData.length}}
      </strong>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MarkersList from './components/MarkersList.vue';
import FileMapper from './components/FileMapper.vue';

export default {
  name: 'App',
  components: {
    MarkersList,
    FileMapper,
  },
  data() {
    return {
      step: 0,
      categoriesColors: [],
      filter: false,
    };
  },
  computed: {
    ...mapState(
      ['columns',
        'rows',
        'columnsMapping',
        'columnsTypes',
        'savedMapping',
        'markersData',
        'isLoading',
      ],
    ),
    filteredMarkers() {
      if (!this.filter) return this.markersData;
      return this.markersData.filter((marker) => marker.category === this.filter);
    },
    hasMarkers() {
      return this.markersData.length > 0;
    },
  },
  methods: {
    saveCategories(categories) {
      this.categoriesColors = categories;
    },
    setFilter(filter) {
      this.filter = filter;
    },
  },
};
</script>

<style lang="scss">
body, html{
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main-app{
  margin-left: 250px;
}
ul{
  li{
    display: inline-block;
  }
}

.vue-google-map{
  height: 500px;
}
</style>
