class Page_dashboard {
    static private const PageId = "dashboard";
    static private var themeDistributionHeaders: Object = {} ;

    static function Hide(context) {
    return false
}

    static function Render(context) {
    var metaData = new MetaData(context.report, context.log);
    //var configurationManager = new ConfigurationManager();
    //var dashboardComponents = new DashboardComponents(context.Report, metaData, configurationManager, context.Log);
    //context.PageContext.Items.Add("dashboardComponents", dashboardComponents);

    var parameterUtilities = new ParameterUtilities(context.report, context.state, context.log);
    var pageTemplate = new PageTemplate(context.component, context.report, parameterUtilities, context.log);
    pageTemplate.Process(PageId);

    TALibrary.setReport(context.pageContext, context.log, context.report, context.confirmit, context.user);
    TALibrary.setCurrentQuestion(context.pageContext.Items["questionID"]);

    if(!context.state.Parameters.GetString("TA_COMPARE_PERIODS")){
        context.state.Parameters["TA_COMPARE_PERIODS"] = new ParameterValueResponse('qoq');
    }

    context.log.LogDebug(context.state.Parameters.GetString("TA_COMPARE_PERIODS")+" comp period");
    //TALibrary.currentQuestion.setCurrentTheme(context);
}

    static function txtLevel_Hide(context){
    return false;
}

    static function txtLevel_Render(context){
    var label = "View by";
    context.component.Output.Append(label);
}

    static function txtMostPositive_Hide(context){
    return false;
}

    static function txtMostPositive_Render(context){
    var label = "Top 5 most positive themes";
    context.component.Output.Append(label);
}

    static function txtMostNegative_Hide(context){
    return false;
}

    static function txtMostNegative_Render(context){
    var label = "Top 5 most negative themes";
    context.component.Output.Append(label);
}

    static function tblMostNegative_Hide(context){
    return false;
}

    static function tblMostNegative_Render(context){
    TATableUtils.createTopSentimentTable(context.component, context.state.Parameters.GetString("TA_LEVEL"), 5, "neg");
    TATableUtils.setupTableClasses(context.component, ["reportal-table","reportal-categories", "reportal-barchart"]);
}

    static function tblMostPositive_Hide(context){
    return false;
}

    static function tblMostPositive_Render(context){
    TATableUtils.createTopSentimentTable(context.component, context.state.Parameters.GetString("TA_LEVEL"), 5, "pos");
    TATableUtils.setupTableClasses(context.component, ["reportal-table","reportal-categories", "reportal-barchart"]);
}

    static function txtComparePeriods_Hide(context){
    return false;
}

    static function txtComparePeriods_Render(context){
    var label = "Compare";
    context.component.Output.Append(label);
}

    static function txtMostImproved_Hide(context){
    return false;
}

    static function txtMostImproved_Render(context){
    var label = "Top 5 most improved themes";
    context.component.Output.Append(label);
}

    static function txtMostChangedInfo_Hide(context){
    return false
}

    static function txtMostChangedInfo_Render(context){
    var label = "Changes that are not statistically significant are marked in grey";
    context.component.Output.Append(label);
}

    static function tblMostImproved_Hide(context){
    return false;
}

    static function tblMostImproved_Render(context){
    TATableUtils.createTopChangedThemesTable(context.component, context.state.Parameters.GetString("TA_LEVEL"), 5, "pos", context.state.Parameters.GetString("TA_COMPARE_PERIODS"));
    TATableUtils.setupTableClasses(context.component, ["reportal-table","reportal-categories", "reportal-barchart"]);
}

    static function txtMostDeclined_Hide(context){
    return false;
}

    static function txtMostDeclined_Render(context){
    var label = "Top 5 most declined themes";
    context.component.Output.Append(label);
}

    static function tblMostDeclined_Hide(context){
    return false;
}

    static function tblMostDeclined_Render(context){
    TATableUtils.createTopChangedThemesTable(context.component, context.state.Parameters.GetString("TA_LEVEL"), 5, "neg", context.state.Parameters.GetString("TA_COMPARE_PERIODS"));
    TATableUtils.setupTableClasses(context.component, ["reportal-table","reportal-categories", "reportal-barchart"]);
}

    static function txtThemeDistribution_Hide(context){
    return false;
}

    static function txtThemeDistribution_Render(context){
    var label = "Theme distribution";
    context.component.Output.Append(label);
}

    static function txtViewSentiment_Hide(context){
        return false;
}

    static function txtViewSentiment_Render(context){
    var label = "View";
    context.component.Output.Append(label);
}

    static function tblThemeDistribution_Hide(context){
    return false;
}

    static function tblThemeDistribution_Render(context){
    TATableUtils.createThemeDistributionTable(context.component, context.state.Parameters.GetString("TA_VIEW_SENTIMENT"));
    TATableUtils.setupTableClasses(context.component, ["reportal-table","reportal-categories", "reportal-fixed-header", "reportal-hierarchy-table"]);
    TATableUtils.setupTableDrilldown(context.component, "TA_TOP_CATEGORIES_SINGLE","detailed_analysis");
}

    static function txtThemeDistributionScript_Hide(context){
        return false;
    }

    static function txtThemeDistributionScript_Render(context){
        context.component.Output.Append(JSON.print(TALibrary.currentQuestion.hierarchy,"hierarchy"));
        var headers;
        try {
            headers = TATableData.getTableRowHeaders("tblThemeDistribution");
        }catch(e){
            context.log.LogDebug("there is no tblThemeDistribution table on the page. "+e+" headers: "+headers+" thDistrHe: "+themeDistributionHeaders);
        }
        headers ? themeDistributionHeaders = headers : null;
        context.component.Output.Append(JSON.print(themeDistributionHeaders,"rowheaders"));
        context.component.Output.Append("<script type=\"text/javascript\">Array.prototype.slice.call(document.querySelectorAll('table.reportal-fixed-header')).forEach((table)=>{"
            +"var table= new Reportal.FixedHeader(table);"+
            "});</script>");

        context.component.Output.Append("<script type=\"text/javascript\">Array.prototype.slice.call(document.querySelectorAll('table.reportal-hierarchy-table:not(.fixed)')).forEach((table)=>{"
            +"var table= new Reportal.HierarchyTable(table,hierarchy,rowheaders);"+
            "});</script>");
    }
}