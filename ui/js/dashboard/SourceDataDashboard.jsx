'use strict';

var _     = require('lodash');
var React = require('react');
var api = require('../data/api.js')
var moment = require('moment');
var page = require('page');

var AppActions          = require('actions/AppActions');
var Overview   = require('dashboard/nco/Overview.jsx');
var Breakdown  = require('dashboard/nco/Breakdown.jsx');
var CampaignTitleMenu   = require('component/CampaignTitleMenu.jsx');
var NavigationStore     = require('stores/NavigationStore');

var ResultsTable = require('doc-review/DocResults.js');
var MappingTable = require('doc-review/DocMapping.js');
var DocOverview = require('doc-review/DocOverview.js');
var TitleMenu  = require('component/TitleMenu.jsx');
var MenuItem            = require('component/MenuItem.jsx');


var {
	Datascope, LocalDatascope,
	SimpleDataTable, SimpleDataTableColumn,
	Paginator, SearchBar,
	FilterPanel, FilterDateRange
	} = require('react-datascope');

var SourceDataDashboard = React.createClass({
  propTypes : {
    dashboard : React.PropTypes.object.isRequired,
    data      : React.PropTypes.object.isRequired,
    region    : React.PropTypes.object.isRequired,

    loading   : React.PropTypes.bool
  },

	getInitialState : function () {
    return {
      regions      : [],
      campaigns    : [],
      region       : null,
      campaign     : null,
      dashboard    : null,
    };
  },

  getDefaultProps : function () {
    return {
      loading : false
    };
  },

  render : function () {
    var loading = this.props.loading;
		var region = this.props.region


		var docItems = MenuItem.fromArray(
			_.map(NavigationStore.documents, d => {
				return {
					title : d.docfile,
					value : d.id
				};
			}),
			this._setDocId);

		var doc_tools = MenuItem.fromArray(
			_.map(['overview','mapping','validate','results','dashboard'], d => {
				return {
					title : d,
					value : d
				};
			}),
			this._setDocTool);

		var docName = doc_id
		var doc_tool = 'validate'


		var doc_id = 66
		var parseSchema = require('../ufadmin/utils/parseSchema');
	  var some_schema = {"fields": [{"name": "id", "title": "id"},{"name": "campaign", "title": "campaign"}]}
		var schema = parseSchema(some_schema)



		// navigation to set doc-id and doc-processor //
		var review_nav =
		<div className="admin-container">
			<h1 className="admin-header"></h1>
			<div className="row">
				document_id: <TitleMenu text={docName}>
					{docItems}
				</TitleMenu>
			</div>
			<div className="row">
			<TitleMenu text={doc_tool}>
				{doc_tools}
			</TitleMenu>
			</div>
		</div>;

		// data table //
		var review_table = <MappingTable
					region={region}
					loading={loading}
					doc_id={doc_id}
					>
				</MappingTable>

		var review_breakdown = <DocOverview
			doc_id={doc_id}
			loading={loading}
			>
		</DocOverview>

		return (<div className="row">
					<div className="medium-9 columns">
						{review_table}
					</div>
					<div className="medium-3 columns">
						{review_nav}
						{review_breakdown}
					</div>
		</div>);;
  },
});

module.exports = SourceDataDashboard;
