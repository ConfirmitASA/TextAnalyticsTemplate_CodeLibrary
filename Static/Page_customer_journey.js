/**
 * @class Page_customer_journey
 * @classdesc Static class for Reportal Page comments components
 */
class Page_customer_journey{
    /**
     * @memberof Page_customer_journey
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){
        return false;
    }

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
     * @function tblCustomerJourneyTrend_Hide
     * @description function to render table for Customer Journey Trend Chart
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblCustomerJourneyTrend_Hide(context){
        return false
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
        var themeDistributionTable = new TACustomerJourneyTrendTable({folder:folder, config:Config, context:context});
        themeDistributionTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories"]);
    }

    /**
     * @memberof Page_customer_journey
     * @function txtCustomerJourneyTrendScript_Hide
     * @description function to render Customer Journey Trend Chart
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCustomerJourneyTrendScript_Hide(context){
        return false
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

        var chartInit = "<script>" +
            "new Reportal.TrendChart({" +
            "chartContainer:'trend-chart'," +
            "tableContainer:'trend-table'," +
            "palette: palette," +
            "translations: translations});" +
            "</script>";
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(palette,"palette"));
        context.component.Output.Append(chartInit);
    }

    /**
     * @memberof Page_customer_journey
     * @function tblCustomerJourneyCards_Hide
     * @description function to hide table for Customer Journey cards
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblCustomerJourneyCards_Hide(context){
        return false
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
     * @function lstCustomerJourneyCards_Hide
     * @description function to hide list with all CJ items
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstCustomerJourneyCards_Hide(context){
        return false
    }

    /**
     * @memberof Page_customer_journey
     * @function btnCustomerJourneyCards_Hide
     * @description function to hide button that leads to the Correlation page after clicking on a CJ card
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnCustomerJourneyCards_Hide(context){
        return false
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
     * @function txtCustomerJourneyCardsScript_Hide
     * @description function to hide Customer Journey cards script
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCustomerJourneyCardsScript_Hide(context){
        return false
    }

    /**
     * @memberof Page_customer_journey
     * @function txtCustomerJourneyCardsScript_Render
     * @description function to print Customer Journey cards script
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCustomerJourneyCardsScript_Render(context){
        var cardsInit = "<script>" +
            "new Reportal.CustomerJourneyCards({" +
            "tableId:'confirmit_agg_table'," +
            "drilldownId:'cj_drilldown'," +
            "cardContainerId: 'cj_cards'," +
            "CJ_options: CJ_options});" +
            "</script>";

        context.component.Output.Append(JSON.print(context.pageContext.Items['options'], 'CJ_options'));
        context.component.Output.Append(cardsInit);
    }
}
