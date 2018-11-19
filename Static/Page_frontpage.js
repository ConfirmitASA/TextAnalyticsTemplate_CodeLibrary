/**
 * @class Page_frontpage
 * @classdesc Static class for Reportal FrontPage components
 */
class Page_frontpage{
    /**
     * @memberof Page_frontpage
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "frontpage");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_frontpage
     * @function txtTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtTitle_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["frontpage title"];
        context.component.Output.Append(label);

        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_FRONTPAGE_PERIOD'));
    }

    /**
     * @memberof Page_frontpage
     * @function btnJourneyWidget_Render
     * @description function to render button that leads to the Customer Journey page
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnJourneyWidget_Render(context){
        context.component.TargetPage = 'customer_journey';
    }

    /**
     * @memberof Page_frontpage
     * @function txtJourneyWidgetScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtJourneyWidgetScript_Render(context) {
        var widgetInit = "<script>" +
            "new Reportal.JourneyWidget({" +
            "tableContainerId:'cj_drilldown'," +
            "drilldownId:'cj_drilldown'," +
            "translations: translations," +
            "cardContainerId: 'cards-container-first-row'," +
            "CJ_options: CJ_options});" +
            "</script>";

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(context.pageContext.Items['options'], 'CJ_options'));
        context.component.Output.Append(widgetInit);
    }

    /**
     * @memberof Page_correlation
     * @function tblCorrelation_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: table, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblCorrelation_Render(context){
        context.component.Caching.Enabled = false;
        var selectedQuestion = context.state.Parameters.GetString("TA_CORRELATION_QUESTION");

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var selectedCategory = null; // context.state.Parameters.GetString('TA_ALL_CATEGORIES');
        var correlationTable = new TACorrelationTable({context: context, folder: folder, category: selectedCategory, question: selectedQuestion});

        correlationTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "correlation-table"]);
        correlationTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "correlation");
        correlationTable.GetTATableUtils().SetupHideEmptyRows(true);
    }

    /**
     * @memberof Page_frontpage
     * @function btnImpactAnalysisWidget_Render
     * @description function to render button that leads to the Impact Analysys page
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnImpactAnalysisWidget_Render(context){
        context.component.TargetPage = 'correlation';
    }

    /**
     * @memberof Page_frontpage
     * @function txtImpactAnalysisWidgetScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtImpactAnalysisWidgetScript_Render(context) {
        var widgetInit = "<script>" +
            "new Reportal.ImpactAnalysisWidget({" +
            "translations: translations," +
            "areaId: 'issues'," +
            "tableContainerId:'impact-analysis-table'," +
            "drilldownId:'impact-analysis-table'," +
            "cardContainerId: 'cards-container-first-row'," +
            "});" +
            "</script>";

        var widgetInit2 = "<script>" +
            "new Reportal.ImpactAnalysisWidget({" +
            "translations: translations," +
            "areaId: 'strength'," +
            "tableContainerId:'impact-analysis-table'," +
            "drilldownId:'impact-analysis-table'," +
            "cardContainerId: 'cards-container-first-row'," +
            "});" +
            "</script>";

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(widgetInit);
        context.component.Output.Append(widgetInit2);
    }

    /**
     * @memberof Page_frontpage
     * @function tblOverallSentimentChange_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblOverallSentimentChange_Render(context) {
        var table = context.component;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var period = context.state.Parameters.IsNull("TA_FRONTPAGE_PERIOD") ? "q" : context.state.Parameters.GetString("TA_FRONTPAGE_PERIOD");

        var osatTable = new TAOverallSentimentChangeTable({
            context: context,
            folder: folder,
            table: table,
            config: Config,
            period: period
        });

        osatTable.GetTATableUtils().ClearTableDistributions();
    }

    /**
     * @memberof Page_frontpage
     * @function btnOSATWidget_Render
     * @description function to render button that leads to the Detailed Analysis page
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnOSATWidget_Render(context){
        context.component.TargetPage = 'detailed_analysis';
    }

    /**
     * @memberof Page_frontpage
     * @function txtOSATWidgetScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtOSATWidgetScript_Render(context)  {
        // 0.0001 - hack to make coloring work
        var sentimentConfig = [
            {
                sentiment: "positive",
                range: {min: (Config.SentimentRange.Positive[0] - 1 - 6 + 0.0001), max: (Config.SentimentRange.Positive[Config.SentimentRange.Positive.length - 1]-6)}
            },
            {
                sentiment: "neutral",
                range: {min: (Config.SentimentRange.Neutral[0] - 6 - 0.0001), max: (Config.SentimentRange.Positive[0] - 1 - 6 + 0.0001)}
            },
            {
                sentiment: "negative",
                range: {min: (Config.SentimentRange.Negative[0]-6), max: (Config.SentimentRange.Neutral[0] - 6 - 0.0001)}
            }
        ];

        var period = context.state.Parameters.IsNull("TA_FRONTPAGE_PERIOD") ? "q" : context.state.Parameters.GetString("TA_FRONTPAGE_PERIOD");

        var widgetInit = "<script>" +
            "new Reportal.OSATWidget({" +
            "translations: translations," +
            "sentimentConfig: sentimentConfig,"+
            "tableContainerId:'osat-table'," +
            "drilldownId:'osat-table'," +
            "cardContainerId: 'cards-container-second-row'," +
            "period: period," +
            "});" +
            "</script>";

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(sentimentConfig,"sentimentConfig"));
        context.component.Output.Append(JSON.print(period,"period"));
        context.component.Output.Append(widgetInit);
    }

    /**
     * @memberof Page_frontpage
     * @function tblSignificantChangeAlerts_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblSignificantChangeAlerts_Render(context){
        var table = context.component;

        var sentiment = "emptyv";

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var period = context.state.Parameters.IsNull("TA_FRONTPAGE_PERIOD") ? "q" : context.state.Parameters.GetString("TA_FRONTPAGE_PERIOD");

        var themeDistributionTable = new TAThemeDistributionTable({
            context: context,
            folder: folder,
            table: table,
            sentiment: sentiment,
            sigTestingWidgetTable: true,
            config: Config,
            period: period
        });

        themeDistributionTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-hierarchy-table"]);
        themeDistributionTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "word_cloud");
        themeDistributionTable.GetTATableUtils().ClearTableDistributions();
        themeDistributionTable.GetTATableUtils().SetupDataSupressing(1);
    }

    /**
     * @memberof Page_frontpage
     * @function btnSignificantChangeWidget_Render
     * @description function to render button that leads to the Dashboard page
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSignificantChangeWidget_Render(context){
        context.component.TargetPage = 'dashboard';
    }

    /**
     * @memberof Page_frontpage
     * @function txtSignificantChangeWidgetScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSignificantChangeWidgetScript_Render(context)  {
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var significantTestScore = folder.GetSignificantTestScore();

        var tableInit =  "<script type=\"text/javascript\">"+
            "var significantTesting = new Reportal.ThemeDistributionTable("+
            "{"+
            "tableContainerId:'sig-change-table',"+
            "significantTestScore:'" + significantTestScore + "'" +
            "}"+
            ");"+
            "</script>";

        var widgetInit = "<script>" +
            "new Reportal.SignificantChangeWidget({" +
            "translations: translations," +
            "type:'sentiment'," +
            "tableContainerId:'sig-change-table'," +
            "drilldownId:'sig-change-table'," +
            "cardContainerId: 'cards-container-second-row'," +
            "});" +
            "</script>";

        var widgetInit2 = "<script>" +
            "new Reportal.SignificantChangeWidget({" +
            "translations: translations," +
            "type: 'count'," +
            "tableContainerId:'sig-change-table'," +
            "drilldownId:'sig-change-table'," +
            "cardContainerId: 'cards-container-second-row'," +
            "});" +
            "</script>";

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(tableInit);
        context.component.Output.Append(widgetInit);
        context.component.Output.Append(widgetInit2);
    }

    /**
     * @memberof Page_correlation
     * @function tblCorrelation_Render
     * @description function to render table with sentiment trend for 3 previous years
     * @param {Object} context - {component: table, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblPreviousYearsTrend_Render(context){
        context.component.Caching.Enabled = false;
        var table = context.component;
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var trendTable = new TAPreviousYearsTrendTable({context: context, folder: folder, table:table});

        trendTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "correlation-table"]);
    }

    /**
     * @memberof Page_frontpage
     * @function txtPreviousYearsTrendChartScript_Render
     * @description function to render 3 years Trend Chart
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtPreviousYearsTrendChartScript_Render(context){
        var trendLineColors = Config.Colors.YearsTrendLinePalette;
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var palette = {
            chartColors: trendLineColors
        };

        var chartInit = "<script>" +
            "var trendChart = new Reportal.ThreeYearsTrendChart({" +
            "chartContainer:'years-trend-chart'," +
            "tableContainer:'years-trend-table'," +
            "palette: palette," +
            "translations: translations});" +
            "</script>";

        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(palette,"palette"));
        context.component.Output.Append(chartInit);
    }
}