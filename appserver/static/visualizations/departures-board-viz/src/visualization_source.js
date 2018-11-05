define([
		//'jquery',
		'underscore',
		'api/SplunkVisualizationBase',
		'api/SplunkVisualizationUtils',
		'departures-board',
		'flapper'
	],
	function (
	//	$,
		_,
		SplunkVisualizationBase,
		SplunkVisualizationUtils,
		departuresBoard,
		
		flapper) {

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
				count: 500
			});
		},

		formatData: function (data, config) {

			// Check for an empty data object
			if (data.rows.length < 1) {
				return false;
			}

			return data;
		},

		
		setTokens: function(aTokens){
			for (var tok in aTokens) {
				this._setToken(aTokens[tok]['key'],aTokens[tok]['value']);
			}
		},
		
		_setToken : function(name, value) {
			var defaultTokenModel = mvc.Components.get('default');
			if (defaultTokenModel) {
				defaultTokenModel.set(name, value);
			}
			var submittedTokenModel = mvc.Components.get('submitted');
			if (submittedTokenModel) {
				submittedTokenModel.set(name, value);
			}
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
			var flapper = require('flapper');
			
			// Get Config parameters:
			var num_characters = parseInt(config[this.getPropertyNamespaceInfo().propertyNamespace + 'num_characters']) || 5;
			var is_animated = config[this.getPropertyNamespaceInfo().propertyNamespace + "animated"] || true;
			var max_timing = parseInt(config[this.getPropertyNamespaceInfo().propertyNamespace + 'timing']) || 500;
			var auto_refresh = config[this.getPropertyNamespaceInfo().propertyNamespace + "auto_refresh"] || true;
			var auto_refresh_period = parseInt(config[this.getPropertyNamespaceInfo().propertyNamespace + 'auto_refresh_period']) || 5;
			var dark_tiles = config[this.getPropertyNamespaceInfo().propertyNamespace + "dark_tiles"] || true;
			var tile_size = config[this.getPropertyNamespaceInfo().propertyNamespace + 'size'] || "XXL";
			var force_all_caps = config[this.getPropertyNamespaceInfo().propertyNamespace + "force_all_caps"] || true;
			var is_fixed_length = config[this.getPropertyNamespaceInfo().propertyNamespace + "is_fixed_length"] || false;
			var token_word = config[this.getPropertyNamespaceInfo().propertyNamespace + "token_name"] || "dbv_term";
			var token_id = config[this.getPropertyNamespaceInfo().propertyNamespace + "token_id"] || "dbv_id";
			
			
			// Now load the visualisation
			var oDepartures_board = new departures_board(num_characters, is_animated, max_timing, auto_refresh, auto_refresh_period, dark_tiles, tile_size, force_all_caps, is_fixed_length);
			oDepartures_board.setText(data)
			this.$el.html(oDepartures_board.getHTML());
			var caption = oDepartures_board.getNextWord();
			var id=oDepartures_board.id;
				window.jQuery("#" + id).flapper(oDepartures_board.getOpts());
				$("#" + id).val(caption).change();
				var vizObj = this;	
				var tokens={"term": {"key": token_word, "value": oDepartures_board.caption},
							"id": {"key": token_id, "value":oDepartures_board.value;}}
				vizObj.setTokens(tokens);
					
					
					
				if(auto_refresh){
					setInterval(function(){
						$("#" + id).val('').change();	
						setTimeout(function(){$("#" + id).val(oDepartures_board.getNextWord()).change();
						//Set tokens for the current term + any ID value or "" if blank:
						tokens={"term": {"key": token_word, "value": oDepartures_board.caption},"id": {"key": token_id, "value":oDepartures_board.value;}}
						vizObj.setTokens(tokens);
						},1000);
					}, auto_refresh_period * 1000);
				}
		}
	});
});
