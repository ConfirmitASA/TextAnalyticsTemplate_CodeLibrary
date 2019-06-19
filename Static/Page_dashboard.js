/**
 * @class Page_dashboard
 * @classdesc Static class for Reportal Page dashboard components
 */
class Page_dashboard{

    /**
     * @memberof Page_dashboard
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "dashboard");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
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
        topSentimentTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES","detailed_analysis, comments_alert");
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
        topChangedTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES","detailed_analysis, comments_alert");
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
     * @function txtViewPeriod_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtViewPeriod_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Compare"];
        context.component.Output.Append(label);

        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_PERIOD'));
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
     * @function txtSigTest_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSigTest_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Significance test"];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_SIG_TESTING_SINGLE'));
    }

    /**
     * @memberof Page_dashboard
     * @function tblThemeDistribution_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblThemeDistribution_Render(context){
        var table = context.component;

        var sentiment = context.state.Parameters.IsNull("TA_COMMENTS_SENTIMENT") ? "emptyv" : context.state.Parameters.GetString("TA_COMMENTS_SENTIMENT");

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

        themeDistributionTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-hierarchy-table"]);
        themeDistributionTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "detailed_analysis, comments_alert");
        themeDistributionTable.GetTATableUtils().ClearTableDistributions();
        themeDistributionTable.GetTATableUtils().SetupDataSupressing(1);
    }

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistributionScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtThemeDistributionScript_Render(context){
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var categoriesText = "<script>" +
            "var z = [].slice.call(document.querySelectorAll('.reportal-categories>thead>tr>td[class*=\"_cc\"]'));" +
            "z.forEach(function(item){item.innerHTML = '"+currentDictionary['Categories']+"';});" +
            "</script>";

        var headers;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var hierarchy = selectedCategory === 'emptyv'? folder.GetHierarchy().GetHierarchyArray() : [folder.GetHierarchy().GetObjectById(selectedCategory)];

        headers = TATableData.GetTableRowHeaders({
            context: context,
            tableName: "tblThemeDistribution"
        });

        var toggleStatus = context.state.Parameters.GetString("TA_SIG_TESTING_SINGLE");

        var significantTestScore = folder.GetSignificantTestScore();

        var upgradeText = "<script type=\"text/javascript\">"+
            "var upgradedTable = new Reportal.AggregatedTable("+
            "{"+
            "table: document.querySelector('table.reportal-hierarchy-table'),"+
            "hierarchy: {"+
            "blocks: [],"+
            "hierarchy:"+JSON.stringify(hierarchy)+","+
            "rowheaders:"+JSON.stringify(headers)+","+
            "search:{enabled: true},"+
            "clearLinks:false"+
            "},"+
            "search:{},"+
            "fixedHeader:{},"+
            "}"+
            ");"+
            "var significantTesting = new Reportal.ThemeDistributionTable("+
            "{"+
            "tableContainerId:'theme-distribution',"+
            "toggleStatus:'" + toggleStatus + "'," +
            "significantTestScore:'" + significantTestScore + "'" +
            "}"+
            ");"+
            "</script>";

        var sentimentConfig = [
            {
                sentiment: "positive",
                range: {min: (Config.SentimentRange.Positive[0]-6), max: (Config.SentimentRange.Positive[Config.SentimentRange.Positive.length - 1]-6)}
            },
            {
                sentiment: "neutral",
                range: {min: (Config.SentimentRange.Neutral[0]-6), max: (Config.SentimentRange.Neutral[Config.SentimentRange.Neutral.length - 1]-6)}
            },
            {
                sentiment: "negative",
                range: {min: (Config.SentimentRange.Negative[0]-6), max: (Config.SentimentRange.Negative[Config.SentimentRange.Negative.length - 1]-6)}
            }
        ];

        context.component.Output.Append(JSON.print(sentimentConfig,"sentimentConfig"));
        context.component.Output.Append(categoriesText);
        context.component.Output.Append(upgradeText);
    }

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistributionExplanation_Render
     * @description function to render explanation of Theme Distribution Table
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtThemeDistributionExplanation_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var text = currentDictionary["Theme Distribution Table Explanation"];
        context.component.Output.Append(text);
    }

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistributionChart_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtThemeDistributionChart_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Theme distribution chart"];

        var isParameterEmpty = context.state.Parameters.IsNull("TA_ALL_CATEGORIES") ||
            context.state.Parameters.GetString("TA_ALL_CATEGORIES") === 'emptyv';

        if(!isParameterEmpty) {
            var folderId = TALibrary.GetTAFoldersParameterValue(context);
            var parameterValueID = context.state.Parameters["TA_ALL_CATEGORIES"].StringKeyValue || context.state.Parameters.GetString("TA_ALL_CATEGORIES");

            var parameterValueLabel = Config.GetTALibrary().GetFolderById(folderId).GetHierarchy().GetObjectById(parameterValueID).name;
            label += ": " + parameterValueLabel;
        }

        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_dashboard
     * @function btnThemeDistributionChartDrilldown_Render
     * @description function to render button that leads to the Impact Analysis or Sentiment page
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnThemeDistributionChartDrilldown_Render(context){
        if(context.state.ReportExecutionMode != ReportExecutionMode.PdfExport) {
            context.component.TargetPage = 'correlation';

            var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
            if (selectedFolder && Config.GetTALibrary()) {
                var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
                if (folder) {
                    var correlationVariables = folder.GetCorrelationVariables();
                    if (!correlationVariables || correlationVariables.length <= 0) {
                        context.component.TargetPage = 'detailed_analysis';
                    }
                }
            }
        }
    }

    /**
     * @memberof Page_dashboard
     * @function txtThemeDistributionChartScript_Render
     * @description function to render Theme Distribution Trend Chart
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtThemeDistributionChartScript_Render(context){
        var significantTestingColors = Config.Colors.SignificantTestingPalette;
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var palette = significantTestingColors;

        var period = context.state.Parameters.IsNull("TA_PERIOD") ? "m" : context.state.Parameters.GetString("TA_PERIOD");

        var categoryOptions = {
            category: TAParameterValues.getCategoryParameterValue(context, currentDictionary, "TA_TOP_CATEGORIES_SINGLE"),
            subCategory: TAParameterValues.getCategoryParameterValue(context, currentDictionary, "TA_SUB_CATEGORIES_SINGLE"),
            attribute: TAParameterValues.getCategoryParameterValue(context, currentDictionary, "TA_ATTRIBUTES_SINGLE")
        };

        var chartInit = "<script>" +
            "var themeDistributionChart = new Reportal.ThemeDistributionChart({" +
            "chartContainer:'theme-distribution-chart'," +
            "tableContainer: document.querySelector('#theme-distribution .aggregatedTableContainer > table')," +
            "categoryOptions: categoryOptions," +
            "drilldownButtonContainer: 'drilldown-button-container'," +
            "palette: palette," +
            "period: '" + period + "'," +
            "translations: translations});" +
            "</script>";

        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(palette,"palette"));
        context.component.Output.Append(JSON.print(categoryOptions,"categoryOptions"));
        context.component.Output.Append(chartInit);
    }

    /**
     * @memberof Page_dashboard
     * @function txtSignificantChangeAlertsScript_Render
     * @description function to render Alerts for Significant Changes
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSignificantChangeAlertsScript_Render(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var textSeparator = folder.GetHierarchy().GetTextSeparator();
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var period = context.state.Parameters.IsNull("TA_PERIOD") ? "m" : context.state.Parameters.GetString("TA_PERIOD");

        var drilldownPage = "correlation";
        var correlationVariables = folder.GetCorrelationVariables();
        if(!correlationVariables || correlationVariables.length <= 0) {
            drilldownPage = "detailed_analysis";
        }

        var alertstInit = "<script>" +
            "new Reportal.SignificantChangesAlerts({" +
            "translations:translations," +
            "period:'" + period + "'," +
            "table: document.querySelector('#theme-distribution .aggregatedTableContainer > table')," +
            "separator: '" + (textSeparator ? textSeparator : "") + "',"+
            "containerId:'alerts-container'," +
            "drilldownButtonContainer:'drilldown-button-container'," +
            "drilldownParameterContainer:'alerts-drilldown-parameter'," +
            "drilldownPage: '"+ drilldownPage + "'});" +
            "</script>";

        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(alertstInit);
    }

    /**
     * @memberof Page_dashboard
     * @function txtTop5_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtTop5_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Top 5"];
        context.component.Output.Append(label);
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

        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_LEVEL'));
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
     * @function tblMostPositive_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostPositive_Render(context){
        _renderTblMostSentiment({context: context, sentiment: true});
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
     * @function tblMostNegative_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostNegative_Render(context){
        _renderTblMostSentiment({context: context, sentiment: false});
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

        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_COMPARE_PERIODS'));
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
     * @function tblMostImproved_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostImproved_Render(context){
        _renderTblMostChanged({context: context, sentiment: true});
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
     * @function tblMostDeclined_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblMostDeclined_Render(context){
        _renderTblMostChanged({context: context, sentiment: false});
    }

    /**
     * @memberof Page_dashboard
     * @function txtInfoIconScript_Render
     * @description function to render Page Info text
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtInfoIconScript_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var infoText = currentDictionary['recent changes info text'];

        var infoInit = "<script>" +
            "var title = document.querySelector('.r2-title-view__name').parentNode.parentNode.parentNode;" +
            "title.style.position = 'relative';" +
            "var dashboardIcon = new Reportal.InfoIcon({" +
            "container: title," +
            "infoText: '" + infoText + "'});" +
            "dashboardIcon.infoIcon.style.right = '8px';" +
            "dashboardIcon.infoText.style.top = '-16px';" +
            "dashboardIcon.infoText.style.right = '32px';" +
            "</script>";

        context.component.Output.Append(infoInit);
    }
}
