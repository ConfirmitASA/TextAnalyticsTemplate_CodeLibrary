/**
 * @class Page_detailed_analysis
 * @classdesc Static class for Reportal Page detailed_analysis components
 */
class Page_detailed_analysis{
    private static var _folder;
    private static const _defaultParameters = [
        {
            Id: "TA_TOP_CATEGORIES_SINGLE",
            Value: "emptyv"
        },

        {
            Id: "TA_DISTRIBUTION_TOGGLE",
            Value: "0"
        },

        {
            Id: "TA_VIEW_BY",
            Value: "emptyv"
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
        if(context.component.SubmitSource == "ClearFilters"){
            new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(), Config.DS_Main).ClearFilters()
        }

        if(context.component.SubmitSource == "btnClearDateFilter"){
            context.state.Parameters["TA_DATE_FROM"] = null;
            context.state.Parameters["TA_DATE_TO"] = null;
        }

        TAHelper.SetLastVisitedPage(TAHelper.GetGlobals(context), "detailed_analysis");
        var paramUtils = new ParameterUtilities(TAHelper.GetGlobals(context));
        paramUtils.SetDefaultParameterValues(_defaultParameters);
        Config.SetTALibrary(TAHelper.GetGlobals(context));
        var taParams  = new TAParameters(TAHelper.GetGlobals(context), Config.GetTALibrary());
        _folder = Config.GetTALibrary().GetFolderById();
        taParams.ClearSubcategoriesParameters(null, "emptyv", "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
        taParams.ClearSubcategoriesParameters(null, "emptyv", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
    }

    /**
     * @memberof Page_detailed_analysis
     * @private
     * @function _buildTATiles
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} type - "all", "neg", "neu", "pos"
     */
    static private function _buildTATiles(context, type){
        var selectedCategory = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
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
        var selectedCategory = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        var selectedQuestion = context.state.Parameters.GetString("TA_VIEW_BY");
        var distribution = context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE");
        var hideEmptyRows = new ParameterUtilities(globals).GetCheckedValues("TA_HIDE_EMPTY_ROWS");
        var detailedAnalysisTable = new TADetailedAnalysisTable(globals, _folder, context.component, selectedCategory, selectedQuestion, distribution);
        //detailedAnalysisTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "reportal-fixed-header", "reportal-hierarchy-table", "reportal-barchart", "detailed-analysis-table"]);
        detailedAnalysisTable.GetTATableUtils().SetupHideEmptyRows((hideEmptyRows.length >0));
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
        var hierarhy = _folder.GetHierarchy().GetHierarchyArray();
        var taTableData = new TATableData(TAHelper.GetGlobals(context), "tblDetailedAnalysis");
        var headers = taTableData.GetTableRowHeaders();
        if( headers.length > 0){
            var blocks = taTableData.GetBlocks();

            var upgradeText = "<script type=\"text/javascript\">"+
                    "var upgradedTable = new Reportal.AggregatedTable("+
                        "{"+
                            "table: document.querySelector('table.reportal-hierarchy-table'),"+
                            "hierarchy:"+
                                "{"+
                                    "hierarchy: "+JSON.stringify(hierarhy)+","+
                                    "rowheaders:"+JSON.stringify(headers)+","+
                                    "search:{enabled:true},"+
                                    "blocks:"+JSON.stringify(blocks)+","+
                                    "column:"+ ( blocks.length > 0 ? 1 : 0 ) +""+
                                "},"+
                            "sorting:"+
                                "{"+
                                    "enabled: true,"+
                                    "excludedColumns: [6]"+
                                "},"+
                            "fixedHeader:"+
                                "{"+
                                    "enabled: true,"+
                                    "hasListeners:false"+
                                "}"+
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
        context.component.Output.Append("View by:");
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
        context.component.Output.Append("Category");
    }
}