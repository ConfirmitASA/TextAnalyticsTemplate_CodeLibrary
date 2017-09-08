/**
* @class Filters
* @classdesc Static class for Reportal Filters Scripting
*/
class Filters {
    /**
     * @memberof Filters
     * @function TASelectedCategoryFilter
     * @description function to create expression that filtrates only selected category in the hitlist
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TASelectedCategoryFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var fExpr = TAFilters.GetSelectedCategoryFilterExpression({
            context: context,
            folder: Config.GetTALibrary().GetFolderById(selectedFolder),
            allCategoriesParameter: "TA_ALL_CATEGORIES"
        });

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

        var fExpr = TAFilters.GetSentimentFilterExpression({
            context: context,
            config: Config,
            sentimentParameter: "TA_COMMENTS_SENTIMENT",
            allCategoriesParameter: "TA_ALL_CATEGORIES",
            folder: Config.GetTALibrary().GetFolderById(selectedFolder)
        });

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

        var fExpr = TAFilters.GetDateFilterExpression({
                context: context,
                folder: Config.GetTALibrary().GetFolderById(selectedFolder),
                fromParameter: "TA_DATE_FROM",
                toParameter: "TA_DATE_TO"
}       );

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
}