<template>
  <div id="app">
    <div class="reset" @click="resetAll">Start over</div>
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
      v-show="!hasMarkers"
    >
    </file-mapper>
    <markers-list
      v-if="hasMarkers && categoriesColors"
      :markers="filteredMarkers"
      :categories="categoriesColors"
      @select-filter="setFilter"
    ></markers-list>
    <div class="map-wrapper">
      <div class="found-markers">
        We found: <strong>{{markersData.length}}</strong>
      </div>
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
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
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
    ...mapActions(['resetAll']),
  },
};
</script>

<style lang="scss">
body, html{
  padding: 0;
  margin: 0;
}
.map-wrapper{
  margin-left: 250px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
ul{
  li{
    display: inline-block;
  }
}

.vue-google-map{
  height: 100vh;
}
.reset{
  z-index: 2;
  padding: 15px;
  position: absolute;
  right: 15px;
  top: 15px;
  background: #fff;
  box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.3s;
  &:hover{
    background: orange;
  }
}
</style>
