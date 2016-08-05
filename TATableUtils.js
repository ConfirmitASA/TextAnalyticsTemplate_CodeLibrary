class TATableUtils{
    //Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;

    /**
     * @param {Logger} l - log
     * @param {Report} r - report
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     */
    static function setGlobals(p: ScriptPageContext, l: Logger, r: Report, c: ConfirmitFacade, u: User){
    pageContext = p;
    log = l;
    report = r;
    confirmit = c;
    user = u;
}

    /*------------Header functions----------------*/

    /**
     * function to get HeaderQuestion for TA fields
     * @param {String} type - one of 6 types of TA question: "verbatim", "overallSentiment", "categories", "positiveMentions", "negativeMentions", "categorySentiment"
     * @return {HeaderQuestion}
     */
    static function getTAQuestionHeader(type: String){
        var headerQuestion: HeaderQuestion;

        switch(type){
            case "overallSentiment":
                headerQuestion = new HeaderQuestion(TALibrary.currentQuestion.overallSentiment.questionnaireElement);
                headerQuestion.DefaultStatistic = StatisticsType.Average;
                headerQuestion.Preaggregation = PreaggregationType.Average;
                headerQuestion.HeaderId = "overall_sentiment";
                break;

            case "categories":
                headerQuestion = new HeaderQuestion(TALibrary.currentQuestion.categories.questionnaireElement);
                break;

            case "positiveMentions":
                headerQuestion = new HeaderQuestion(TALibrary.currentQuestion.positiveMentions.questionnaireElement);
                break;

            case "negativeMentions":
                headerQuestion = new HeaderQuestion(TALibrary.currentQuestion.negativeMentions.questionnaireElement);
                break;

            case "categorySentiment":
                headerQuestion = new HeaderQuestion(TALibrary.currentQuestion.categorySentiment.questionnaireElement);
                headerQuestion.DefaultStatistic = StatisticsType.Average;
                headerQuestion.Preaggregation = PreaggregationType.Average;
                break;

            case "verbatim":
            default:
                headerQuestion = new HeaderQuestion(TALibrary.currentQuestion.verbatim.questionnaireElement);
                break;
        }
        headerQuestion.IsCollapsed = true;
        headerQuestion.Distributions.Enabled = true;
        headerQuestion.Distributions.Count = true;

        return headerQuestion;
}

    /**
     * function to get total respondents row for the vertical percent formulas
     * @returns {QuestionHeader}
     */
    static function getTotalCategoriesHeader(){
        var totalRespondentsHeader: HeaderQuestion;
        totalRespondentsHeader = getTAQuestionHeader("categories");
        totalRespondentsHeader.IsCollapsed = true;
        totalRespondentsHeader.AnswerMask = getHideAllMask();
        totalRespondentsHeader.ShowTotals = true;
        totalRespondentsHeader.HideData = true;
        return totalRespondentsHeader;
    }

    /**
     * function to have categories header for Negative, Neutral, Positive and Total values
     * @param {String} groupName - "total", "neg", "neu", "pos"
     * @param {Boolean} addMinus - flag to add minus to the formula(only for negative category)
     * @param {String} distribution - 0 for "count" or 1 for "percents" count by default
     */
    static function getCategoriesHeader(groupName: String, addMinus, distribution){
    var header: HeaderCollection = new HeaderCollection();
    var headerFormula : HeaderFormula;
    var headerCategories: HeaderCategories;
    var categoryTitle: Label;
    if(groupName=="total"){
        headerCategories= new HeaderCategories();
        headerCategories.Mask.Type = MaskType.HideAll;
        headerCategories.Totals = true;

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

        switch(groupName){
            case "neg":
                headerCategories.Mask.Codes = '1,2,3,4';
                headerFormula.Expression = "(cellv(col-4,row)+cellv(col-3,row)+cellv(col-2,row)+cellv(col-1,row))"+(addMinus?"*(-1)":"");
                categoryTitle = new Label(9, "Negative");
                break;
            case "neu":
                headerCategories.Mask.Codes = '5,6,7';
                headerFormula.Expression = "(cellv(col-1,row)+cellv(col-2,row)+cellv(col-3,row))";
                categoryTitle = new Label(9, "Neutral");
                break;
            case "pos":
                headerCategories.Mask.Codes = '8,9,10,11';
                headerFormula.Expression = "(cellv(col-4,row)+cellv(col-3,row)+cellv(col-2,row)+cellv(col-1,row))";
                categoryTitle = new Label(9, "Positive");
                break;
        }

        headerFormula.Title = categoryTitle;

        if(distribution == "1"){
            headerCategories.Distributions.Enabled = true;
            headerCategories.Distributions.Count = false;
            headerCategories.Distributions.HorizontalPercents = true;
            headerFormula.Expression +="/100";
            headerFormula.Percent = true;
        }
        header.Add(headerCategories);
        header.Add(headerFormula);
    }

    return header;

}

    /**
     * function to get Total, Average and Problem Index headers in detailed analysis chart
     * @param {Boolean} hide - hide data for Total and Sentiment(use in table for problem index chart)
     * @return {HeaderCollection}
     */
    static function getProblemIndexHeader(hide){
    var header: HeaderCollection = new HeaderCollection();
    var colq: HeaderCategories = new HeaderCategories();

    colq.HideData = hide;
    colq.Mask.Type = MaskType.HideAll;
    colq.Distributions.HorizontalPercents = false;
    colq.Distributions.VerticalPercents = false;
    colq.Totals = true;
    header.Add(colq);

    colq=new HeaderCategories();
    colq.HideData = true;
    colq.Distributions.HorizontalPercents = false;
    colq.Distributions.VerticalPercents = false;
    colq.Totals = true;
    header.Add(colq);

    var cf: HeaderFormula = new HeaderFormula();

    cf.Type = FormulaType.Expression;
    cf.HideData = hide
    cf.Decimals = 2;
    cf.Expression = "IF(((cellv(col-1,row))>0),(((cellv(col-12,row)*(-5)+cellv(col-11,row)*(-4)+cellv(col-10,row)*(-3)+cellv(col-9,row)*(-2)+cellv(col-8,row)*(-1)+cellv(col-6,row)+cellv(col-5,row)*(2)+cellv(col-4,row)*(3)+cellv(col-3,row)*(4)+cellv(col-2,row)*(5))*10/(cellv(col-1,row)))/10),0)";
    cf.Title = new Label(9, "Avg");
    header.Add(cf);

    cf = new HeaderFormula();
    cf.Decimals = 0;
    cf.Type = FormulaType.Expression;
    cf.Expression = "IF((CELLV(COL-1,ROW) - 1)< 0 ,(1 - ROUND(CELLV(COL-1,ROW),2)) * CELLV(COL-2,ROW),EMPTYV())";
    cf.Title = new Label(9, "Problem Index");
    header.Add(cf);

    return header;
}

    /**
     * function to have TimeSeries column header with rolling
     * @param {int} from
     * @param {int} to
     * @return {HeaderQuestion}
     */
    static function getTimeSeries(unit,from, to){
    var questionnaireElement: QuestionnaireElement = TALibrary.currentQuestion.project.CreateQuestionnaireElement(Config.DateVariableId);
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
     * function to get barchart in the table
     * @param {ChartComboType} type - bar or 100% bar
     * @param {Object[]} formulas - array of formulas and colors for series
     * @param {String} title - Header title for chart (Chart by default)
     */
    static function getChartHeader(type: ChartComboType,formulas, title){
    var chartHeader: HeaderChartCombo = new HeaderChartCombo();
    var chartValues = []
    chartHeader.TypeOfChart = type;
    chartHeader.Thickness = "80%";
    chartHeader.CssClass = "chart-header";
    chartHeader.ShowTitle = true;
    chartHeader.Title = new Label(9, title?title:"Chart");
    //chartHeader.HideHeader = true;

    var chartValue: ChartComboValue;
    for(var i = 0; i< formulas.length; i++) {
        chartValue = new ChartComboValue();
        chartValue.CssClass = "chart-value";
        chartValue.Expression = formulas[i].Formula;
        chartValue.BaseColor = new ChartComboColorSet([formulas[i].Color]);
        chartValues.push(chartValue);
    }

    chartHeader.Values = chartValues;
    return chartHeader;
}




    /*-----------masking functions----------------*/

    /**
     * masking only top categories
     * @return {MaskFlat}
     */
    static function getThemesMask(){
    var mask: MaskFlat = new MaskFlat();

    mask.IsInclusive = true;

    for(var i=0; i<TALibrary.currentQuestion.themes.length; i++){
        mask.Codes.Add(TALibrary.currentQuestion.themes[i].id);
    }

    return mask
}

    /**
     * masking only sub categories
     * @param {String} parentId - return only categories for selected theme otherwise return all subcategories mask
     * @return {MaskFlat}
     */
    static function getCategoriesMask(parentId){
    var mask: MaskFlat = new MaskFlat();
    var categoriesList = parentId?TALibrary.currentQuestion.themes[parentId].children:TALibrary.currentQuestion.subcategories;
    mask.IsInclusive = true;

    for(var i=0; i<categoriesList.length; i++){
        mask.Codes.Add(categoriesList[i].id);
    }

    return mask
}

    /**
     * masking only attributes
     * @param {String} parentId - return only attributes for selected category otherwise return all attributes mask
     * @return {MaskFlat}
     */
    static function getAttributesMask(parentId){
    var mask: MaskFlat = new MaskFlat();
    var categoriesList = parentId?TALibrary.currentQuestion.subcategories[parentId].children:TALibrary.currentQuestion.attributes;
    mask.IsInclusive = true;

    for(var i=0; i<categoriesList.length; i++){
        mask.Codes.Add(categoriesList[i].id);
    }

    return mask
}

    static function getHideAllMask(){
        var mask: MaskFlat = new MaskFlat();

        mask.IsInclusive = false;

        for(var i=0; i<TALibrary.currentQuestion.categoriesArray.length; i++){
            mask.Codes.Add(TALibrary.currentQuestion.categoriesArray[i].id);
    }

    return mask
}

    /**
     * masking only selected category
     * @return {MaskFlat}
     */
    static function getCurrentCategoryMask(){
    var mask: MaskFlat = new MaskFlat();
    mask.IsInclusive = true;
    var categoryId = TALibrary.currentQuestion.themes[ TALibrary.currentQuestion.currentTheme].id;
    mask.Codes.Add(categoryId);

    return mask
}

    /**
     * recursive function to have all children and grand-chilren from array
     * @param {MaskFlat} mask
     * @param {TA} children
     */
    static function addChildrenToMask(mask: MaskFlat, children){
        for(var i = 0; i< children.length; i++){
            mask.Codes.Add(children[i].id);
            addChildrenToMask(mask, children[i].children);
        }
    }

    /**
     * function to get all hierarchical tree for the current category
     * @returns {MaskFlat}
     */
    static function getCurrentCategoryTreeMask(){
        var mask: MaskFlat = new MaskFlat();
        mask.IsInclusive = true;
        var categoryId = TALibrary.currentQuestion.themes[ TALibrary.currentQuestion.currentTheme].id;
        mask.Codes.Add(categoryId);
        addChildrenToMask(mask, TALibrary.currentQuestion.themes[ TALibrary.currentQuestion.currentTheme].children);
        return mask
    }

    /*-----------conditional formatting functions--------*/

    /**
     * function to geat conditional formatting area
     * @param {Object[]} conditions - array of objects { expression: "some expression", style: "some style" }
     * @param {String} name - name for the conditional formatting area
     * @param {Object} applyTo - array of objects { axis: Area.Column, direction: Area.Left, indexes: "3-5" }
     * @returns {Area}
     */
    static function setupConditionalFormatting(conditions,name, applyTo){
        var area : Area = new Area();

        area.Name = name;

        area.ApplyTo(applyTo.axis, applyTo.direction, applyTo.indexes);


        for(var i = 0; i< conditions.length; i++){
            var condition: Condition = new Condition();
            condition.Expression = conditions[i].expression;
            condition.Style = conditions[i].style;
            area.AddCondition(condition);
        }

        return area;
    }


    /*-----------setup Table functions-------------*/

    /**
     * function to setub categories drilldown
     * @param {Table} table
     * @param {String} parameterId
     * @param {String} pageIDs - string with pageIDs for drilldown separated by commas
     */
    static function setupTableDrilldown(table: Table, parameterId: String, pageIDs){
    table.Drilling.Rows.Enabled = true;
    table.Drilling.Rows.Type = DrilldownType.SetParameter;
    table.Drilling.Rows.ParameterID = parameterId;
    table.Drilling.Rows.TargetPages = pageIDs;
}

    /**
     * add classes to the table
     * @param {Table} table
     * @param {String[]} classes - array of classes that should be added
     */
    static function setupTableClasses(table: Table, classes){
        table.CssClass=((!table.CssClass)?"":(table.CssClass+" "))+classes.join(" ");
    }

    /**
     *sorting rows by Nth column from start
     * @param {Table} table
     * @param {Boolean} directionAscending - if sorting Ascending
     * @param {Byte} position - Nth column from start
     * @param {Byte} topN ho many rows from start will be shown in table
     */
    static function setupRowsTableSorting(table: Table, directionAscending: Boolean, position: Byte, topN){
        table.Sorting.Rows.Enabled = true;
        table.Sorting.Rows.SortByType = TableSortByType.Position;
        table.Sorting.Rows.Direction = directionAscending?TableSortDirection.Ascending:TableSortDirection.Descending;
        table.Sorting.Rows.Position = position;
        table.Sorting.Rows.PositionDirection =  TableSortByPositionType.FromStart;
        table.Sorting.Rows.TopN = topN?topN:0;
    }

    /*---------creating tables--------*/


    /**
     * DB:  top positive or negative themes table
     * @param {Table} table
     * @param {String} level - value of TA_LEVEL parameter "categories", "attributes" or "themes"
     * @param {Byte} topN - top N rows for sorting, 0 by default
     * @param {String} sentiment - negative or positive sentiment ("neg", "pos"), negative by default
     * @param {String} distribution - 0 for "count" or 1 for "percents" count by default
     */
    static function createTopSentimentTable(table: Table, level, topN, sentiment,distribution){
    var taCategoriesHeader: HeaderQuestion = getTAQuestionHeader(sentiment.toLowerCase()=="pos"?"positiveMentions":"negativeMentions");

    taCategoriesHeader.ShowTotals = false;

    switch(level.toLowerCase()){
        case "categories":
            taCategoriesHeader.AnswerMask = getCategoriesMask();
            break;
        case "attributes":
            taCategoriesHeader.AnswerMask = getAttributesMask();
            break;
        case "themes":
        default:
            taCategoriesHeader.AnswerMask = getThemesMask();
            break;
    }

    table.RowHeaders.Add(taCategoriesHeader);
    var headerBase: HeaderBase = new HeaderBase();
    headerBase.HideHeader = true;
    if(distribution == "1"){
        headerBase.Distributions.Enabled = true;
        headerBase.Distributions.Count = false;
        headerBase.Distributions.VerticalPercents = true;
    }
    table.ColumnHeaders.Add(headerBase);



    table.ColumnHeaders.Add(getChartHeader(ChartComboType.Bar,[{Formula: "cellv(col-1,row)", Color: (sentiment=="pos"?Config.Colors.NegNeuPosPalette.Positive:Config.Colors.NegNeuPosPalette.Negative)}],"Count"));

    setupRowsTableSorting(table, false, 1, topN);
}

    /**
     * DB:  top improved and top declined themes
     * @param {Table} table
     * @param {String} level - value of TA_LEVEL parameter "categories, "attributes" or "themes"
     * @param {Byte} topN - top N rows for sorting, 0 by default
     * @param {String} sentiment - negative or positive sentiment ("neg", "pos"), negative by default
     * @param {String} period - value of TA_COMPARE_PERIODS parameter "wow", "qoq", "mom" or "yoy" ("qoq by default")
     */
    static function createTopChangedThemesTable(table: Table, level, topN, sentiment, period){
    var taCategoriesHeader: HeaderQuestion = getTAQuestionHeader("categorySentiment");

    taCategoriesHeader.ShowTotals = false;

    switch(level.toLowerCase()){
        case "categories":
            taCategoriesHeader.AnswerMask = getCategoriesMask();
            break;
        case "attributes":
            taCategoriesHeader.AnswerMask = getAttributesMask();
            break;
        case "themes":
        default:
            taCategoriesHeader.AnswerMask = getThemesMask();
            break;
    }

    var unit = getTimeSeries(period.toLowerCase().substr(0,1));
    var from = -1;
    var to = 0;
    var headerTimeSeries: HeaderQuestion = getTimeSeries(period.toLowerCase().substr(0,1),from,to)


    var headerStatistics: HeaderStatistics = new HeaderStatistics();
    headerStatistics.HideHeader = true;
    headerStatistics.Statistics.Avg = true;
    headerStatistics.SubHeaders.Add(headerTimeSeries);

    var headerFormula: HeaderFormula = new HeaderFormula();
    headerFormula.Type = FormulaType.Expression;
    headerFormula.HideData = false;
    headerFormula.Decimals = 1;
    headerFormula.Expression = "cellv(col-1,row)-cellv(col-2,row)";
    headerFormula.Title = new Label(9, " ");
    headerFormula.HideHeader = true;


    table.RowHeaders.Add(taCategoriesHeader);
    table.ColumnHeaders.Add(headerStatistics);
    table.ColumnHeaders.Add(headerFormula);
    table.ColumnHeaders.Add(getChartHeader(ChartComboType.Bar,[{Formula: "cellv(col-1,row)", Color: (sentiment=="pos"?Config.Colors.NegNeuPosPalette.Positive:Config.Colors.NegNeuPosPalette.Negative)}], "Change in avg. score"));

    setupRowsTableSorting(table, (sentiment == "neg"), 3, topN);
}

    /**
     * DB: Themes distribution
     * @param {Table} table
     * @param {String} sentiment - TA_VIEW_SENTIMENT parameter value "all", "neg", "neu", "pos"
     * @param {String} period - value of parameter to define what time period show in the table
     * @param {String} distribution - 0 for "count" or 1 for "percents" count by default
     */

    static function createThemeDistributionTable(table: Table, sentiment, period, distribution){

        var totalRespondentsHeader: HeaderQuestion;
        if(distribution == "1"){
            table.RowHeaders.Add(getTotalCategoriesHeader());
        }
        var taCategoriesHeader: HeaderQuestion = getTAQuestionHeader("categorySentiment");
        taCategoriesHeader.ShowTotals = false;

        table.RowHeaders.Add(taCategoriesHeader);



        var headerTimeSeries: HeaderQuestion = getTimeSeries("m",-12,0);

        var headerStatistics: HeaderStatistics = new HeaderStatistics();
        headerStatistics.HideHeader = true;
        headerStatistics.Statistics.Avg = true;
        headerStatistics.HideData = true;

        var headerBase: HeaderBase= new HeaderBase();
        headerBase.HideHeader=true;

        var verticalPercentsFormula: HeaderFormula;

        if(distribution == "1"){
            headerBase.HideData = true;

            verticalPercentsFormula = new HeaderFormula();
            verticalPercentsFormula.Type = FormulaType.Expression;
            verticalPercentsFormula.Decimals = 1;
            verticalPercentsFormula.Priority = 0;
            verticalPercentsFormula.Expression = "cellv(col-1,row)/cellv(1,1)";
            verticalPercentsFormula.Percent = true;
            verticalPercentsFormula.HideHeader = true;
        }
        headerTimeSeries.SubHeaders.Add(headerBase);
        distribution == "1" ? headerTimeSeries.SubHeaders.Add( verticalPercentsFormula) : null;
        headerTimeSeries.SubHeaders.Add(headerStatistics);


        table.ColumnHeaders.Add(headerTimeSeries);



        var formatter : ConditionalFormatting = table.ConditionalFormatting;


    formatter.AddArea(setupConditionalFormatting(
        [
            {
                expression: 'cellv(col+1, row)<(-1)',
                style: 'negative'
            },

            {
                expression: '(cellv(col+1, row)>=(-1)) AND (cellv(col+1, row)<=1)',
                style: 'neutral'
            },
            {
                expression: 'cellv(col+1, row)>1',
                style: 'positive'
            }
        ],
        "NegNeuPos",
          {
            axis: Area.Columns,
            direction: Area.Left,
            indexes: "1-1000"
        }
    ));




        table.ConditionalFormatting = formatter;

    }


    /**
     * DA: Tiles
     * @param {Table} table
     * @param {String} sentiment - "total", "neg","neu","pos"
     * @param {String} distribution - 0 for "count" or 1 for "percents" count by default
     */
    static function createDetailedAnalysisTiles(table: Table, sentiment: String, distribution){
        var taCategoryHeader: HeaderQuestion;
        var columnHeader;
        if(TALibrary.currentQuestion.currentTheme == -1){
            taCategoryHeader = getTAQuestionHeader("overallSentiment");
        }else{
            taCategoryHeader = getTAQuestionHeader("categorySentiment");
            taCategoryHeader.AnswerMask  = getCurrentCategoryMask();
        }

        taCategoryHeader.IsCollapsed = true;
        columnHeader = getCategoriesHeader(sentiment.toLowerCase(), false, distribution);
        table.RowHeaders.Add(taCategoryHeader);
        table.ColumnHeaders.AddRange(columnHeader);
    }

    /**
     * DA: Detailed Analysis table
     * @param {Table} table,
     * @param {String} selectedQId
     * @param {String} distribution
     */
    static function createDetailedAnalysisTable(table: Table, selectedQId, distribution){

        var taCategoriesHeader: HeaderQuestion;
        var totalRespondentsHeader: HeaderQuestion;
        var commentsCountFormula: HeaderFormula;
        var rowHeadersParent;
        log.LogDebug(selectedQId);

        if(selectedQId && selectedQId != "0"){
            var viewByHeader: HeaderQuestion =  new HeaderQuestion(TALibrary.currentQuestion.project.CreateQuestionnaireElement(selectedQId));
            viewByHeader.ShowTotals = false;
            rowHeadersParent = viewByHeader.SubHeaders;
        }else{
            rowHeadersParent = table.RowHeaders;
        }

        if(distribution == "1"){
            var overallSentimentHeader: HeaderQuestion = getTAQuestionHeader("overallSentiment");
            overallSentimentHeader.HideData = true;
            rowHeadersParent.Add(overallSentimentHeader);
        }

        taCategoriesHeader = getTAQuestionHeader("categorySentiment");
        taCategoriesHeader.ShowTotals = false;

        if(TALibrary.currentQuestion.currentTheme>-1){
            taCategoriesHeader.AnswerMask = getCurrentCategoryTreeMask();
        }


        rowHeadersParent.Add(taCategoriesHeader);

        if(selectedQId && selectedQId != "0"){
            table.RowHeaders.Add(viewByHeader)
        }


        var headerBase: HeaderBase= new HeaderBase();
        headerBase.HideHeader=true;
        headerBase.HideData = true;

        commentsCountFormula = new HeaderFormula();
        commentsCountFormula.Type = FormulaType.Expression;
        commentsCountFormula.Decimals = 0;
        commentsCountFormula.Priority = 0;
        commentsCountFormula.Expression = distribution == "1" ? "IF((cellv(1,1)>0),(cellv(col-1,row)/cellv(1,1)),0)": "cellv(col-1,row)";
        commentsCountFormula.Percent = (distribution == "1");
        commentsCountFormula.Title = new Label(9, "Comments");
        commentsCountFormula.HideHeader = true;

        var headerStatistics: HeaderStatistics = new HeaderStatistics();
        headerStatistics.Statistics.Avg = true;


        table.ColumnHeaders.Add(headerBase);
        table.ColumnHeaders.Add(commentsCountFormula);
        table.ColumnHeaders.Add(headerStatistics);
        table.ColumnHeaders.AddRange(getCategoriesHeader("pos",false,distribution));
        table.ColumnHeaders.AddRange(getCategoriesHeader("neu",false,distribution));
        table.ColumnHeaders.AddRange(getCategoriesHeader("neg",false,distribution));


        var formatter : ConditionalFormatting = table.ConditionalFormatting;

        formatter.AddArea(setupConditionalFormatting(
            [
                {
                    expression: 'cellv(col,row)<(-1)',
                    style: 'negative'
                },

                {
                    expression: '(cellv(col, row)>=(-1)) AND (cellv(col, row)<=1)',
                    style: 'neutral'
                },
                {
                    expression: 'cellv(col, row)>1',
                    style: 'positive'
                }
            ],
            "NegNeuPos",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "3"
            }
        ));


        formatter.AddArea(setupConditionalFormatting(
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
                indexes: "17"
            }
        ));

        formatter.AddArea(setupConditionalFormatting(
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
                indexes: "12"
            }
        ));

        formatter.AddArea(setupConditionalFormatting(
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
                indexes: "8"
            }
        ));


        table.ConditionalFormatting = formatter;

        table.ColumnHeaders.Add(getChartHeader(
            ChartComboType.Bar100,
            [
                {
                    Formula: "cellv(col-10,row)",
                    Color: (Config.Colors.NegNeuPosPalette.Positive)
                },
                {
                    Formula: "cellv(col-6,row)",
                    Color: (Config.Colors.NegNeuPosPalette.Neutral)
                },
                {
                    Formula: "cellv(col-1,row)",
                    Color: (Config.Colors.NegNeuPosPalette.Negative)
                }
            ],
            " "
        ));

        table.RowNesting = TableRowNestingType.Nesting;

    }
}