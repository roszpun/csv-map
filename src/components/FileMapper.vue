<template>
  <div class="file-mapper">
    <strong v-if="isLoading">Wait please, we are working to decode your addresses...</strong>
    <div class="main-app">
      <template v-if="columnsEmpty">
        <h2>
          Find addresses location base on the csv file.
        </h2>
        <h5>Upload your csv file first.</h5>
        <div class="input-wrapper">
          <input
            type="file"
            @change="filesChange($event.target.files)"
            accept=".csv"
            class="input-file"
            ref="input"
          />
        </div>
      </template>
      <div class="columns-mapper" v-if="columns.length > 0">
        <h2>Great, now map the columns to the data type.</h2>
        <ul>
          <li v-for="(column, index) in columns" :key="index">
            <div class="column-name">
              {{column}}
            </div>
            <select
              :value="columnsMapping[index].type"
              @input="updateColumnMapping({value: $event.target.value, index})"
            >
              <option
                v-for="(type, typeIndex) in selectableTypes[index]"
                :key="typeIndex"
                :value="type"
              >
                <span>{{type}}</span>
              </option>
              <option value>Select</option>
            </select>
          </li>
        </ul>
        <button
          :disabled="!allMappingsHaveType"
          @click="saveMappingAndDisplayMarkers">
          Save column's data types
        </button>
      </div>
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
      return Array.from(
        new Set(this.validRows.map((row) => row[this.columnsIndexes.category])),
      );
    },
    columnsEmpty() {
      return this.columns.length === 0;
    },
    categoriesColors() {
      return this.uniqueCategories.map((category) => ({
        name: category,
        color: `#${this.generateRandomColor()}`,
      }));
    },
    selectableTypes() {
      return this.columns.map((column, index) => this.columnsTypes
        .filter((type) => !this.isTypeSelected(type, index)));
    },
    allMappingsHaveType() {
      return (
        !this.columnsMapping.some((column) => column.type === null)
        && this.columnsMapping.length > 0
      );
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
      resetAll: 'resetAll',
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
      return this.categoriesColors.find((category) => category.name === name)
        .color;
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
          if (data.length >= 20) {
            this.resetAll();
            this.$refs.input.value = '';
            alert('Sorry, the data set is too big. Max allowe size is 20 rows.');
            return;
          }
          this.addColumns(data.shift());
          this.addRows(data);
        },
      });
    },
    isTypeSelected(type, index) {
      return this.columnsMapping.some(
        (column, columnIndex) => column.type === type && columnIndex !== index,
      );
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
      try {
        this.saveMapping(this.columnsMapping);
        this.createMarkers();
      } catch {
        // eslint-disable-next-line no-alert
        alert('Something went wrong... Are you sure you assigned to columns properly and the data is valid?');
      }
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

<style scoped lang="scss">
ul{
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
  li{
    select{
      width: 100%;
    }
  }
}
.column-name{
  background: orange;
  padding: 10px;
  font-weight: bold;
  color: #fff;
}
.input-wrapper{
  background: orange;
  padding: 15px;
  color: #fff;
  border-radius: 15px;
}
.file-mapper {
  display: flex;
  flex-flow: column wrap;
  height: 100vh;
  align-items: center;
  justify-content: center;
}
button{
  border-radius: 9px;
  background: orange;
  padding: 10px 15px;
  color: #fff;
  border: 0;
  cursor: pointer;
  &[disabled]{
    background: gray;
    color: #000;
    cursor: not-allowed;
  }
}
</style>
