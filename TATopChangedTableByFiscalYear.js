/**
 * @class TATopChangedTable
 * @classdesc Class to work with Most improved and most declined tables on the dashboard page
 *
 * @constructs TATopChangedTable
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFolder} folder - Text Analytics folder to build table from
 * @param {Table} table
 * @param {String} sentiment - "neg", "pos"
 * @param {String} level - 1, 2 or 3
 * @param {String} period - m, y, d, w, q
 * @param {Number} topN
 */
class TATopChangedTableByFiscalYear{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _level;
    private var _topN;
    private var _sentiment;
    private var _percents;
    private var _period;
    private var _currentLanguage;
    private var _context;

    function TATopChangedTableByFiscalYear(params){
        var context = params.context;
        _folder = params.folder;
        _taMasks = new TAMasks({context: context, folder: _folder});
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _sentiment = !!params.sentiment;
        _level = parseInt(params.level);
        _topN = params.topN ? params.topN : 5;
        _period = params.period;
        _currentLanguage = context.report.CurrentLanguage;
        _context = context;

        _render();
    }

    /**
     * @memberof TATopChangedTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TATopChangedTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType = "categorysentiment";
        var mask = _taMasks.GetCategoriesMask(_level);
        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType, mask);
        _taTableUtils.CreateTableFromExpression(rowexpr);

        _addTimeSeriesColumn();

        _addDifferenceColumn();
        _addChartColumn();
        _setupSorting();
    }

    /**
     * @memberof TATopChangedTable
     * @private
     * @instance
     * @function _addTimeSeriesColumn
     */
    private function _addTimeSeriesColumn(){
        var project = _context.report.DataSource.GetProject(_folder.GetDatasourceId());
        var questionnaireElement: QuestionnaireElement = project.CreateQuestionnaireElement(_period.question);
        var headerTimeSeries: HeaderQuestion;
        var mask: MaskFlat;
        var headerStatistics: HeaderStatistics = new HeaderStatistics();
        headerStatistics.HideHeader = true;
        headerStatistics.Statistics.Avg = true;


        for(var i = 0; i< _period.range.length; i++){
            headerTimeSeries = new HeaderQuestion(questionnaireElement);
            mask = new MaskFlat(true);
            mask.Codes.Add(_period.range[i]);
            headerTimeSeries.AnswerMask = mask;
            headerTimeSeries.ShowTotals = false;
            headerTimeSeries.Decimals = 1;
            headerStatistics.SubHeaders.Add(headerTimeSeries);
        }
        _table.ColumnHeaders.Add(headerStatistics);
    }


    /**
     * @memberof TATopChangedTable
     * @private
     * @instance
     * @function _addDifferenceColumn
     */
    private function _addDifferenceColumn(){
        var headerFormula: HeaderFormula = new HeaderFormula();
        headerFormula.Type = FormulaType.Expression;
        headerFormula.HideData = false;
        headerFormula.Decimals = 1;
        var sign = _sentiment ? ">" : "<";
        // headerFormula.Expression = "IF((cellv(col-1,row)-cellv(col-2,row))"+sign+"0,(cellv(col-1,row)-cellv(col-2,row)),EMPTYV())";
        headerFormula.Expression = "(cellv(col-1,row)-cellv(col-2,row))";
        headerFormula.Title = new Label(9, " ");
        headerFormula.HideHeader = true;

        _table.ColumnHeaders.Add(headerFormula);
    }

    /**
     * @memberof TATopChangedTable
     * @private
     * @instance
     * @function _addChartColumn
     */
    private function _addChartColumn(){
        var chartHeader = _taTableUtils.GetChartHeader(
            ChartComboType.Bar,
            [{
                Formula: "cellv(col-1,row)",
                Color: ( _sentiment ? Config.Colors.NegNeuPosPalette.Positive : Config.Colors.NegNeuPosPalette.Negative )
            }],
            Translations.dictionary(_currentLanguage)['Change in avg. score']);
        _table.ColumnHeaders.Add(chartHeader);
    }

    /**
     * @memberof TATopChangedTable
     * @private
     * @instance
     * @function _setupSorting
     */
    private function _setupSorting(){
        _taTableUtils.SetupRowsTableSorting( !_sentiment , 3, _topN );
    }
}