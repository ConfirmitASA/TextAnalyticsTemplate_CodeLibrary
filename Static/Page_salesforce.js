/**
 * @class Page_salesforce
 * @classdesc Static class for Reportal Salesforce components
 */
class Page_salesforce{
    /**
     * @memberof Page_salesforce
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "salesforce");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_salesforce
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
     * @memberof Page_salesforce
     * @function tblOverallSentimentChange_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblOverallSentimentChange_Render(context) {
        var table = context.component;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var period = context.state.Parameters.IsNull("TA_SALESFORCE_PERIOD") ? "m" : context.state.Parameters.GetString("TA_SALESFORCE_PERIOD");

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
     * @memberof Page_salesforce
     * @function tblSignificantChangeAlerts_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblSignificantChangeAlerts_Render(context){
        var table = context.component;

        var sentiment = "emptyv";

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var period = context.state.Parameters.IsNull("TA_SALESFORCE_PERIOD") ? "m" : context.state.Parameters.GetString("TA_SALESFORCE_PERIOD");

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
     * @memberof Page_salesforce
     * @function tblSalesforce_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblSalesforce_Render(context) {
        var table = context.component;

        var correlationData = SalesforceUtil.GetCorrelationData(context);
        var improvementsArr = correlationData.improvementsArr;
        var strengthArr = correlationData.strengthArr;

        var OSATData = SalesforceUtil.GetOSATData(context);
        var previousSentiment = OSATData.previousSentiment;
        var currentSentiment = OSATData.currentSentiment;

        var sigChangesData = SalesforceUtil.GetSignificantChangesData(context);
        var sentimentChangesNegArr = sigChangesData.sentimentChangesNegArr;
        var sentimentChangesPosArr = sigChangesData.sentimentChangesPosArr;
        var volumeChangesNegArr = sigChangesData.volumeChangesNegArr;
        var volumeChangesPosArr = sigChangesData.volumeChangesPosArr;

        var rowsCount = Math.max(improvementsArr.length, strengthArr.length, sentimentChangesNegArr.length,
            sentimentChangesPosArr.length, volumeChangesNegArr.length, volumeChangesPosArr.length, 1);

        for (var i = 0; i < rowsCount; i++) {
            var headerContent: HeaderContent = new HeaderContent();
            headerContent.SetCellValue(0, improvementsArr[i]);
            headerContent.SetCellValue(1, strengthArr[i]);
            headerContent.SetCellValue(4, sentimentChangesNegArr[i]);
            headerContent.SetCellValue(5, sentimentChangesPosArr[i]);
            headerContent.SetCellValue(6, volumeChangesNegArr[i]);
            headerContent.SetCellValue(7, volumeChangesPosArr[i]);
            table.RowHeaders.Add(headerContent);
        }

        var firstRow : HeaderContent = table.RowHeaders[0];
        firstRow.SetCellValue(2, previousSentiment);
        firstRow.SetCellValue(3, currentSentiment);
    }

    /**
     * @memberof Page_salesforce
     * @function txtImgExport_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtImgExport_Render(context){
        var state = context.state;
        var text = context.component;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var salesforceParameters = folder.GetSalesforceParameters();
        if (!salesforceParameters) {
            return;
        }

        var selectParameter = state.Parameters.GetString("TA_SALESFORCE_QUESTION");
        selectParameter = selectParameter ? selectParameter : "Other";

        var surveyId = salesforceParameters.SurveyId;

        var correlationData = SalesforceUtil.GetCorrelationData(context);
        var improvementsArr = correlationData.improvementsArr;
        var strengthArr = correlationData.strengthArr;

        var OSATData = SalesforceUtil.GetOSATData(context);
        var previousSentiment = OSATData.previousSentiment;
        var currentSentiment = OSATData.currentSentiment;

        var sigChangesData = SalesforceUtil.GetSignificantChangesData(context);
        var sentimentChangesNegArr = sigChangesData.sentimentChangesNegArr;
        var sentimentChangesPosArr = sigChangesData.sentimentChangesPosArr;
        var volumeChangesNegArr = sigChangesData.volumeChangesNegArr;
        var volumeChangesPosArr = sigChangesData.volumeChangesPosArr;

        previousSentiment = isNaN(previousSentiment) ? "" : previousSentiment;
        currentSentiment = isNaN(currentSentiment) ? "" : currentSentiment;

        var TAQuestionName = folder.GetQuestionId() + folder.GetModelNumber();

        if (surveyId) {
            text.Output.Append("<div style=\"word-break: break-all;\">http://survey.euro.confirmit.com/wix/" + surveyId + ".aspx?"
                + "TAQuestionName=" + TAQuestionName
                + "&improvements=" + improvementsArr.join("|")
                + "&strength=" + strengthArr.join("|")
                + "&sentimentChangesNeg=" + sentimentChangesNegArr.join("|")
                + "&sentimentChangesPos=" + sentimentChangesPosArr.join("|")
                + "&volumeChangesNeg=" + volumeChangesNegArr.join("|")
                + "&volumeChangesPos=" + volumeChangesPosArr.join("|")
                + "&prevSentiment=" + previousSentiment
                + "&currSentiment=" + currentSentiment
                + "&selectParameter=" + selectParameter
                + "</div>");
            text.Output.Append("<img src='http://survey.euro.confirmit.com/wix/" + surveyId + ".aspx?"
                + "TAQuestionName=" + TAQuestionName
                + "&improvements=" + improvementsArr.join("|")
                + "&strength=" + strengthArr.join("|")
                + "&sentimentChangesNeg=" + sentimentChangesNegArr.join("|")
                + "&sentimentChangesPos=" + sentimentChangesPosArr.join("|")
                + "&volumeChangesNeg=" + volumeChangesNegArr.join("|")
                + "&volumeChangesPos=" + volumeChangesPosArr.join("|")
                + "&prevSentiment=" + previousSentiment
                + "&currSentiment=" + currentSentiment
                + "&selectParameter=" + selectParameter
                + "' />");
        }
    }
}