/**
 * @class Page_detailed_analysis
 * @classdesc Static class for Reportal Page detailed_analysis components
 */
class Page_detailed_analysis{
    private static var _filterComponents;
    private static var _filter_panel;
    private static var _folder;
    private static var _selectedCategory;
    private static var _currentLanguage;
    private static var _curDictionary;
    private static const _defaultParameters = [
        {
            Id: "TA_ALL_CATEGORIES",
            Value: "emptyv"
        },
        {
            Id: "TA_TOP_CATEGORIES_SINGLE",
            Value: "emptyv"
        },
        {
            Id: "TA_SUB_CATEGORIES_SINGLE",
            Value: "emptyv"
        },
        {
            Id: "TA_ATTRIBUTES_SINGLE",
            Value: "emptyv"
        },
        {
            Id: "TA_DISTRIBUTION_TOGGLE",
            Value: "0"
        },

        {
            Id: "TA_VIEW_BY",
            Value: "emptyv"
        },
    {
        Id: "TA_FOLDERS",
        Value: (Config.TAQuestions[0].TAQuestionName+Config.TAQuestions[0].TAModelNo)
    }
    ];

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
        Config.SetTALibrary(TAHelper.GetGlobals(context));
        _currentLanguage = context.report.CurrentLanguage;
        _curDictionary = Translations.dictionary(_currentLanguage);
        _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(), Config.DS_Main);
        if(context.component.SubmitSource == "ClearFilters"){
            _filterComponents.ClearFilters();
            context.state.Parameters["TA_DATE_FROM"] = null;
            context.state.Parameters["TA_DATE_TO"] = null;
        }

        if(context.component.SubmitSource == "lstQuestions") {
            context.state.Parameters["TA_ALL_CATEGORIES"] = null;
            context.state.Parameters["TA_ATTRIBUTES_SINGLE"] = null;
            context.state.Parameters["TA_LEVEL"] = null;
            context.state.Parameters["TA_ALL_CATEGORIES"] = null;
            context.state.Parameters["TA_SUB_CATEGORIES_SINGLE"] = null;
            context.state.Parameters["TA_TOP_CATEGORIES_SINGLE"] = null;
            context.state.Parameters["TA_VIEW_BY"] = null;
        }

        TAHelper.SetLastVisitedPage(TAHelper.GetGlobals(context), "detailed_analysis");
        var paramUtils = new ParameterUtilities(TAHelper.GetGlobals(context));
        paramUtils.SetDefaultParameterValues(_defaultParameters);

        var taParams  = new TAParameters(TAHelper.GetGlobals(context), Config.GetTALibrary());
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        /*try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        }catch(e){
            selectedFolder = null;
        }*/
        _folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        _filter_panel = new FilterPanel(_filterComponents);
        taParams.ClearSubcategoriesParameters(selectedFolder, "emptyv", "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
        taParams.ClearSubcategoriesParameters(selectedFolder, "emptyv", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
        if(context.component.SubmitSource == "lstCategory" || context.component.SubmitSource == "lstSubCategory" || context.component.SubmitSource == "lstAttribute"){
            _selectedCategory = TAHelper.GetSelectedCategory(context.state, "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
            context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse(_selectedCategory);
        }else {
            _selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
            TAHelper.SetSelectedCategory(context.state, _folder.GetHierarchy(), _selectedCategory, "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE",context.log);
        }
    }

    /**
     * @memberof Page_detailed_analysis
     * @private
     * @function _buildTATiles
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} type - "all", "neg", "neu", "pos"
     */
    static private function _buildTATiles(context, type){
        var selectedCategory = _selectedCategory;
        var distribution = context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE");
        new TATiles(TAHelper.GetGlobals(context), _folder, context.component, type, selectedCategory, distribution)
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
        _buildTATiles(context, "all");
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
        _buildTATiles(context, "pos");
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
        _buildTATiles(context, "neu");
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
        _buildTATiles(context, "neg");
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
        var globals = TAHelper.GetGlobals(context);
        var selectedQuestion = context.state.Parameters.GetString("TA_VIEW_BY");
        //var project =  globals.report.DataSource.GetProject(Config.DS_Main);
        var project =  globals.report.DataSource.GetProject(_folder.GetDatasourceId());
        var selectedQuestionType = false;
        if(selectedQuestion && selectedQuestion != "emptyv")
            selectedQuestionType =  project.GetQuestion(selectedQuestion).QuestionType;
        var distribution = context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE");
        var hideEmptyRows = new ParameterUtilities(globals).GetCheckedValues("TA_HIDE_EMPTY_ROWS");
        var detailedAnalysisTable = new TADetailedAnalysisTable(globals, _folder, context.component, _selectedCategory, selectedQuestion, distribution, ( selectedQuestionType == QuestionType.Multi));
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
        var headers;
        var hierarhy = _selectedCategory == 'emptyv'? _folder.GetHierarchy().GetHierarchyArray() : [_folder.GetHierarchy().GetObjectById(_selectedCategory)];
        var taTableData = new TATableData(TAHelper.GetGlobals(context), "tblDetailedAnalysis");
        var headers = taTableData.GetTableRowHeaders();
        if( headers.length > 0){
            var blocks = taTableData.GetBlocks();

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
                "floatingHeader: {},"+
                "search:{}"+
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
        var label = _curDictionary['View by:'];
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
        var label = _curDictionary['Category'];
        context.component.Output.Append(label);
    }

    static function txtFilterTitle_Hide(context, filterNumber){
    return _filter_panel.txtFilterTitle_Hide(context, filterNumber);
}

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
    _filter_panel.txtFilterTitle_Render(context, filterNumber);
}

    /**
     * @memberof Page_filters
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
    return _filter_panel.lstFilterList_Hide(context, filterNumber);
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
    return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
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
    return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
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
    return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
}

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSubCategory_Render(context){
    var label = _curDictionary['Sub category'];
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
    return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
}

    /**
     * @memberof Page_comments
     * @function txtAttribute_Render
     * @description function to render the attributes selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtAttribute_Render(context){
    var label = _curDictionary['Attribute'];
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
    var label = _curDictionary['Total comments'];
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
    var label = _curDictionary['Positive'];
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
    var label = _curDictionary['Neutral'];
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
    var label = _curDictionary['Negative'];
    context.component.Output.Append(label);
}
}

