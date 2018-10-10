/**
 * @class TAOverallSentimentChangeTable
 * @classdesc Class to work with Most positive and most negative tables on the dashboard page
 *
 * @constructs TATopItemsTable
 * @param {Object} params - {
 *          context: {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          folder: {TAFolder},
 *          table: {Table},
 *          sentiment: {Boolean},
 *          level: {String} - "1", "2", "3",
 *      }
 */
class TAOverallSentimentChangeTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _table: Table;
    private var _currentLanguage;
    private var _period;
    private var _config;

    function TAOverallSentimentChangeTable(params){
        var context = params.context;
        _folder = params.folder;
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _config = params.config;
        _currentLanguage = context.report.CurrentLanguage;
        _period = {
            Unit: params.period ? params.period : "m",
            From: -2,
            To: -1
        };
        _render();
    }

    /**
     * @memberof TAOverallSentimentChangeTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TAOverallSentimentChangeTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType = "overallsentiment";
        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType);
        _taTableUtils.CreateTableFromExpression(rowexpr);
        _addTimeSeriesColumn();
    }

    /**
     * @memberof TAOverallSentimentChangeTable
     * @private
     * @instance
     * @function _addTimeSeriesColumn
     * @description for columns we use timeseries header with rolling and counts and sentiments(hidden) subheaders
     */
    private function _addTimeSeriesColumn(){
        var headerTimeSeries : HeaderQuestion = _taTableUtils.GetTimePeriodHeader(_period.Unit, _period.From, _period.To);
        _table.ColumnHeaders.Add(headerTimeSeries);
    }
}