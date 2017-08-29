/**
 * @class TAThemeDistributionTable
 * @classdesc Class to work with ThemeDistribution table
 *
 * @constructs TAThemeDistributionTable
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFoldee} folder - Text Analytics folder to build table from
 * @param {Table} table
 * @param {String} sentiment - "emptyv", "neg", "neu", "pos"
 */
class TAThemeDistributionTableByFiscalYear{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _sentiment;
    private var _percents;
    private var _period;
    private var _config;
    private var _context;

    function TAThemeDistributionTableByFiscalYear(params){
        var context = params.context;
        _folder = params.folder;
        _taMasks = new TAMasks({context: context, folder: _folder});
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _period = params.period;
        _config = params.config;
        _context = context;
        _render();
    }

    /**
     * @memberof TAThemeDistributionTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType = "categorysentiment";
        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType);

        _taTableUtils.CreateTableFromExpression(rowexpr);
        _addTimeSeriesColumn();
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _addTimeSeriesColum
     */
    private function _addTimeSeriesColumn(){
    var columnsCollection: HeaderCollection = new HeaderCollection();
    var project = _context.report.DataSource.GetProject(_folder.GetDatasourceId());
    var questionnaireElement: QuestionnaireElement = project.CreateQuestionnaireElement(_period.question);
    var headerTimeSeries: HeaderQuestion;
    var mask: MaskFlat;


        for(var i=0; i<_period.range.length; i++) {
            headerTimeSeries = new HeaderQuestion(questionnaireElement);
            headerTimeSeries.ShowTotals = false;

            mask= new MaskFlat(true);
            mask.Codes.Add(_period.range[i]);
            headerTimeSeries.AnswerMask = mask;

            columnsCollection.AddRange(_getCountsColumn());

            headerTimeSeries.SubHeaders.AddRange(columnsCollection);
            _table.ColumnHeaders.Add(headerTimeSeries);
        }
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _getCountsColumn
     * @returns {HeaderCollection}
     */
    private function _getCountsColumn(){
        var columnsCollection: HeaderCollection = _taTableUtils.GetCategoriesHeader("all", false, true, false, Config.SentimentRange);
        return columnsCollection
    }
}