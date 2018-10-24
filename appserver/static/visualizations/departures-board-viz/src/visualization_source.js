define([
		'jquery',
		'underscore',
		'api/SplunkVisualizationBase',
		'api/SplunkVisualizationUtils',
		'departures-board',
		//'transform',
		'flapper'
	],
	function (
		$,
		_,
		SplunkVisualizationBase,
		SplunkVisualizationUtils) {

	return SplunkVisualizationBase.extend({

		initialize: function () {
			// Save this.$el for convenience
			this.$el = $(this.el);
			// Add a css selector class
			this.$el.addClass('departures_board');
		},

		getInitialDataParams: function () {
			return ({
				outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
				count: 1
			});
		},

		formatData: function (data, config) {

			// Check for an empty data object
			if (data.rows.length < 1) {
				return false;
			}

			return data;
		},

		/**
		 * To be called from the visualization's click handler, after computing the
		 * correct time range from the target of the click.
		 *
		 * @param earliestTime - the lower bound of the time range,
		 *          can be an ISO-8601 timestamp or an epoch time in seconds.
		 * @param latestTime - the upper bound of the time range,
		 *          can be an ISO-8601 timestamp or an epoch time in seconds.
		 * @param browserEvent - the original browser event that caused the drilldown
		 *
		 * example usage:
		 *
		 * this.drilldownToTimeRange('1981-08-18T00:00:00.000-07:00', '1981-08-19T00:00:00.000-07:00', e);
		 */
		drilldownToTimeRange: function (earliestTime, latestTime, browserEvent) {
			this.drilldown({
				earliest: earliestTime,
				latest: latestTime
			}, browserEvent);
		},

		updateView: function (data, config) {
			// Return if no data
			if (!data) {
				return;
			}

			// Assign datum to the data object returned from formatData
			if (!data.meta.done)
				return;
			//	return;

			// Clear the div
			this.$el.empty();

			
			var departures_board = require('departures-board');
			
			// Get Config parameters:
			var num_characters = parseInt(config[this.getPropertyNamespaceInfo().propertyNamespace + 'num_characters']) || 5;
			var is_animated = config[this.getPropertyNamespaceInfo().propertyNamespace + "animated"] || true;
			var timing = parseInt(config[this.getPropertyNamespaceInfo().propertyNamespace + 'timing']) || 500;
			var auto_refresh = config[this.getPropertyNamespaceInfo().propertyNamespace + "auto_refresh"] || true;
			var auto_refresh_period = parseInt(config[this.getPropertyNamespaceInfo().propertyNamespace + 'auto_refresh_period']) || 500;
			var dark_tiles = config[this.getPropertyNamespaceInfo().propertyNamespace + "dark_tiles"] || true;
			var size = config[this.getPropertyNamespaceInfo().propertyNamespace + 'size'] || "XXL";
			var force_all_caps = config[this.getPropertyNamespaceInfo().propertyNamespace + "force_all_caps"] || true;
			
			// Now load the visualisation
			var oDepartures_board = new departures_board(num_characters, is_animated, timing, auto_refresh, auto_refresh_period, dark_tiles, size, force_all_caps);
			oDepartures_board.setText(data)
			this.$el.html(oDepartures_board.getHTML());
			var flap = this.$el.find( "input" )[0];
			var caption = departures_board.caption;
			var id=oDepartures_board.id;
			$(document).ready(function() {
		//	const flapper = require('flapper');
			var id=oDepartures_board.id;
			setTimeout(function(){
				$("#" + id).flapper({
				width: size,
				chars_preset: 'alphanum',
				transform: is_animated,
				timing: timing
			});
			
			$el.val(caption).change();
				
				var toggle = false;
				setInterval(function(){
						if (toggle) {
						$el.val('A' + caption).change();
					} else {
						$el.val('X' + caption).change();
					}
					   toggle = !toggle;
				}, 5000);
			}, 1000);
			
		});
			//----------------
		}
	});
});
