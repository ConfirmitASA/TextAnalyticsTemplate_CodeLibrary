/**
* @class Filters
* @classdesc Static class for Reportal Filter Components
*/
class Filters {
    /**
     * @memberof Filters
     * @function TASelectedCategoryFilter
     * @description function to filtrate only selected category in the hitlist
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TASelectedCategoryFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        /*try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        }catch(e){
            selectedFolder = null;
        }*/

        var fExpr = new TAFilters(context, Config.GetTALibrary().GetFolderById(selectedFolder)).GetSelectedCategoryFilterExpression("TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE")
        context.component.Expression = fExpr;
    }

    /**
     * @memberof Filters
     * @function TAHitlistSentimentFilter
     * @description function to filtrate only selected sentiment in the hitlist
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TAHitlistSentimentFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        /*try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        }catch(e){
            selectedFolder = null;
        }*/

        var fExpr = new TAFilters(context, Config.GetTALibrary().GetFolderById(selectedFolder)).GetSentimentFilterExpression("TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE","TA_COMMENTS_SENTIMENT");
        context.component.Expression = fExpr;
    }

    /**
     * @memberof Filters
     * @function DateFilter
     * @description function to filtrate selected dates
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function DateFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        /*try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        }catch(e){
            selectedFolder = null;
        }*/
        var fExpr = new TAFilters(context, Config.GetTALibrary().GetFolderById(selectedFolder)).GetDateFilterExpression("TA_DATE_FROM", "TA_DATE_TO");
        context.component.Expression = fExpr;
    }

    /**
     * @memberof Filters
     * @function FilterPageFilter
     * @description function to filtrate selected values on the filterpage
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function FilterPageFilter(context){
        var fExpr = "";
        fExpr = new FilterComponents({context: context}).GetGlobalsFilterExpression(context);
        context.component.Expression = fExpr
    }


    /**
     * @memberof Filters
     * @function TARemoveUncategorizedCommentsFilter
     * @description function to filtrate only categorized comments
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TARemoveUncategorizedCommentsFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var fExpr = new TAFilters(context, Config.GetTALibrary().GetFolderById(selectedFolder)).GetSelectedCategoryFilterExpression();
        context.component.Expression = fExpr;
    }
}