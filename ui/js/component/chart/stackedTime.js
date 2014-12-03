'use strict';

var d3 = require('d3');

var coolgray = require('../../colors/coolgray');

function min(data, accessor) {
	var m = Infinity;

	accessor = accessor || Number;

	if (data instanceof Array) {
		for (var i = data.length - 1; i >= 0; i--) {
			m = Math.min(m, min(data[i], accessor));
		}
	} else {
		m = Math.min(m, accessor(data));
	}

	return m;
}

function max(data, accessor) {
	var m = -Infinity;

	accessor = accessor || Number;

	if (data instanceof Array) {
		for (var i = data.length - 1; i >= 0; i--) {
			m = Math.max(m, max(data[i], accessor));
		}
	} else {
		m = Math.max(m, accessor(data));
	}

	return m;
}

module.exports = {
	replace: true,

	data: function () {
		return {
			layers: []
		};
	},

	methods: {
		draw: function () {
			function getX(d) {
				return d.campaign.start_date;
			}

			function getY(d) {
				return d.y0 + d.y;
			}

			if (!this.layers) {
				return;
			}

			var svg = d3.select(this.$el);

			var stack = d3.layout.stack()
				.x(getX)
				.y(function (d) {
					return d.value;
				});

			var layers = stack(this.layers);

			var start  = new Date(min(layers, getX));
			var end    = new Date(max(layers, getX));
			var lower  = min(layers, function (d) { return d.y0; });
			var upper  = max(layers, getY);

			var x = d3.time.scale()
				.domain([start, end])
				.range([0, this.width]);

			var y = d3.scale.linear()
				.domain([lower, upper])
				.range([this.height, 0]);

			var color = d3.scale.ordinal()
				.domain([0, this.layers.length])
				.range(coolgray);

			var area = d3.svg.area()
				.x(function (d) { return x(getX(d)); })
				.y0(function (d) { return y(d.y0); })
				.y1(function (d) { return y(getY(d)); });

			var paths = svg.select('.layers').selectAll('.layer')
				.data(layers);

			paths.enter().append('path')
				.attr('class', 'layer');

			paths.attr('d', area)
				.style('fill', function (d, i) { return color(i); });

			paths.exit().remove();

			var xAxis = d3.svg.axis()
				.scale(x)
				.ticks(3)
				.orient('bottom');

			var yAxis = d3.svg.axis()
				.scale(y)
				.ticks(3)
				.orient('right')
				.tickSize(this.width);

			svg.select('.x.axis').call(xAxis);
			svg.select('.y.axis').call(yAxis);

			svg.selectAll('.y.axis text')
				.attr('x', 3)
				.attr('dy', -3);
		}
	},

	on: {
		'hook:attached': 'draw'
	},

	watch: {
		'layers': 'draw',
		'width' : 'draw',
		'height': 'draw'
	}
};
