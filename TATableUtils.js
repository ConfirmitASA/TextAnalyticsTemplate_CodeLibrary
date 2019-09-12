/**
 * @class TATableUtils
 * @classdesc Class to work with tables using Text Analytics variables
 *
 * @constructs TATableUtils
 * @param {Object} params - {
 *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 *          folder: {TAFolder},
 *          table: {Table}
 *      }
 */

class TATableUtils{
    private var _globals;
    private var _folder: TAFolder;
    private var _table: Table;
    private var _currentLanguage;
    private var _curDictionary;

    function TATableUtils(params){
        _globals = params.context;
        _currentLanguage = _globals.report.CurrentLanguage;
        _curDictionary = Translations.dictionary(_currentLanguage);
        _folder = params.folder;
        _table = params.table;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function SetupRowsTableSorting
     * @param {Boolean} directionAscending
     * @param {Byte} position
     * @param {Number} topN
     * @param {Boolean} positionFromEnd
     */
    function SetupRowsTableSorting(directionAscending: Boolean, position: Byte, topN, positionFromEnd, fixedFromStart, fixedFromEnd){
        _table.Sorting.Rows.Enabled = true;
        _table.Sorting.Rows.SortByType = TableSortByType.Position;
        _table.Sorting.Rows.Direction = directionAscending ? TableSortDirection.Ascending : TableSortDirection.Descending;
        _table.Sorting.Rows.Position = position;
        _table.Sorting.Rows.PositionDirection =  positionFromEnd ? TableSortByPositionType.FromEnd : TableSortByPositionType.FromStart;
        _table.Sorting.Rows.TopN = topN ? topN : 0;
        _table.Sorting.Rows.FixedFromStart = fixedFromStart ? fixedFromStart : 0;
        _table.Sorting.Rows.FixedFromEnd = fixedFromEnd ? fixedFromEnd : 0;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function SetupConditionalFormatting
     * @param {Object[]} conditions - array of objects like { expression: 'cellv(col,row)<(-1)', style: 'negative'}
     * @param {String} name
     * @param {Object} applyTo - define area in object like {axis: Area.Columns, direction: Area.Left, indexes: "3"}
     */
    function SetupConditionalFormatting(conditions, name, applyTo){
        var formatter : ConditionalFormatting = _table.ConditionalFormatting;

        var area : Area = new Area();

        area.Name = name;
        area.ApplyTo(applyTo.axis, applyTo.direction, applyTo.indexes);

        for(var i = 0; i< conditions.length; i++){
            var condition: Condition = new Condition();
            condition.Expression = conditions[i].expression;
            condition.Style = conditions[i].style;
            area.AddCondition(condition);
        }

        formatter.AddArea(area);

        _table.ConditionalFormatting = formatter;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function SetupDrilldown
     * @param {String} parameterId
     * @param {String} pageIDs
     */
    function SetupDrilldown(parameterId: String, pageIDs){
        _table.Drilling.Rows.Enabled = true;
        _table.Drilling.Rows.Type = DrilldownType.SetParameter;
        _table.Drilling.Rows.ParameterID = parameterId;
        _table.Drilling.Rows.TargetPages = pageIDs;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function SetupHideEmptyRows
     * @param {Boolean} parameterId
     */
    function SetupHideEmptyRows(hideEmptyRows){
        _table.RemoveEmptyHeaders.Rows = hideEmptyRows;
    }

    /**
    * @memberof TATableUtils
    * @instance
    * @function AddClasses
    * @param {String[]} classes
    */
    function AddClasses(classes){
        _table.CssClass = ( ( !_table.CssClass ) ? "" : (_table.CssClass + " " ) ) + classes.join(" ");
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @private
     * @function _getSumOfCells
     * @description function to get formula expression for sum of previous columns
     * @param {Number} cellsNumber
     * @param {Number} offset
     * @returns {String}
     */
    private function _getSumOfCells(cellsNumber,offset){
        var cellsSum;
        var cellsValues = [];
        var columnNumber;
        for( var i = 1; i <= cellsNumber; i++){
            columnNumber = i + ( offset ? offset : 0);
            cellsValues.push(("IF(cellv(col-"+columnNumber+",row) = EMPTYV(), 0, cellv(col-"+columnNumber+",row))"));
        }

        cellsSum = "IF(("+cellsValues.join('+')+") = 0, EMPTYV(), "+cellsValues.join('+')+")"
        return cellsSum
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function GetCategoriesHeader
     * @description function to get columnHeader for total or neg, neu, pos categories
     * @param {String} groupName - "total", "neg", "neu","pos"
     * @param {Boolean} addMinus - if you want to add minus to negative values
     * @param {Boolean} hideHeader
     * @param {String} distribution - 0 - for counts, 1 - for percents
     * @param {Object} config
     * @returns {HeaderCollection}
     */
    function GetCategoriesHeader(groupName: String, addMinus, hideHeader, distribution, config){
        var header: HeaderCollection = new HeaderCollection();
        var headerFormula : HeaderFormula;
        var headerCategories: HeaderCategories;
        var categoryTitle: Label;
        var defaultConfig = {
            Positive: [8,9,10,11],
            Neutral: [5,6,7],
            Negative: [1,2,3,4]
        };
        var configuration = config ? config : defaultConfig;
        if( groupName == "all" ){
            headerCategories= new HeaderCategories();
            headerCategories.Mask.Type = MaskType.HideAll;
            headerCategories.Totals = true;

            headerCategories.HideHeader = hideHeader ? hideHeader : false;
            header.Add(headerCategories);

        }else{

            headerCategories= new HeaderCategories();
            headerCategories.Mask.Type = MaskType.ShowCodes;
            headerCategories.Totals = false;
            headerCategories.HideData = true;


            headerFormula = new HeaderFormula();
            headerFormula.Type = FormulaType.Expression;
            headerFormula.Decimals = 0;
            headerFormula.Priority = 0;

            switch(groupName.toLowerCase()){
                case "neg":
                    headerCategories.Mask.Codes = configuration.Negative.join(",");
                    headerFormula.Expression = _getSumOfCells(configuration.Negative.length)+(addMinus?"*(-1)":"");
                    categoryTitle = new Label(_currentLanguage, _curDictionary["Negative"]);
                    break;

                case "neu":
                    headerCategories.Mask.Codes = configuration.Neutral.join(",");
                    headerFormula.Expression = _getSumOfCells(configuration.Neutral.length);
                    categoryTitle = new Label(_currentLanguage, _curDictionary["Neutral"]);
                    break;

                case "pos":
                    headerCategories.Mask.Codes = configuration.Positive.join(",");
                    headerFormula.Expression = _getSumOfCells(configuration.Positive.length);
                    categoryTitle = new Label(_currentLanguage, _curDictionary["Positive"]);
                    break;
            }


            headerFormula.Title = categoryTitle;

            headerFormula.HideHeader = hideHeader ? hideHeader : false;

            if(distribution && distribution == "1"){
                headerCategories.Distributions.Enabled = true;
                headerCategories.Distributions.Count = false;
                headerCategories.Distributions.HorizontalPercents = true;
                headerFormula.Expression +="/100";
                headerFormula.Percent = true;
            }
            header.Add(headerCategories);
            header.Add(headerFormula);
        }
        return header
    }



    /**
     * @memberof TATableUtils
     * @instance
     * @function GetCategoriesExpression
     * @description function to get columnHeaderExpression for total or neg, neu, pos categories
     * @param {String} groupName - "total", "neg", "neu","pos"
     * @param {Boolean} addMinus - if you want to add minus to negative values
     * @param {Boolean} hideHeader
     * @param {String} distribution - 0 - for counts, 1 - for percents
     * @param {Object} config
     * @returns {String}
     */
    function GetCategoriesExpression( groupName: String, addMinus, hideHeader, distribution, config ){
        var expression = "";
        var defaultConfig = {
            Positive: [8,9,10,11],
            Neutral: [5,6,7],
            Negative: [1,2,3,4]
        };
    var configuration = config ? config : defaultConfig;
        if( groupName == "all" ){
            expression = '[CAT]{totals:true';
            expression += ';mask:emptyv';
            if ( hideHeader )
                expression += ';hideheader:true';
            expression += '}'
        }else{
            var categoriesHeader = '[CAT]{totals:false;hidedata:true';
            var formulaHeader = '[FORMULA]{decimals:0';
            var formulaExpression;
            var categoryLabel;
            switch(groupName.toLowerCase()){
                case "neg":
                    formulaExpression = _getSumOfCells(configuration.Negative.length, (configuration.Positive.length+configuration.Neutral.length))+(addMinus?'*(-1)':'');
                    categoryLabel = '"'+_curDictionary['Negative']+'"';
                    break;

                case "neu":
                    formulaExpression = _getSumOfCells(configuration.Neutral.length,(configuration.Positive.length));
                    categoryLabel = '"'+_curDictionary['Neutral']+'"';
                    break;

                case "pos":
                    formulaExpression = _getSumOfCells(configuration.Positive.length,0);
                    categoryLabel = '"'+_curDictionary['Positive']+'"';
                    break;
            }

            if(distribution && distribution == "1"){
                formulaExpression +="/100";
                formulaHeader += ";percent:true";
            }

            formulaHeader += ';label:'+categoryLabel+';expression:"'+formulaExpression+'"';

            if ( hideHeader )
                formulaHeader += ';hideheader:true';
            formulaHeader +='}'
            categoriesHeader += "}"
            expression = [categoriesHeader, formulaHeader].join("+")
        }
        return expression
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function GetChartHeader
     * @description function to get Header containing Barchart
     * @param {ChartComboType} type
     * @param {Object[]} formulas - array of objects with formulas like {Formula: "cellv(col-25,row)", Color: (Config.Colors.NegNeuPosPalette.Positive)}
     * @param {String} title
     * @returns {HeaderChartCombo}
     */
    function GetChartHeader(type: ChartComboType, formulas, title){
        var chartHeader: HeaderChartCombo = new HeaderChartCombo();
        var chartValues = []
        chartHeader.TypeOfChart = type;
        chartHeader.Thickness = "80%";
        chartHeader.CssClass = "chart-header";
        chartHeader.ShowTitle = true;
        chartHeader.Title = new Label(_currentLanguage, title?title:_curDictionary["Chart"]);

        var chartValue: ChartComboValue;
        for(var i = 0; i< formulas.length; i++) {
            chartValue = new ChartComboValue();
            chartValue.CssClass = "chart-value" + " " + formulas[i].CssClass;
            chartValue.Expression = formulas[i].Formula;
            chartValue.BaseColor = new ChartComboColorSet([formulas[i].Color]);
            chartValues.push(chartValue);
        }

        chartHeader.Values = chartValues;
        return chartHeader;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function GetTAQuestionExpression
     * @description function to get Expression for header containing Text Analytics variable
     * @param {String} questionType - "overallsentiment", "categories", "positivementions", "negativementions", "categorysentiment"
     * @param {String[]} mask
     * @param {String} additionalStatement
     * @returns {String}
     */
    function GetTAQuestionExpression(questionType, mask, additionalStatement){
        var rowExpression;
        var variableId = _folder.GetQuestionId(questionType);
        rowExpression = variableId+'{id:'+variableId+';collapsed:true;totals:false'+( mask && mask.length > 0 ? (';mask:'+mask.join(",")) : null )+( additionalStatement ? (";"+additionalStatement) : null)+'}';
        return rowExpression
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function GetTimePeriodHeader
     * @description function to get Header for certain time period
     * @param {String} unit - breaking by  "d" - for days, "w" - for weeks, "m" - for months, "q" - for quarters, "y" - for years
     * @param {Number} from - rolling from
     * @param {Number} to - rolling to
     * @returns {HeaderQuestion}
     */
    function GetTimePeriodHeader(unit, from, to){
        var project = _globals.report.DataSource.GetProject(_folder.GetDatasourceId());
        var questionnaireElement: QuestionnaireElement = project.CreateQuestionnaireElement(_folder.GetTimeVariableId());
        var headerTimeSeries: HeaderQuestion;

        headerTimeSeries = new HeaderQuestion(questionnaireElement);
        headerTimeSeries.TimeSeries.FlatLayout = true;
        headerTimeSeries.TimeSeries.RollingTimeseries.Enabled = true;

        headerTimeSeries.TimeSeries.Time1 = TimeseriesTimeUnitType.Year;
        switch (unit.toLowerCase()){
            case "d":
                headerTimeSeries.TimeSeries.Time2 = TimeseriesTimeUnitType.Month;
                headerTimeSeries.TimeSeries.Time3 = TimeseriesTimeUnitType.DayOfMonth;
                headerTimeSeries.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Day;
                break;
            case "w":
                headerTimeSeries.TimeSeries.Time2 = TimeseriesTimeUnitType.Week;
                headerTimeSeries.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Week;
                break;
            case "m":
                headerTimeSeries.TimeSeries.Time2 = TimeseriesTimeUnitType.Month
                headerTimeSeries.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Month;;
                break;
            case "q":
                headerTimeSeries.TimeSeries.Time2 = TimeseriesTimeUnitType.Quarter
                headerTimeSeries.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Quarter;
                break;
            case "y":
            default:
                headerTimeSeries.TimeSeries.RollingTimeseries.Unit = RollingUnitType.Year;
                break;
        }
        headerTimeSeries.ShowTotals = false;
        headerTimeSeries.TimeSeries.RollingTimeseries.From = from;
        headerTimeSeries.TimeSeries.RollingTimeseries.To = to;

        return headerTimeSeries
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function CreateTableFromExpression
     * @description function to create table from columns and rows expression
     * @param {String} rowHeaders
     * @param {String} columnHeaders
     */
    function CreateTableFromExpression(rowHeaders, columnHeaders){
        var headersArray = [rowHeaders];
        if( columnHeaders ){
            headersArray.push( columnHeaders )
        }
        var tableExpression = headersArray.join('^');
        //_table.AddHeaders(_globals.report, Config.DS_Main, tableExpression);
        _table.AddHeaders(_globals.report, _folder.GetDatasourceId(), tableExpression);
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function ClearTableDistributions
     * @description function to clear distributions presets for table
     */
    function ClearTableDistributions(){
        _table.Distribution.Count = false;
        _table.Distribution.VerticalPercents = false;
        _table.Distribution.HorizontalPercents = false;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function SetDataSupressing
     * @description function to set suppression
     * @param {Number} baseLessThen
     */
    function SetupDataSupressing(baseLessThan){
        _table.SuppressData.SuppressData = true;
        _table.SuppressData.BaseDisplay = BaseDisplayOption.Hide;
        _table.SuppressData.BaseLessThan = baseLessThan;
        _table.SuppressData.DistributionMeasure = DistributionMeasureType.InnermostColumn;
        _table.SuppressData.CellDisplay = BaseDisplayOption.Hide;
        _table.SuppressData.CellLimit = 1;
    }

    /**
     * @memberof TATableUtils
     * @instance
     * @function GetTimePeriodHeaderWithotRolling
     * @description function to get Header for time period variable with certain type
     * @param {String} unit - type  "d" - for days, "w" - for weeks, "m" - for months, "q" - for quarters, "y" - for years
     * @returns {HeaderQuestion}
     */
    function GetTimePeriodHeaderWithotRolling(unit){
        var project = _globals.report.DataSource.GetProject(_folder.GetDatasourceId());
        var questionnaireElement: QuestionnaireElement = project.CreateQuestionnaireElement(_folder.GetTimeVariableId());
        var headerTimeSeries: HeaderQuestion;

        headerTimeSeries = new HeaderQuestion(questionnaireElement);
        headerTimeSeries.TimeSeries.FlatLayout = true;
        headerTimeSeries.TimeSeries.RollingTimeseries.Enabled = true;

        switch (unit.toLowerCase()){
            case "d":
                headerTimeSeries.TimeSeries.Time1 = TimeseriesTimeUnitType.DayOfMonth;
                break;
            case "w":
                headerTimeSeries.TimeSeries.Time1 = TimeseriesTimeUnitType.Week;
                break;
            case "m":
                headerTimeSeries.TimeSeries.Time1 = TimeseriesTimeUnitType.Month;
                break;
            case "q":
                headerTimeSeries.TimeSeries.Time1 = TimeseriesTimeUnitType.Quarter;
                break;
            case "y":
            default:
                headerTimeSeries.TimeSeries.Time1 = RollingUnitType.Year;
                break;
        }
        headerTimeSeries.ShowTotals = false;
        return headerTimeSeries
    }
}