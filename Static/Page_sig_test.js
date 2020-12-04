/**
 * @class Page_sig_test
 * @classdesc Static class for Reportal Page sig_test components
 */
class Page_sig_test{

    /**
     * @memberof Page_sig_test
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "sig_test");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_sig_test
     * @private
     * @function _buildTATiles
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          type: "all"|"neg"|"neu"|"pos"
     *      }
     */
    static private function _buildTATiles(params){
        var context = params.context;
        var type = params.type;
        var selectedCategory =  context.state.Parameters.GetString('TA_ALL_CATEGORIES');
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var distribution = context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE");
        new TATiles({
            context: context,
            folder: Config.GetTALibrary().GetFolderById(selectedFolder),
            type: type,
            category: selectedCategory,
            distribution: distribution
        });
    }

    /**
     * @memberof Page_sig_test
     * @function txtTotalComments_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtTotalComments_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Total comments'];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_sig_test
     * @function tblTotalCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblTotalCommentsTile_Render(context){
        _buildTATiles({context: context, type: "all"});
    }

    /**
     * @memberof Page_sig_test
     * @function txtPositive_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtPositive_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Positive'];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_sig_test
     * @function tblPositiveCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblPositiveCommentsTile_Render(context){
        _buildTATiles({context: context, type: "pos"});
    }

    /**
     * @memberof Page_sig_test
     * @function txtNeutral_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNeutral_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Neutral'];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_sig_test
     * @function tblNeutralCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblNeutralCommentsTile_Render(context){
        _buildTATiles({context: context, type: "neu"});
    }

    /**
     * @memberof Page_sig_test
     * @function txtNegative_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNegative_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Negative'];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_sig_test
     * @function tblNegativeCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblNegativeCommentsTile_Render(context){
        _buildTATiles({context: context, type: "neg"});
    }

    /**
     * @memberof Page_sig_test
     * @function txtSigSubCategory_Hide
     * @description function to hide the the sub category list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSigSubCategory_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE_SIG");
        return (!parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0;
    }

    /**
     * @memberof Page_sig_test
     * @function txtSigAttribute_Hide
     * @description function to hide the the attribute list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSigAttribute_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE_SIG");
        return (!parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0;
    }

    /**
     * @memberof Page_sig_test
     * @function lstSigSubCategory_Hide
     * @description function to hide the the sub category list
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstSigSubCategory_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE_SIG");
        return (!parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0;
    }

    /**
     * @memberof Page_sig_test
     * @function lstSigAttribute_Hide
     * @description function to hide the the attribute list
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstSigAttribute_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE_SIG");
        return (!parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0;
    }

    /**
     * @memberof Page_sig_test
     * @function txtRespondentNumberWidgetScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtRespondentNumberWidgetScript_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var respondentNumberWidgetInit = "<script>" +
            "var respondentNumberWidget = new Reportal.RespondentNumberWidget({" +
            "totalCommentsTableContainerId: 'sig-total-comments-tile'," +
            "positiveCommentsTableContainerId: 'sig-positive-comments-tile'," +
            "neutralCommentsTableContainerId: 'sig-neutral-comments-tile'," +
            "negativeCommentsTableContainerId: 'sig-negative-comments-tile'," +
            "cardContainerId: 'sig-respondent-number-widget'," +
            "translations: translations});" +
            "</script>";

        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(respondentNumberWidgetInit);
    }

    /**
     * @memberof Page_sig_test
     * @function txtViewBy_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtViewBy_Render(context) {
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['View by:'];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getViewByParameterValue(context, currentDictionary));
    }

    /**
     * @memberof Page_sig_test
     * @function txtSigLevel_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSigLevel_Render(context) {
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Confidence Level'];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getViewByParameterValue(context, currentDictionary));
    }

    /**
     * @memberof Page_sig_test
     * @function tblDetailedAnalysis_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblDetailedAnalysis_Render(context){
        context.component.Caching.Enabled = false;
        var selectedQuestion = context.state.Parameters.GetString("TA_VIEW_BY");

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var project =  context.report.DataSource.GetProject(folder.GetDatasourceId());

        var selectedQuestionType = false;

        if(selectedQuestion && selectedQuestion !== "emptyv")
            selectedQuestionType =  project.GetQuestion(selectedQuestion).QuestionType;

        var distribution = context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE");
        var hideEmptyRows = TAParameterUtilities.GetCheckedValues({context: context, parameterName: "TA_HIDE_EMPTY_ROWS"});
        var toggleChartValue = TAParameterUtilities.GetCheckedValues({context: context, parameterName: "TA_TOGGLE_BARCHART"});
        var toggleChart = (toggleChartValue.length > 0);

        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES_SIG');

        var detailedAnalysisTable = new TADetailedAnalysisTable({
            context: context,
            folder: folder,
            category: selectedCategory,
            question: selectedQuestion,
            distribution: distribution,
            questionType: (selectedQuestionType === QuestionType.Multi),
            toggleChart: toggleChart
        }, true);

        detailedAnalysisTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-fixed-header", "reportal-hierarchy-table", "striped-columns", "reportal-barchart", "detailed-analysis-table-with-sig-test"]);
        detailedAnalysisTable.GetTATableUtils().SetupHideEmptyRows((hideEmptyRows.length >0));
        //detailedAnalysisTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES_SIG", "word_cloud");
    }

    /**
     * @memberof Page_sig_test
     * @function txtDetailedAnalysisScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtDetailedAnalysisScript_Render(context){
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES_SIG');

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var hierarchy = selectedCategory === 'emptyv'? folder.GetHierarchy().GetHierarchyArray() : [folder.GetHierarchy().GetObjectById(selectedCategory)];

        var headers = TATableData.GetTableRowHeaders({context: context, tableName: "tblDetailedAnalysisSig"});

        if( headers.length > 0){
            var blocks = TATableData.GetBlocks({context: context, tableName: "tblDetailedAnalysisSig"}, true);

            var upgradeText = "<script type=\"text/javascript\">"+
                "var upgradedTable = new Reportal.AggregatedTable("+
                "{"+
                "table: document.querySelector('#sig-sentiment-table table.reportal-hierarchy-table'),"+
                "hierarchy: {"+
                "hierarchy: "+JSON.stringify(hierarchy)+","+
                "rowheaders:"+JSON.stringify(headers)+","+

                "blocks:"+JSON.stringify(blocks)+","+
                "column:"+ ( blocks.length > 0 ? 1 : 0 ) +","+

                "clearLinks: false,"+
                "search: {" +
                "enabled: true"+
                "}"+
                "},"+
                "sorting: {"+
                "enabled: true,"+
                "excluded: [6]"+
                "},"+
                "fixedHeader: {}"+
                "}"+
                ")"+
                "</script>";

            context.component.Output.Append(upgradeText);
            context.component.Output.Append(JSON.print(hierarchy,"hierarchy"));
            context.component.Output.Append(JSON.print(headers,"rowheaders"));
            context.component.Output.Append(JSON.print(blocks,"blocks"));
        }
        var moveToggleText = "<script>"+
            "var toggle = document.querySelector('.toggle.percentCountToggle').parentNode.parentNode;"+
            "var row = document.querySelector('.r2i-row');"+
            "row.appendChild(toggle);" +
            "row.querySelector('.r2-title-view__name').style.marginRight = '13.1rem'" +
            "</script>";
        context.component.Output.Append(moveToggleText);
    }

    /**
     * @memberof Page_sig_test
     * @function txtInfoIconScript_Render
     * @description function to render Page Info text
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtInfoIconScript_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var infoText = currentDictionary['sentiment info text'];

        var infoInit = "<script>" +
            "var title = document.querySelector('.r2-title-view__name').parentNode.parentNode.parentNode;" +
            "title.style.position = 'relative';" +
            "var detailedAnalysisIcon = new Reportal.InfoIcon({" +
            "container: title," +
            "infoText: '" + infoText + "'});" +
            "detailedAnalysisIcon.infoIcon.style.right = '8px';" +
            "detailedAnalysisIcon.infoText.style.top = '-16px';" +
            "detailedAnalysisIcon.infoText.style.right = '32px';" +
            "</script>";

        context.component.Output.Append(infoInit);
    }
}