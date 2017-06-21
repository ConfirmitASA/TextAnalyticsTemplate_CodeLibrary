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

        initiateParameters(context);

        var taLibrary = Config.GetTALibrary();

        initializeFilters({context: context, taLibrary: taLibrary});

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

        processSelectedCategoryParameter({
            context: context,
            folder: Config.GetTALibrary().GetFolderById(selectedFolder)
        })
    }

    static function initiateParameters(context){
        //TODO: refactor setting default parameters
        if(context.component.SubmitSource === "lstQuestions") {
            ParameterUtilities.SetDefaultParameterValues(
                {
                    context: context,
                    parameterValues: DefaultParameters.values
                }
            )
        }

        TAHelper.SetLastVisitedPage(context, "detailed_analysis");

        ParameterUtilities.SetDefaultParameterValuesForEmpty({
            context: context,
            parameterValues: DefaultParameters.values.concat(
                {
                    Id: "TA_FOLDERS",
                    Value: (Config.TAQuestions[0].TAQuestionName+Config.TAQuestions[0].TAModelNo)
                }
            )
        });
    }

    static function initializeFilters(params){
        var context = params.context;
        //TODO: clarify what to do with filter components

        if(context.component.SubmitSource === "ClearFilters"){
            FilterComponents.ClearFilters(context);
            var dateParameters = DefaultParameters.dateParameters;

            for(var i = 0; i < dateParameters.length; ++i)
                context.state.Parameters[dateParameters[i]] = null;
        }
    }

    static function processSelectedCategoryParameter(params){
        var context = params.context;
        var folder = params.folder;
        var submitSource = context.component.SubmitSource;
        var selectedCategory;
        if(submitSource === "lstCategory" || submitSource === "lstSubCategory" || submitSource === "lstAttribute"){
            selectedCategory = TAParameters.GetSelectedCategory({
                context: context,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });

            context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse(selectedCategory);
        }else {
            selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
            TAParameters.SetSelectedCategory({
                context: context,
                hierarchy: folder.GetHierarchy(),
                allCategoriesParameterValue: selectedCategory,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });
        }

    }

    /**
     * @memberof Page_detailed_analysis
     * @private
     * @function _buildTATiles
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} type - "all", "neg", "neu", "pos"
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
     * @function tblMostPositive_RendertblNeutralCommentsTile_Render
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
        context.log.LogDebug("da1");
        context.component.Caching.Enabled = false;
    context.log.LogDebug("da2");
        var selectedQuestion = context.state.Parameters.GetString("TA_VIEW_BY");
    context.log.LogDebug("da3");
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
    context.log.LogDebug("da4");
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
    context.log.LogDebug("da5");
        var project =  context.report.DataSource.GetProject(folder.GetDatasourceId());
    context.log.LogDebug("da6");
        var selectedQuestionType = false;
    context.log.LogDebug("da7 "+selectedQuestion);
        if(selectedQuestion && selectedQuestion !== "emptyv")
            selectedQuestionType =  project.GetQuestion(selectedQuestion).QuestionType;
    context.log.LogDebug("da8");
        var distribution = context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE");
    context.log.LogDebug("da9");
        var hideEmptyRows = ParameterUtilities.GetCheckedValues({context: context, parameterName: "TA_HIDE_EMPTY_ROWS"});
    context.log.LogDebug("da10");
        var toggleChartValue = ParameterUtilities.GetCheckedValues({context: context, parameterName: "TA_TOGGLE_BARCHART"});
    context.log.LogDebug("da11");
        var toggleChart = (toggleChartValue.length > 0);
    context.log.LogDebug("da12");
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
    context.log.LogDebug("da13");
        var detailedAnalysisTable = new TADetailedAnalysisTable({
            context: context,
            folder: folder,
            category: selectedCategory,
            question: selectedQuestion,
            distribution: distribution,
            questionType: (selectedQuestionType === QuestionType.Multi),
            toggleChart: toggleChart
        });
    context.log.LogDebug("da14");
        detailedAnalysisTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-fixed-header", "reportal-hierarchy-table", "reportal-barchart", "detailed-analysis-table"]);
    context.log.LogDebug("da15");
        detailedAnalysisTable.GetTATableUtils().SetupHideEmptyRows((hideEmptyRows.length >0));
    context.log.LogDebug("da16");
        detailedAnalysisTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "comments");
    context.log.LogDebug("da17");
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
        var hierarhy = selectedCategory === 'emptyv'? folder.GetHierarchy().GetHierarchyArray() : [folder.GetHierarchy().GetObjectById(selectedCategory)];
        var headers = TATableData.GetTableRowHeaders({context: context, tableName: "tblDetailedAnalysis"});
        if( headers.length > 0){
            var blocks = TATableData.GetBlocks({context: context, tableName: "tblDetailedAnalysis"});

            var upgradeText = "<script type=\"text/javascript\">"+
                    "var upgradedTable = new Reportal.AggregatedTable("+
                "{"+
                "table: document.querySelector('table.reportal-hierarchy-table'),"+
                "hierarchy: {"+
                    "hierarchy: "+JSON.stringify(hierarhy)+","+
                    "rowheaders:"+JSON.stringify(headers)+","+

                    "blocks:"+JSON.stringify(blocks)+","+
                    "column:"+ ( blocks.length > 0 ? 1 : 0 ) +","+

                    "clearLinks: false,"+
                    "search: {" +
                    "enabled: true"+
                "}"+
                "},"+
                "sorting:"+
                "{"+
                "enabled: true,"+
                "excludedColumns: [6]"+
                "},"+
                "fixedHeader: {}"+
                "}"+
                ")"+
                "</script>";

            context.component.Output.Append(upgradeText);
            context.component.Output.Append(JSON.print(hierarhy,"hierarchy"));
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
    }

    static function txtFilterTitle_Hide(context, filterNumber){
        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: Config.GetTALibrary().GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        return FilterPanel.txtFilterTitle_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: Config.GetTALibrary().GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        FilterPanel.txtFilterTitle_Render({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof Page_filters
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: Config.GetTALibrary().GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        return FilterPanel.lstFilterList_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof Page_comments
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
     * @memberof Page_comments
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
     * @memberof Page_comments
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
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSubCategory_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Sub category'];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_comments
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
     * @memberof Page_comments
     * @function txtAttribute_Render
     * @description function to render the attributes selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtAttribute_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Attribute'];
        context.component.Output.Append(label);
    }


    static function txtTotalComments_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtTotalComments_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Total comments'];
        context.component.Output.Append(label);
    }

    static function txtPositive_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtPositive_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Positive'];
        context.component.Output.Append(label);
    }

    static function txtNeutral_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNeutral_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Neutral'];
        context.component.Output.Append(label);
    }

    static function txtNegative_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtNegative_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary['Negative'];
        context.component.Output.Append(label);
    }
}

