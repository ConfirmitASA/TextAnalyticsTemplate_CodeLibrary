/**
 * @class TATopSentimentTable
 * @classdesc Class to work with Most positive and most negative tables on the dashboard page
 *
 * @constructs TATopSentimentTable
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFolder} folder - Text Analytics folder to build table from
 * @param {Table} table
 * @param {String} sentiment - "neg", "pos"
 * @param {String} level - 1, 2 or 3
 * @param {Number} topN
 */
class TATopSentimentTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _level;
    private var _currentLanguage;
    private var _topN;
    private var _sentiment;
    private var _distribution;

    function TATopSentimentTable(params){
        var context = params.context;
        _folder = params.folder;
        _taMasks = new TAMasks({context: context, folder: _folder});
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _sentiment = !!(params.sentiment);
        _level = parseInt(params.level);
        _topN = params.topN ? params.topN : 5;
        _distribution = params.distribution ? params.distribution : "0";
        _currentLanguage = context.report.CurrentLanguage;
        _render();
    }

    /**
     * @memberof TATopSentimentTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TATopSentimentTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType = "categorysentiment";
        var mask = _taMasks.GetCategoriesMask(_level);
        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType, mask);
        var sentiment = _sentiment ? "pos" : "neg";
        var columnexpr = _taTableUtils.GetCategoriesExpression( sentiment, false, false, _distribution, Config.SentimentRange );
        _taTableUtils.CreateTableFromExpression(rowexpr, columnexpr);
        _addChartColumn();
        _setupSorting();
    }

    /**
     * @memberof TATopSentimentTable
     * @private
     * @instance
     * @function _addChartColum
     */
    private function _addChartColumn(){
        var chartHeader = _taTableUtils.GetChartHeader(
            ChartComboType.Bar,
            [{
                Formula: "cellv(col-1,row)",
                Color: ( _sentiment ? Config.Colors.NegNeuPosPalette.Positive : Config.Colors.NegNeuPosPalette.Negative )
            }],
            Translations.dictionary(_currentLanguage)['Count']);
        _table.ColumnHeaders.Add(chartHeader);
    }

    /**
     * @memberof TATopSentimentTable
     * @private
     * @instance
     * @function _setupSorting
     */
    private function _setupSorting(){
        _taTableUtils.SetupRowsTableSorting( false, 2, _topN, true);
    }
}