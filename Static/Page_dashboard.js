/**
 * @class Page_dashboard
 * @classdesc Static class for Reportal Page dashboard components
 */
class Page_dashboard{
    private static var _folder;
    private static const _defaultParameters = [
    {
        Id: "TA_LEVEL",
        Value: "0"
    },

    {
        Id: "TA_COMPARE_PERIODS",
        Value: "qoq"
    },

    {
        Id: "TA_VIEW_SENTIMENT",
        Value: "emptyv"
    }
];

    /**
     * @memberof Page_dashboard
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
    Config.SetTALibrary(TAHelper.GetGlobals(context));
    if(context.component.SubmitSource == "ClearFilters"){
        new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(),Config.DS_Main).ClearFilters()
    }
    if(context.component.SubmitSource == "btnClearDateFilter"){
        context.state.Parameters["TA_DATE_FROM"] = null;
        context.state.Parameters["TA_DATE_TO"] = null;
    }
    if(context.component.SubmitSource == "lstQuestions") {
        context.state.Parameters["TA_ATTRIBUTES_SINGLE"] = null;
        context.state.Parameters["TA_LEVEL"] = null;
        context.state.Parameters["TA_SUB_CATEGORIES_SINGLE"] = null;
        context.state.Parameters["TA_TOP_CATEGORIES_SINGLE"] = null;
        context.state.Parameters["TA_VIEW_BY"] = null;
    }

    TAHelper.SetLastVisitedPage(TAHelper.GetGlobals(context), "dashboard");
    var paramUtils = new ParameterUtilities(TAHelper.GetGlobals(context));
    paramUtils.SetDefaultParameterValues(_defaultParameters);
    var taParams  = new TAParameters(TAHelper.GetGlobals(context), Config.GetTALibrary());
    var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
    /*try {
        selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
    }catch(e){
        selectedFolder = null;
    }*/
    _folder = Config.GetTALibrary().GetFolderById(selectedFolder);
    taParams.ClearSubcategoriesParameters(selectedFolder, "emptyv", "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
    taParams.ClearSubcategoriesParameters(selectedFolder, "emptyv", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
}

    /**
     * @memberof Page_dashboard
     * @private
     * @function _renderTblMostSentiment
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} sentiment - "neg" or "pos"
     */
    private static function _renderTblMostSentiment(context, sentiment){
    var level = context.state.Parameters.IsNull("TA_LEVEL") ? 0 : context.state.Parameters.GetString("TA_LEVEL");
    var globals = TAHelper.GetGlobals(context);
    var table = context.component;
    var topSentimentTable = new TATopSentimentTable(globals, _folder, table, sentiment, level);
    topSentimentTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-barchart", "reportal-barchart-header"]);
    topSentimentTable.GetTATableUtils().ClearTableDistributions();
}

    /**
     * @memberof Page_dashboard
     * @private
     * @function _renderTblMostChanged
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} sentiment - "neg" or "pos"
     */
    private static function _renderTblMostChanged(context, sentiment){
    var level = context.state.Parameters.IsNull("TA_LEVEL") ? 0 : context.state.Parameters.GetString("TA_LEVEL");
    var globals = TAHelper.GetGlobals(context);
    var table = context.component;
    var period = context.state.Parameters.IsNull("TA_COMPARE_PERIODS") ? "qoq" : context.state.Parameters.GetString("TA_COMPARE_PERIODS");

    var topChangedTable = new TATopChangedTable(globals, _folder, table, sentiment, level, period);
    topChangedTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-barchart", "reportal-barchart-header"]);
    topChangedTable.GetTATableUtils().ClearTableDistributions();
}

    /**
     * @memberof Page_dashboard
     * @function tblMostPositive_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblMostPositive_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function tblMostPositive_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostPositive_Render(context){
    _renderTblMostSentiment(context, true);
}

    /**
     * @memberof Page_dashboard
     * @function tblMostNegative_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblMostNegative_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function tblMostNegative_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostNegative_Render(context){
    _renderTblMostSentiment(context, false);
}

    /**
     * @memberof Page_dashboard
     * @function tblMostImproved_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblMostImproved_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function tblMostImproved_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostImproved_Render(context){
    _renderTblMostChanged(context, true);
}

    /**
     * @memberof Page_dashboard
     * @function tblMostDeclined_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblMostDeclined_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function tblMostDeclined_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostDeclined_Render(context){
    _renderTblMostChanged(context, false);
}

    /**
     * @memberof Page_dashboard
     * @function tblThemeDistribution_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblThemeDistribution_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function tblThemeDistribution_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblThemeDistribution_Render(context){
    var globals = TAHelper.GetGlobals(context);
    var table = context.component;
    var sentiment = context.state.Parameters.IsNull("TA_VIEW_SENTIMENT") ? "emptyv" : context.state.Parameters.GetString("TA_VIEW_SENTIMENT");

    var themeDistributionTable = new TAThemeDistributionTable(globals, _folder, table, sentiment,Config);
    themeDistributionTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "striped-columns", "reportal-hierarchy-table"]);
    themeDistributionTable.GetTATableUtils().SetupDrilldown("TA_TOP_CATEGORIES_SINGLE", "detailed_analysis");
    themeDistributionTable.GetTATableUtils().ClearTableDistributions();
    themeDistributionTable.GetTATableUtils().SetupDataSupressing(1);
}

    /**
     * @memberof Page_dashboard
     * @function txtLevel_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtLevel_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtLevel_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtLevel_Render(context){
    var label = "View by";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtMostPositive_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtMostPositive_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtMostPositive_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMostPositive_Render(context){
    var label = "Top 5 most positive themes";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtMostNegative_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtMostNegative_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtMostNegative_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMostNegative_Render(context){
    var label = "Top 5 most negative themes";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtComparePeriods_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtComparePeriods_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtComparePeriods_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtComparePeriods_Render(context){
    var label = "Compare";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtMostImproved_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtMostImproved_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtMostImproved_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMostImproved_Render(context){
    var label = "Top 5 most improved themes";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtMostChangedInfo_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtMostChangedInfo_Hide(context){
    return false
}

    /**
     * @memberof Page_dashboard
     * @function txtMostChangedInfo_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMostChangedInfo_Render(context){
    var label = "Changes that are not statistically significant are marked in grey";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtMostDeclined_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtMostDeclined_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtMostDeclined_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMostDeclined_Render(context){
    var label = "Top 5 most declined themes";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistribution_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtThemeDistribution_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistribution_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtThemeDistribution_Render(context){
    var label = "Theme distribution";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtViewSentiment_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtViewSentiment_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtViewSentiment_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtViewSentiment_Render(context){
    var label = "View";
    context.component.Output.Append(label);
}

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistributionScript_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtThemeDistributionScript_Hide(context){
    return false;
}

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistributionScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtThemeDistributionScript_Render(context){
    var headers;
    var hierarhy = _folder.GetHierarchy().GetHierarchyArray()

    headers = new TATableData(TAHelper.GetGlobals(context), "tblThemeDistribution").GetTableRowHeaders();
    var upgradeText = "<script type=\"text/javascript\">"+
        "var upgradedTable = new Reportal.TAhierarchy("+
        "{"+
            "source: document.querySelector('table.reportal-hierarchy-table'),"+
            "blocks: [],"+
            "search:{},"+
            "floatingHeader:{},"+
            "hierarchy:"+JSON.stringify(hierarhy)+","+
            "rowheaders:"+JSON.stringify(headers)+","+
            "clearLinks:true"+
        "}"+
        ")"+
        "</script>";

    context.component.Output.Append(upgradeText);
    context.component.Output.Append(JSON.print(hierarhy,"hierarchy"));
}
}
