define([
		//'jquery',
		'underscore',
		'api/SplunkVisualizationBase',
		'api/SplunkVisualizationUtils',
		'splunkjs/mvc',
		'departures-board',
		'flapper'
	],
	function (
	//	$,
		_,
		SplunkVisualizationBase,
		SplunkVisualizationUtils,
		mvc,
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
				count: 100
			});
		},

		formatData: function (data, config) {

			// Check for an empty data object
			if (data.rows.length < 1) {
				data.rows[0] =[];
				data.rows[0][0] = " ";
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
			var token_word = config[this.getPropertyNamespaceInfo().propertyNamespace + "token_name"] || "dbv_term";
			var token_id = config[this.getPropertyNamespaceInfo().propertyNamespace + "token_id"] || "dbv_id";
			
			
			// Now load the visualisation
			var oDepartures_board = new departures_board();
			oDepartures_board.setConfig(config, this.getPropertyNamespaceInfo().propertyNamespace);
			oDepartures_board.setText(data)
			var id=oDepartures_board.id;
			this.$el.html(oDepartures_board.getHTML());
			var caption = oDepartures_board.getNextWord();
			window.jQuery("#" + id).flapper(oDepartures_board.getOpts());
			$("#" + id).val(caption).change();
			var vizObj = this;	
			var tokens={"term": {"key": token_word, "value": oDepartures_board.caption},"id": {"key": token_id, "value":oDepartures_board.value}}
			vizObj.setTokens(tokens);
					
			if(oDepartures_board.auto_refresh){
				setInterval(function(){
						if(oDepartures_board.words.length == 1) {
							$("#" + id).val('').change();	
						}
						var newCaption = oDepartures_board.getNextWord();
						$("#" + id).val(newCaption).change();
						//Set tokens for the current term + any ID value or "" if blank:
						tokens={"term": {"key": token_word, "value": newCaption},"id": {"key": token_id, "value":oDepartures_board.value}}
						vizObj.setTokens(tokens);
				}, oDepartures_board.auto_refresh_period * 1000);
			}
			
			
		}
	});
});
