/**
 * @class TAPreviousYearsTrendTable
 * @classdesc Class to create TAPreviousYearsTrendTable table
 *
 * @constructs TAPreviousYearsTrendTable
 * @param {Object} params - {
 *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          table: {Table},
 *          folder: {TAFolder}
 *      }
 */
class TAPreviousYearsTrendTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _table: Table;
    private var _period_months;
    private var _period_years;

    function TAPreviousYearsTrendTable(params){
        var context = params.context;
        _folder = params.folder;
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });

        _period_months = {
            Unit: "m"
        };
        _period_years = {
            Unit: "y",
            From: params.period && params.period.From ? params.period.From : -2,
            To: params.period && params.period.To ? params.period.To : 0
        };
        _render();
    }

    /**
     * @memberof TAPreviousYearsTrendTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TAPreviousYearsTrendTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType = "overallsentiment";
        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType);
        _taTableUtils.CreateTableFromExpression(rowexpr);
        _addTimeSeriesRow();
        _addTimeSeriesColumn();
    }

    /**
     * @memberof TAPreviousYearsTrendTable
     * @private
     * @instance
     * @function _addTimeSeriesColumn
     * @description for columns we use timeseries header without any rollyng with timeSeries = "Month"
     */
    private function _addTimeSeriesColumn(){
        var headerTimeSeries : HeaderQuestion = _taTableUtils.GetTimePeriodHeaderWithotRolling(_period_months.Unit);
        _table.ColumnHeaders.Add(headerTimeSeries);

    }

    /**
     * @memberof TAPreviousYearsTrendTable
     * @private
     * @instance
     * @function _addTimeSeriesRow
     * @description for rows we use 3 previous years nested in "Overal Sentiment" header
     */
    private function _addTimeSeriesRow(){
        var headerTimeSeries : HeaderQuestion = _taTableUtils.GetTimePeriodHeader(_period_years.Unit, _period_years.From, _period_years.To);
        _table.RowHeaders[0].SubHeaders.Add(headerTimeSeries);
    }
}