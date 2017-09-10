/**
 * @class Page_dashboard
 * @classdesc Static class for Reportal Page dashboard components
 */
class Page_dashboard{
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
        Config.SetTALibrary(context);

        PageRenderer.initiateParameters(context);

        PageRenderer.initiateFilters(context);

        PageRenderer.SetLastVisitedPage(context, "correlation");

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        TAParameters.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_TOP_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            attributesParameter: "TA_ATTRIBUTES_SINGLE"

        });

        TAParameters.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_ATTRIBUTES_SINGLE"
        });
    }

    /**
     * @memberof Page_dashboard
     * @private
     * @function _renderTblMostSentiment
     * @param {Object} params - {
     *              context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *              sentiment: {Boolean}
     *          }
     */
    private static function _renderTblMostSentiment(params){
        var context = params.context;
        var sentiment = params.sentiment;

        var level = context.state.Parameters.IsNull("TA_LEVEL") ? "0" : context.state.Parameters.GetString("TA_LEVEL");
        var table = context.component;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var topSentimentTable = new TATopSentimentTable({
            context: context,
            folder: folder,
            table: table,
            sentiment: sentiment,
            level: level
        });

        topSentimentTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-barchart", "reportal-barchart-header"]);
        topSentimentTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES","detailed_analysis, comments");
        topSentimentTable.GetTATableUtils().ClearTableDistributions();
    }

    /**
     * @memberof Page_dashboard
     * @private
     * @function _renderTblMostChanged
     * @param {Object} params - {
     *              context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *              sentiment: {Boolean}
     *          }
     */
    private static function _renderTblMostChanged(params){
        var context = params.context;
        var sentiment = params.sentiment;

        var level = context.state.Parameters.IsNull("TA_LEVEL") ? 0 : context.state.Parameters.GetString("TA_LEVEL");
        var table = context.component;
        var period = context.state.Parameters.IsNull("TA_COMPARE_PERIODS") ? "qoq" : context.state.Parameters.GetString("TA_COMPARE_PERIODS");

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var topChangedTable = new TATopChangedTable({
            context: context,
            folder: folder,
            table: table,
            sentiment: sentiment,
            level: level,
            period: period
        });

        topChangedTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-barchart", "reportal-barchart-header"]);
        topChangedTable.GetTATableUtils().ClearTableDistributions();
        topChangedTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES","detailed_analysis, comments");
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
        _renderTblMostSentiment({context: context, sentiment: true});
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
        _renderTblMostSentiment({context: context, sentiment: false});
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
        _renderTblMostChanged({context: context, sentiment: true});
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
        _renderTblMostChanged({context: context, sentiment: false});
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
        var table = context.component;

        var sentiment = context.state.Parameters.IsNull("TA_VIEW_SENTIMENT") ? "emptyv" : context.state.Parameters.GetString("TA_VIEW_SENTIMENT");

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var period = context.state.Parameters.IsNull("TA_PERIOD") ? "m" : context.state.Parameters.GetString("TA_PERIOD");

        var themeDistributionTable = new TAThemeDistributionTable({
            context: context,
            folder: folder,
            table: table,
            sentiment: sentiment,
            config: Config,
            period: period
        });

        themeDistributionTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "striped-columns", "reportal-hierarchy-table"]);
        themeDistributionTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "detailed_analysis, comments");
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['View by'];
        context.component.Output.Append(label);

        context.component.Output.Append(ParameterValues.getParameterValue(context.state, currentDictionary, 'TA_LEVEL'));
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Top 5 most positive themes'];
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Top 5 most negative themes"];
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Compare"];
        context.component.Output.Append(label);

        context.component.Output.Append(ParameterValues.getParameterValue(context.state, currentDictionary, 'TA_COMPARE_PERIODS'));
    }

    /**
     * @memberof Page_dashboard
     * @function txtViewPeriod_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtViewPeriod_Hide(context){
        return false;
    }

    /**
     * @memberof Page_dashboard
     * @function txtViewPeriod_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtViewPeriod_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Compare"];
        context.component.Output.Append(label);

        context.component.Output.Append(ParameterValues.getParameterValue(context.state, currentDictionary, 'TA_PERIOD'));
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Top 5 most improved themes"];
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Top 5 most declined themes"];
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Theme distribution"];
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["View"];
        context.component.Output.Append(label);

        context.component.Output.Append(ParameterValues.getParameterValue(context.state, currentDictionary, 'TA_VIEW_SENTIMENT'));
    }

    /**
     * @memberof Page_dashboard
     * @function txtPositive_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtPositive_Hide(context){
        return false;
    }

    /**
     * @memberof Page_dashboard
     * @function txtPositive_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtPositive_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Positive"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_dashboard
     * @function txtNeutral_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtNeutral_Hide(context){
        return false;
    }

    /**
     * @memberof Page_dashboard
     * @function txtNeutral_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNeutral_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Neutral"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_dashboard
     * @function txtNegative_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtNegative_Hide(context){
        return false;
    }

    /**
     * @memberof Page_dashboard
     * @function txtNegative_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNegative_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Negative"];
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
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var categoriesText = "<script>" +
            "var z = [].slice.call(document.querySelectorAll('.reportal-categories>thead>tr>td[class*=\"_cc\"]'));" +
            "z.forEach(function(item){item.innerHTML = '"+currentDictionary['Categories']+"';});" +
            "</script>";

        var headers;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var hierarhy = folder.GetHierarchy().GetHierarchyArray()

        headers = TATableData.GetTableRowHeaders({
            context: context,
            tableName: "tblThemeDistribution"
        });

        var upgradeText = "<script type=\"text/javascript\">"+
            "var upgradedTable = new Reportal.AggregatedTable("+
                "{"+
                    "table: document.querySelector('table.reportal-hierarchy-table'),"+
                    "hierarchy: {"+
                        "blocks: [],"+
                        "hierarchy:"+JSON.stringify(hierarhy)+","+
                        "rowheaders:"+JSON.stringify(headers)+","+
                        "search:{enabled: true},"+
                        "clearLinks:false"+
                    "},"+
                    "search:{},"+
                    "fixedHeader:{},"+
                "}"+
            ")"+
            "</script>";

        context.component.Output.Append(categoriesText);
        context.component.Output.Append(upgradeText);
        context.component.Output.Append(JSON.print(hierarhy,"hierarchy"));
    }
}
