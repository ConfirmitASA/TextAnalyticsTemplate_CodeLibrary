/**
 * @class Page_customer_journey
 * @classdesc Static class for Reportal Page comments components
 */
class Page_customer_journey{
    /**
     * @memberof Page_customer_journey
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "customer_journey");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_customer_journey
     * @function tblCustomerJourneyCards_Render
     * @description function to render table for Customer Journey cards
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblCustomerJourneyCards_Render(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var cardsTable = new TACustomerJourneyCardsTable({folder:folder, config:Config, context:context});
        cardsTable.GetTATableUtils().ClearTableDistributions();
    }

    /**
     * @memberof Page_customer_journey
     * @function btnCustomerJourneyCards_Render
     * @description function to render button that leads to the Correlation page after clicking on a CJ card
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnCustomerJourneyCards_Render(context){
        context.component.TargetPage = 'correlation';
    }

    /**
     * @memberof Page_customer_journey
     * @function txtCustomerJourneyCardsScript_Render
     * @description function to print Customer Journey cards script
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCustomerJourneyCardsScript_Render(context){
        var cardsInit = "<script>" +
        "const log = document.querySelector('#log');" +
        "log.innerHTML += 'code library<br>';" +
            "new Reportal.CustomerJourneyCards({" +
            "translations: translations," +
            "tableContainerId:'cj_drilldown'," +
            "drilldownId:'cj_drilldown'," +
            "cardContainerId: 'cj_cards'," +
            "CJ_options: CJ_options});" +
            "</script>";

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));

        context.component.Output.Append(JSON.print(context.pageContext.Items['options'], 'CJ_options'));
        context.component.Output.Append(cardsInit);
    }

    /**
     * @memberof Page_customer_journey
     * @function tblCustomerJourneyTrend_Render
     * @description function to render table for Customer Journey Trend Chart
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblCustomerJourneyTrend_Render(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var period = context.state.Parameters.IsNull("TA_TREND_LINE_PERIOD") ? "m" : context.state.Parameters.GetString("TA_TREND_LINE_PERIOD");
        var viewBy = context.state.Parameters.IsNull("TA_TREND_LINE_VIEW_BY") ? "avg_sentiment" : context.state.Parameters.GetString("TA_TREND_LINE_VIEW_BY");
        var customerJourneyTrendTable = new TACustomerJourneyTrendTable({folder:folder, config:Config, context:context, period: period, viewBy: viewBy});
        customerJourneyTrendTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories"]);
    }

    /**
     * @memberof Page_customer_journey
     * @function btnDetailedAnalysisDrilldown_Render
     * @description function to render button that leads to the Detailed Analysis page after clicking on a CJ card
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnDetailedAnalysisDrilldown_Render(context){
        context.component.TargetPage = 'detailed_analysis';
    }

    /**
     * @memberof Page_customer_journey
     * @function txtCustomerJourneyTrendTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCustomerJourneyTrendTitle_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Trend chart"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_customer_journey
     * @function txtComparePeriods_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtComparePeriods_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Compare"];
        context.component.Output.Append(label);

        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_PERIOD'));
    }

    /**
     * @memberof Page_customer_journey
     * @function txtViewBy_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtViewBy_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['View by'];
        context.component.Output.Append(label);

        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_TREND_LINE_VIEW_BY'));
    }

    /**
     * @memberof Page_customer_journey
     * @function txtCustomerJourneyTrendScript_Render
     * @description function to render Customer Journey Trend Chart
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCustomerJourneyTrendScript_Render(context){
        var trendLineColors = Config.Colors.TrendLinePalette;
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var palette = {
            chartColors: trendLineColors
        };

        var viewBy = context.state.Parameters.IsNull("TA_TREND_LINE_VIEW_BY") ? "avg_sentiment" : context.state.Parameters.GetString("TA_TREND_LINE_VIEW_BY");
        var showPercent = viewBy !== "avg_sentiment";
        var period = context.state.Parameters.IsNull("TA_TREND_LINE_PERIOD") ? "m" : context.state.Parameters.GetString("TA_TREND_LINE_PERIOD");
        var showByType = TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_TREND_LINE_VIEW_BY').replace(/<span.*>: /, '').replace(/<\/span>/, '');

        var chartInit = "<script>" +
            "var trendChart = new Reportal.TrendChart({" +
            "chartContainer:'trend-chart'," +
            "tableContainer:'trend-table'," +
            "drilldownButtonContainer:'trend-table'," +
            "drilldownSelectContainer:'cj_drilldown'," +
            "palette: palette," +
            "period: '" + period + "'," +
            "showPercent: " + showPercent + "," +
            "showByType: '" + showByType + "'," +
            "translations: translations});" +
            "</script>";

        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(palette,"palette"));
        context.component.Output.Append(chartInit);
    }
}
