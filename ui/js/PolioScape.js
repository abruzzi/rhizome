'use strict';

var Vue = require('vue');

Vue.config.debug = true;

Vue.component('vue-dropdown', require('./component/dropdown'));
Vue.component('vue-table', require('./component/table'));
Vue.component('vue-pagination', require('./component/pagination'));

module.exports = {
	Explorer: function (el) {
		new Vue({
			el: el,
			components: { 'uf-explorer': require('./view/explorer') }
		});
	},
	Dashboard: function (el) {
		new Vue({
			el: el,
			components: { 'uf-dashboard': require('./view/dashboard') }
		});
	}
};