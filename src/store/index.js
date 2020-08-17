import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const defaultState = () => ({
  isLoading: false,
  columns: [],
  rows: [],
  columnsMapping: [],
  columnsTypes: ['city', 'state', 'zip', 'address', 'category'],
  savedMapping: [],
  markersData: [],
});

export default new Vuex.Store({
  state: defaultState(),
  mutations: {
    SET_COLUMNS(state, columns) {
      state.columns = columns;
    },
    SET_ROWS(state, rows) {
      state.rows = rows;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SAVE_MAPPING(state, mapping) {
      state.savedMapping = mapping;
    },
    ADD_MARKER(state, marker) {
      state.markersData.push(marker);
    },
    SET_MAPPED_COLUMNS(state, columns) {
      state.columnsMapping = columns.map((column) => ({
        column,
        type: null,
      }));
    },
    OVERRIDE_MAPPED_COLUMNS(state, columns) {
      state.columnsMapping = columns;
    },
    UPDATE_MAPPED_COLUMN(state, { value, index }) {
      state.columnsMapping[index].type = value;
    },
    RESET_ALL(state) {
      Object.assign(state, defaultState());
    },
  },
  actions: {
    saveColumns(context, columns) {
      context.commit('SET_COLUMNS', columns);
      context.commit('SET_MAPPED_COLUMNS', columns);
    },
    saveMapping(context, mapping) {
      context.commit('SAVE_MAPPING', mapping);
    },
    saveRows(context, rows) {
      context.commit('SET_ROWS', rows);
    },
    updateColumnMapping(context, data) {
      context.commit('UPDATE_MAPPED_COLUMN', data);
    },
    saveMarker(context, marker) {
      context.commit('ADD_MARKER', marker);
    },
    changeLoadingStatus(context, isLoading) {
      context.commit('SET_LOADING', isLoading);
    },
    resetAll(context) {
      context.commit('RESET_ALL');
    },
  },
});
