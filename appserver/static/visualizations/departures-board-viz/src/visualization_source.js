define([
		'jquery',
		'underscore',
		'api/SplunkVisualizationBase',
		'api/SplunkVisualizationUtils',
		'splunkjs/mvc',
		'departures-board',
		'flapper'
	],
	function (
		$,
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
		
		

		updateView: function (data, config) {
			// Return if no data
			if (!data) {
				return;
			}

			// Assign datum to the data object returned from formatData
			if (!data.meta.done)
				return;

				
			
			// Clear the div
			this.$el.empty();

			var departures_board = require('departures-board');
			var flapper = require('flapper');
			
			// Now load the visualisation
			var oDepartures_board = new departures_board();
			oDepartures_board.setConfig(config, this.getPropertyNamespaceInfo().propertyNamespace, mvc);
			oDepartures_board.setText(data)
			this.$el.html(oDepartures_board.getHTML());
					
			oDepartures_board.start();
		
		}
	});
});
