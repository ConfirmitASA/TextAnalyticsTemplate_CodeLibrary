/**
 * @class Page_detailed_analysis
 * @classdesc Static class for Reportal Page detailed_analysis components
 */
class Page_detailed_analysis{

    /**
     * @memberof Page_detailed_analysis
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "detailed_analysis");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_detailed_analysis
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
     * @memberof Page_detailed_analysis
     * @function tblTotalCommentsTile_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblTotalCommentsTile_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblTotalCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblTotalCommentsTile_Render(context){
        _buildTATiles({context: context, type: "all"});
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblPositiveCommentsTile_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblPositiveCommentsTile_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblPositiveCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblPositiveCommentsTile_Render(context){
        _buildTATiles({context: context, type: "pos"});
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblNeutralCommentsTile_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblNeutralCommentsTile_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblNeutralCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblNeutralCommentsTile_Render(context){
        _buildTATiles({context: context, type: "neu"});
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblNegativeCommentsTile_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblNegativeCommentsTile_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblNegativeCommentsTile_Render
     * @param {Object} context - {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblNegativeCommentsTile_Render(context){
        _buildTATiles({context: context, type: "neg"});
    }

    /**
     * @memberof Page_detailed_analysis
     * @function tblDetailedAnalysis_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblDetailedAnalysis_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
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

        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        var detailedAnalysisTable = new TADetailedAnalysisTable({
            context: context,
            folder: folder,
            category: selectedCategory,
            question: selectedQuestion,
            distribution: distribution,
            questionType: (selectedQuestionType === QuestionType.Multi),
            toggleChart: toggleChart
        });

        detailedAnalysisTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-fixed-header", "reportal-hierarchy-table", "reportal-barchart", "detailed-analysis-table"]);
        detailedAnalysisTable.GetTATableUtils().SetupHideEmptyRows((hideEmptyRows.length >0));
        detailedAnalysisTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "comments");
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtDetailedAnalysisScript_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtDetailedAnalysisScript_Hide(context){
        return false
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtDetailedAnalysisScript_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtDetailedAnalysisScript_Render(context){
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var hierarchy = selectedCategory === 'emptyv'? folder.GetHierarchy().GetHierarchyArray() : [folder.GetHierarchy().GetObjectById(selectedCategory)];

        var headers = TATableData.GetTableRowHeaders({context: context, tableName: "tblDetailedAnalysis"});

        if( headers.length > 0){
            var blocks = TATableData.GetBlocks({context: context, tableName: "tblDetailedAnalysis"});

            var upgradeText = "<script type=\"text/javascript\">"+
                    "var upgradedTable = new Reportal.AggregatedTable("+
                        "{"+
                            "table: document.querySelector('table.reportal-hierarchy-table'),"+
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
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtViewBy_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtViewBy_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtViewBy_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtViewBy_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['View by:'];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getViewByParameterValue(context, currentDictionary));
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtCategory_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCategory_Hide(context){
        return false;
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtCategory_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCategory_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Category'];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getCategoryParameterValue(context, currentDictionary, 'TA_TOP_CATEGORIES_SINGLE'));
    }

    /**
     * @memberof Page_detailed_analysis
     * @function lstSubCategory_Hide
     * @description function to hide the Sub Category selector
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstSubCategory_Hide(context){
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_detailed_analysis
     * @function lstAttribute_Hide
     * @description function to hide the Attribute selector
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstAttribute_Hide(context){
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }


    /**
     * @memberof Page_detailed_analysis
     * @function txtSubCategory_Hide
     * @description function to hide the the sub category list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSubCategory_Hide(context){
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSubCategory_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Sub category'];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getCategoryParameterValue(context, currentDictionary, 'TA_SUB_CATEGORIES_SINGLE'));
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtAttribute_Hide
     * @description function to hide the the attributes list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtAttribute_Hide(context){
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtAttribute_Render
     * @description function to render the attributes selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtAttribute_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Attribute'];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getCategoryParameterValue(context, currentDictionary, 'TA_ATTRIBUTES_SINGLE'));
    }


    /**
     * @memberof Page_detailed_analysis
     * @function txtTotalComments_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtTotalComments_Hide(context){
        return false
    }

    /**
     * @memberof Page_detailed_analysis
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
     * @memberof Page_detailed_analysis
     * @function txtPositive_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtPositive_Hide(context){
        return false
    }

    /**
     * @memberof Page_detailed_analysis
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
     * @memberof Page_detailed_analysis
     * @function txtNeutral_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtNeutral_Hide(context){
        return false
    }

    /**
     * @memberof Page_detailed_analysis
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
     * @memberof Page_detailed_analysis
     * @function txtNegative_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtNegative_Hide(context){
        return false
    }

    /**
     * @memberof Page_detailed_analysis
     * @function txtNegative_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNegative_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Negative'];
        context.component.Output.Append(label);
    }
}

