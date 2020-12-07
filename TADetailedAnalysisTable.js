/**
 * @class TADetailedAnalysisTable
 * @classdesc Class to work with Detailed Analysis table
 *
 * @constructs TADetailedAnalysisTable
 * @param {Object} params - {
 *          context: {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          folder: {TAFolder},
 *          category: {String},
 *          question: {String},
 *          distribution: "0" for counts "1" for percents,
 *          questionType: {Boolean} - true for multi, false for single
 *      }
 */
class TADetailedAnalysisTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _selectedCategory;
    private var _selectedQuestion;
    private var _distribution;
    private var _multiQuestion;
    private var _currentLanguage;
    private var _curDictionary;
    private var _bar100;

    function TADetailedAnalysisTable(params, isSigTesting){
        var context = params.context;

        _currentLanguage = context.report.CurrentLanguage;
        _curDictionary = Translations.dictionary(_currentLanguage);

        _folder = params.folder;
        _table = context.component;

        _taMasks = new TAMasks({
            context: context,
            folder: _folder
        });

        _table = context.component;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });

        _selectedCategory = params.category && params.category !== "emptyv" ? params.category : "all";
        _selectedQuestion = params.question && params.question !== "emptyv" ? params.question : "all";
        _distribution = params.distribution ? params.distribution : "0";
        _multiQuestion = params.questionType;
        _bar100 = params.toggleChart ? params.toggleChart : false;

        _render(isSigTesting);
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(isSigTesting){
        var rowexpr = _getRowheadersExpression();
        var colexpr = _getColumnheadersExpression(isSigTesting);

        _taTableUtils.CreateTableFromExpression(rowexpr, colexpr);
        _setupTableDistribution();
        _table.RowNesting = TableRowNestingType.Nesting;
        _setupConditionalFormatting();
        if (!isSigTesting) {
            _addChartColumn();
        }
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _getRowheadersExpression
     * @description Rowheader for the table are build differently based of selected blocks ad distribution type
     * If distribution is percent we add overallSentiment header as a first row to calculate percents from its value
     * if view by variable selected we add it as a top level for all headers and set it "collapsed" if it is multi
     * then we add categorySentimentHeader with mask by selected category and all its children and subchildren
     */
    private function _getRowheadersExpression(){
        var rowexpr = "";

        var blockHeader = "";
        var qType = "categorysentiment";
        var categoryHeader = "(";

        var mask = false;

        if(_distribution === "1"){
            blockHeader += _taTableUtils.GetTAQuestionExpression("overallsentiment",false,"hidedata:true") + "+";
        }

        if( _selectedQuestion !== "all" ){
            blockHeader += _selectedQuestion+'{id:'+_selectedQuestion+';totals:false'

            if(_multiQuestion){
                blockHeader+= ";collapsed:true";
            }

            blockHeader += "}/";
        }

        if( _selectedCategory != "all" ){
            mask = _taMasks.GetAllChildrenMask(_selectedCategory);
            mask.push(_selectedCategory)
        }

        categoryHeader += _taTableUtils.GetTAQuestionExpression(qType, mask) + ")";

        rowexpr += blockHeader + categoryHeader;

        return rowexpr
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _getColumnheadersExpression
     * @description for columns we have hidden base column,
     * formula column  to calculate perentage if necessary,
     * statistic column to calculate average sentiment,
     * positive, neutral and negative counts calculation(based on categories column and formula)
     */
    private function _getColumnheadersExpression(isSigTesting){
        var columnexpr = "";
        var columnbase = "[N]{hideheader:true;hidedata:true}";

        var countformula = _getColumnFormulaExpression();

        var columnAVGstatistic = "[STATISTICS]{statistics:avg}";
        var columnSTDEVstatistic = "[STATISTICS]{statistics:stdev}";
        var positivecolumn = _taTableUtils.GetCategoriesExpression( "pos", false, false, _distribution, Config.SentimentRange );
        var neutralcolumn = _taTableUtils.GetCategoriesExpression( "neu", false, false, _distribution, Config.SentimentRange );
        var negativecolumn = _taTableUtils.GetCategoriesExpression( "neg", false, false, _distribution, Config.SentimentRange );

        if (!isSigTesting) {
            columnexpr = [columnbase, countformula, columnAVGstatistic, positivecolumn, neutralcolumn, negativecolumn].join("+");
        } else {
            if (_distribution !== "1") {
                columnexpr = [columnbase, countformula, columnAVGstatistic, columnSTDEVstatistic, positivecolumn, neutralcolumn, negativecolumn].join("+");
            } else {
                columnexpr = [columnbase, countformula, columnAVGstatistic, columnSTDEVstatistic, columnbase, _getColumnFormulaExpression("0"), positivecolumn, neutralcolumn, negativecolumn].join("+");
            }
        }
        return columnexpr
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _getColumnFormulaExpression
     */
    private function _getColumnFormulaExpression(distribution){
        var countformulaexpression;
        var countformula = '[FORMULA]{decimals:0;label:"'+_curDictionary['Comments']+'";hideheader:true';
        if (_distribution === "1" && distribution !== "0") {
            countformula += ";percent:true";
            countformulaexpression = '"IF((cellv(1,1)>0),(cellv(col-1,row)/cellv(1,1)),EMPTYV())"';
        } else {
            countformula += ";percent:false";
            countformulaexpression = '"IF(cellv(col-1,row)>0,cellv(col-1,row),EMPTYV())"';
        }
        countformula += ";expression:"+countformulaexpression;
        countformula += "}";

        return countformula
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _setupTableDistribution
     */
    private function _setupTableDistribution(){
        _table.Distribution.Enabled = true;
        _table.Distribution.VerticalPercents = false;

        if(_distribution === "1"){
            _table.Distribution.HorizontalPercents = true;
            _table.Distribution.Count = false;
        }else{
            _table.Distribution.HorizontalPercents = false;
            _table.Distribution.Count = true;
        }
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _addChartColumn
     */
    private function _addChartColumn(){
    var chartType = _bar100 ? ChartComboType.Bar100 : ChartComboType.Bar
        var chartHeader =  _taTableUtils.GetChartHeader(
            chartType,
            [
                {
                    Formula: "cellv(col-25,row)",
                    Color: (Config.Colors.NegNeuPosPalette.Positive)
                },
                {
                    Formula: "cellv(col-13,row)",
                    Color: (Config.Colors.NegNeuPosPalette.Neutral)
                },
                {
                    Formula: "cellv(col-1,row)",
                    Color: (Config.Colors.NegNeuPosPalette.Negative)
                }
            ],
            " ");
        _table.ColumnHeaders.Add(chartHeader);
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _setupConditionalFormatting
     */
    private function _setupConditionalFormatting(){
        _taTableUtils.SetupConditionalFormatting(
            [
                {
                    expression: 'cellv(col, row)<('+(Config.SentimentRange.Neutral[0] - 6)+') AND cellv(col,row)<>EMPTYV() ',
                    style: 'negative'
                },

                {
                    expression: '(cellv(col, row)>=('+(Config.SentimentRange.Neutral[0] - 6)+')) AND (cellv(col, row)<='+(Config.SentimentRange.Neutral[Config.SentimentRange.Neutral.length - 1] - 6)+') AND cellv(col,row)<>EMPTYV()',
                    style: 'neutral'
                },
                {
                    expression: 'cellv(col, row)>'+(Config.SentimentRange.Neutral[Config.SentimentRange.Neutral.length - 1] - 6)+' AND cellv(col,row)<>EMPTYV()',
                    style: 'positive'
                }
            ],
            "NegNeuPos",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "3"
            }
        );

        _taTableUtils.SetupConditionalFormatting(
            [
                {
                    expression: 'cellv(col,row)>=0',
                    style: 'negative'
                },

            ],
            "Negative",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "39"
            }
        );

        _taTableUtils.SetupConditionalFormatting(
            [
                {
                    expression: 'cellv(col,row)>=0',
                    style: 'neutral'
                },

            ],
            "Neutral",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "27"
            }
        );

        _taTableUtils.SetupConditionalFormatting(
            [
                {
                    expression: 'cellv(col,row)>=0',
                    style: 'positive'
                },

            ],
            "Positive",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "15"
            }
        );
    }
}