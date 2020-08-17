<template>
  <div>
    <strong v-if="isLoading">Ładowanie</strong>
        <div class="main-app">
          <h2>Hey Fella, upload your CSV file with city, state, zip, address and category
            <br/> I'll show them on the  map for you :)</h2>
          <input type="file" @change="filesChange($event.target.files)"
                  accept=".csv" class="input-file">
          <ul>
            <li v-for="(column, index) in columns" :key="index">
              {{column}}
              <select :value="columnsMapping[index].type"
              @input="updateColumnMapping({value: $event.target.value, index})">
                <option v-for="(type, typeIndex) in selectableTypes[index]"
                :key="typeIndex"
                :value="type">
                  <span>{{type}}</span>
                </option>
                <option value=""></option>
              </select>
            </li>
          </ul>
          <button v-if="allMappingsHaveType"
          @click="saveMappingAndDisplayMarkers">Zapisz mapowanie</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    columns: Array,
    rows: Array,
    columnsMapping: Array,
    savedMapping: Array,
    columnsTypes: Array,
    markersData: Array,
    isLoading: Boolean,
  },
  name: 'FileUpload',
  computed: {
    columnsIndexes() {
      return {
        city: this.findColumn('city'),
        state: this.findColumn('state'),
        zip: this.findColumn('zip'),
        address: this.findColumn('address'),
        category: this.findColumn('category'),
      };
    },
    validRows() {
      return this.rows.filter((row) => row.length === 5);
    },
    uniqueCategories() {
      return Array.from(new Set(this.validRows.map((row) => row[this.columnsIndexes.category])));
    },
    categoriesColors() {
      return this.uniqueCategories.map((category) => ({
        name: category,
        color: `#${this.generateRandomColor()}`,
      }));
    },
    selectableTypes() {
      return this.columns.map((column, index) => this.columnsTypes.filter(
        (type) => !this.isTypeSelected(type, index),
      ));
    },
    allMappingsHaveType() {
      return !this.columnsMapping.some((column) => column.type === null)
      && this.columnsMapping.length > 0;
    },
  },
  methods: {
    ...mapActions({
      addColumns: 'saveColumns',
      addRows: 'saveRows',
      saveMapping: 'saveMapping',
      updateColumnMapping: 'updateColumnMapping',
      saveMarker: 'saveMarker',
      changeLoadingStatus: 'changeLoadingStatus',
    }),
    createIcon(color) {
      return {
        path: 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 1,
      };
    },
    getCategoryColor(name) {
      return this.categoriesColors.find((category) => category.name === name).color;
    },
    filesChange(files) {
      this.parseCsv(files[0]);
    },
    generateRandomColor() {
      return Math.floor(Math.random() * 16777215).toString(16);
    },
    parseCsv(file) {
      this.$parser.parse(file, {
        complete: (parsedData) => {
          const { data } = parsedData;
          this.addColumns(data.shift());
          this.addRows(data);
        },
      });
    },
    isTypeSelected(type, index) {
      return this.columnsMapping.some((column, columnIndex) => column.type === type
      && columnIndex !== index);
    },
    createMarkers() {
      this.changeLoadingStatus(true);
      this.validRows.forEach((row, index) => {
        setTimeout(() => {
          this.makeMarker(row);
        }, 150 * index);
      });
    },
    saveMappingAndDisplayMarkers() {
      this.saveMapping(this.columnsMapping);
      this.createMarkers();
    },
    findColumn(type) {
      return this.savedMapping.findIndex((column) => column.type === type);
    },
    findLocation(address, city, zip, state, category) {
      const { google } = window;
      const geocoder = new google.maps.Geocoder();
      const addressObject = { address: `${address} ${city}, ${zip} ${state}` };
      geocoder.geocode(addressObject, (results, status) => {
        if (status === 'OK') {
          this.onGeoSuccess(results, category);
        } else {
          this.onGeoFail(status);
        }
      });
    },
    onGeoSuccess(results, category) {
      this.saveMarker({
        category,
        icon: this.createIcon(this.getCategoryColor(category)),
        position: {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        },
        address: results[0].formatted_address,
      });
      if (this.markersData.length + 1 === this.validRows.length) {
        this.changeLoadingStatus(false);
        this.$emit('save', this.categoriesColors);
      }
    },
    onGeoFail(status) {
      alert(`Geocode was not successful for the following reason: ${status}`);
    },
    makeMarker(row) {
      const indexes = this.columnsIndexes;
      const address = row[indexes.address];
      const city = row[indexes.city];
      const zip = row[indexes.zip];
      const state = row[indexes.state];
      const category = row[indexes.category];
      this.findLocation(address, city, zip, state, category);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
