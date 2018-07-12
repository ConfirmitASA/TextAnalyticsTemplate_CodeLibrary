/**
 * @class TACorrelationTable
 * @classdesc Class to work with Correlation table
 *
 * @constructs TACorrelationTable
 * @param {Object} params - {
 *          context: {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          folder: {TAFolder},
 *          category: {String}
 *      }
 */
class TACorrelationTable{
    private var _globals;
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _selectedCategory;
    private var _selectedQuestion;
    private var _currentLanguage;
    private var _curDictionary;

    function TACorrelationTable(params){
        var context = params.context;
        _globals = context;
        _currentLanguage = context.report.CurrentLanguage;
        _curDictionary = Translations.dictionary(_currentLanguage);
        _folder = params.folder;
        _table = context.component;
        _selectedQuestion = params.question;

        _taMasks = new TAMasks({
            context: context,
            folder: _folder
        });

        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });

        _selectedCategory = params.category && params.category !== "emptyv" ? params.category : "all";

        _render();
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _render
     */
    private function _render(){
        var rowexpr = _getRowheadersExpression();
        _taTableUtils.CreateTableFromExpression(rowexpr);
        _createColumns();
        _setupConditionalFormatting();
        _setupSupressing();
        _setupSorting();
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _getRowheadersExpression
     * @description for TACorrelation we have OverallSentiment header as a first row to calculate thresholds
     * then we have CategorySentiment header to calculate statistics for the list of categories
     * we apply inclusive mask on categories follow next rules:
     *      1. If no Category selected we masking all Top Categories
     *      2. If selected category doesn't have children we masking only selected category
     *      3. If selected category has children we masking all children for that category (without subchildren)
     */
    private function _getRowheadersExpression(){
        var rowexpr = "";
        var qType = "categorysentiment";
        var categoryHeader = "";

        var mask = false;


        if( _selectedCategory != "all" ){
            var chMask = _taMasks.GetChildrenMask(_selectedCategory);
            if(chMask.length >0){
                mask = chMask;
            }else{
                mask = [_selectedCategory]
            }
        } else{
            mask = _taMasks.GetCategoriesMask(0)
        }

        categoryHeader += _taTableUtils.GetTAQuestionExpression(qType, mask);

        var overallHeader = _taTableUtils.GetTAQuestionExpression("overallsentiment");
        rowexpr = [overallHeader,categoryHeader].join("+");
        return rowexpr
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _createColumns()
     * @description for TACorrelationTable we have Statistics column to calculate average sentiment,
     * then correlation by selected variable,
     * Base column to calculate counts
     * Formula to sort the table by
     */
    private function _createColumns(){
        var columnsCollection: HeaderCollection = new HeaderCollection();
        columnsCollection.Add(_getStatisticsColumn());
        columnsCollection.Add(_getCorrelation());
        columnsCollection.Add(_getBaseColumn());
        columnsCollection.Add(_getFormulaColumn());
        _table.ColumnHeaders.AddRange(columnsCollection);
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _getStatisticsColumn
     */
    private function _getStatisticsColumn(){
        var headerStatistics;
        headerStatistics = new HeaderStatistics();
        headerStatistics.Statistics.Avg = true;

        return headerStatistics
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _getCorrelation
     */
    private function _getCorrelation(){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(_globals);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var project = _globals.report.DataSource.GetProject(folder.GetDatasourceId());

        var questionnaireElement: QuestionnaireElement = project.CreateQuestionnaireElement(_selectedQuestion);

        var headerCorrelation : HeaderCorrelation = new HeaderCorrelation(CorrelationType.Correlation, questionnaireElement);

        headerCorrelation.Decimals = 3;

        return headerCorrelation
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _getBaseColumn
     */
    private function _getBaseColumn(){
        var headerBase: HeaderBase = new HeaderBase();
        return headerBase
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _getFormulaColumn
     * @description Formula is calculated based on AdjustedSentiment
     * if categorySentiment < overallSentiment then Adjusted sentiment = (10-categorySentiment+5), else Adjusted sentiment = (categorySentiment+5)
     * final value is AdjustedSentiment * Counts * Correlation
     */
    private function _getFormulaColumn(){
        var headerFormula: HeaderFormula = new HeaderFormula();
        headerFormula.Type = FormulaType.Expression;
        headerFormula.Expression = "(IF(cellv(col-3,row)<cellv(col-3,1), (10 - (cellv(col-3,row) + 5)), (cellv(col-3,row) + 5))) * cellv(col-2,row) * cellv(col-1, row)";
        headerFormula.HideData = false;

        return headerFormula
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _setupConditionalFormatting
     * @description Conditional formatting is used to define key area for each category
     *      1. issues: categorySentiment <= overallSentiment && correlation > 0
     *      2. monitor: categorySentiment < overallSentiment && correlation <= 0
     *      3. strength: categorySentiment > overallSentiment && correlation >0
     *      4. maintain: ctegorySentiment > overallSentiment && correlation <=0
     * conditional formatting applied to the firs column and then used by js fuction to create chart and 4 different tables
     */
    private function _setupConditionalFormatting(){
        _taTableUtils.SetupConditionalFormatting(
            [
                {
                    expression: 'cellv(col + 1, row)>0 AND cellv(col,row) <= cellv(col, 1) ',
                    style: 'issues'
                },

                {
                    expression: '(cellv(col + 1, row) = EMPTYV() OR cellv(col + 1, row)<=0) AND cellv(col,row) <= cellv(col, 1) ',
                    style: 'monitor'
                },
                {
                    expression: 'cellv(col + 1, row)>0 AND cellv(col,row) > cellv(col, 1) ',
                    style: 'strength'
                },
                {
                    expression: '(cellv(col + 1, row) = EMPTYV() OR cellv(col + 1, row)<=0) AND cellv(col,row) > cellv(col, 1) ',
                    style: 'maintain'
                }
            ],
            "KeyAreas",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "1"
            }
        )
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _setupSupressing
     */
    private function _setupSupressing(){
        /*_table.SuppressData.BaseLessThan = 10;
        _table.SuppressData.BaseDisplay = BaseDisplayOption.Hide;
        _table.SuppressData.SuppressData = true;*/

        var suppressingBase = _folder.GetCorrelationSuppressingBase();
        //_table.SuppressData.CellLimit =
        _table.SuppressData.BaseLessThan = suppressingBase  || 0;
        //_table.SuppressData.CellDisplay =
        _table.SuppressData.BaseDisplay = BaseDisplayOption.Hide;
        //_table.SuppressData.Statistic = StatisticType.Count;
        //_table.SuppressData.CellStatistic = CellStatisticType.Count;
        //_table.SuppressData.DistributionMeasure = DistributionMeasureType.InnermostRow;
        _table.SuppressData.SuppressData = true;
    }

    /**
     * @memberof TACorrelationTable
     * @instance
     * @private
     * @function _setupSorting()
     */
    private function _setupSorting(){
        _taTableUtils.SetupRowsTableSorting(false, 1, 0, true, 1);
    }
}