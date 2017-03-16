/**
 * @class TADetailedAnalysisTable
 * @classdesc Class to work with Detailed Analysis table
 *
 * @constructs TADetailedAnalysisTable
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFoldee} folder - Text Analytics folder to build table from
 * @param {Table} table
 * @param {String} selectedCategory
 * @param {String} selectedQuestion
 * @param {String} distribution - "0" for counts "1" for percents
 */
class TADetailedAnalysisTable{
    private var _globals;
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

    function TADetailedAnalysisTable(globals, folder, table, selectedCategory, selectedQuestion, distribution, multiQuestion, bar100){
        _globals = globals;
        _currentLanguage = _globals.report.CurrentLanguage;
        _curDictionary = Translations.dictionary(_currentLanguage);
        _folder = folder;
        _taMasks = new TAMasks(globals, folder);
        _table = table;
        _taTableUtils = new TATableUtils(globals, folder, table);
        _selectedCategory = selectedCategory && selectedCategory != "emptyv" ? selectedCategory : "all";
        _selectedQuestion = selectedQuestion && selectedQuestion != "emptyv" ? selectedQuestion : "all";
        _distribution = distribution ? distribution : "0";
        _multiQuestion = multiQuestion;
        _bar100 = bar100 ? bar100 : false;
    var currentLanguage =
        _render();
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
    private function _render(){
        var rowexpr = _getRowheadersExpression();
        var colexpr = _getColumnheadersExpression();

        _taTableUtils.CreateTableFromExpression(rowexpr, colexpr);
        _setupTableDistribution();
        _table.RowNesting = TableRowNestingType.Nesting;
        _setupConditionalFormatting();
        _addChartColumn();
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _getRowheadersExpression
     */
    private function _getRowheadersExpression(){
        var rowexpr = "";

        var blockHeader = "";
        var qType = "categorysentiment";
        var categoryHeader = "(";

        var mask = false;

        if(_distribution == "1"){
            blockHeader += _taTableUtils.GetTAQuestionExpression("overallsentiment",false,"hidedata:true") + "+";
        }

        if( _selectedQuestion != "all" ){
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
     */
    private function _getColumnheadersExpression(){
        var columnexpr = "";
        var columnbase = "[N]{hideheader:true;hidedata:true}";

        var countformula = _getColumnFormulaExpression();

        var columnstatistic = "[STATISTICS]{statistics:avg}";
        var positivecolumn = _taTableUtils.GetCategoriesExpression( "pos", false, false, _distribution, Config.SentimentRange );
        var neutralcolumn = _taTableUtils.GetCategoriesExpression( "neu", false, false, _distribution, Config.SentimentRange );
        var negativecolumn = _taTableUtils.GetCategoriesExpression( "neg", false, false, _distribution, Config.SentimentRange );

        columnexpr = [columnbase, countformula, columnstatistic, positivecolumn, neutralcolumn, negativecolumn].join("+");
        return columnexpr
    }

    /**
     * @memberof TADetailedAnalysisTable
     * @private
     * @instance
     * @function _getColumnFormulaExpression
     */
    private function _getColumnFormulaExpression(){
        var countformulaexpression;
        var countformula = '[FORMULA]{decimals:0;label:"'+_curDictionary['Comments']+'";hideheader:true';
        if( _distribution == "1"){
            countformula += ";percent:true";
            countformulaexpression = '"IF((cellv(1,1)>0),(cellv(col-1,row)/cellv(1,1)),EMPTYV())"';
        }else{
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

        if(_distribution == "1"){
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