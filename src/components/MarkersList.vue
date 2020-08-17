<template>
  <div class="list-wrapper">
    <div class="categories">
      <button
        :class="{'is-active': isFilterActive(filter.name)}"
        @click="$emit('select-filter', category.name)"
        :style="{background: category.color}"
        v-for="(category, index) in categories"
        :key="index">{{category.name}}
      </button>
      <button
        :class="{'is-active': isFilterActive(false)}"
        @click="$emit('select-filter', false)">
         Wszystkie
        </button>
    </div>
    <ul>
      <li v-for="(marker, index) in markers" :key="index">
        <i :style="{background: marker.icon.fillColor}" class="category-indicator"></i>
        {{marker.address}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MarkerList',
  props: {
    markers: Array,
    categories: Array,
    filter: [String, Boolean],
  },
  methods: {
    isFilterActive(filter) {
      return this.filter === filter;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.list-wrapper{
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left:0;
  border: 1px solid #aeaeae;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow: scroll;
  height: 100vh;
}
li {
  display: block;
  cursor: pointer;
  border-bottom: 1px solid #aeaeae;
  padding: 15px 20px;
  text-align: left;
  i{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
</style>
