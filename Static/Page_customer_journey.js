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
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
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
}
