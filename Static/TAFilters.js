/**
* @class TAFilters
* @classdesc Static class for Reportal TAFilters Scripting
*/
class TAFilters {
    /**
     * @memberof TAFilters
     * @function TASelectedCategoryFilter
     * @description function to create expression that filtrates only selected category in the hitlist
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TASelectedCategoryFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var fExpr = TAFiltersBuilder.GetSelectedCategoryFilterExpression({
            context: context,
            folder: Config.GetTALibrary().GetFolderById(selectedFolder),
            allCategoriesParameter: "TA_ALL_CATEGORIES"
        });

        context.component.Expression = fExpr;
    }

    /**
     * @memberof TAFilters
     * @function TAHitlistSentimentFilter
     * @description function to filtrate only selected sentiment in the hitlist
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TAHitlistSentimentFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var fExpr = TAFiltersBuilder.GetSentimentFilterExpression({
            context: context,
            config: Config,
            sentimentParameter: "TA_COMMENTS_SENTIMENT",
            allCategoriesParameter: "TA_ALL_CATEGORIES",
            folder: Config.GetTALibrary().GetFolderById(selectedFolder)
        });

        context.component.Expression = fExpr;
    }

    /**
     * @memberof TAFilters
     * @function DateFilter
     * @description function to filtrate selected dates
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function DateFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var fExpr = TAFiltersBuilder.GetDateFilterExpression({
                context: context,
                folder: Config.GetTALibrary().GetFolderById(selectedFolder),
                fromParameter: "TA_DATE_FROM",
                toParameter: "TA_DATE_TO"
}       );

        context.component.Expression = fExpr;
    }

    /**
     * @memberof TAFilters
     * @function UncategorizedCommentsFilter
     * @description function to filter out uncategorized comments
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function UncategorizedCommentsFilter(context){
    var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

    var fExpr = TAFiltersBuilder.GetUncategorizedCommentsFilterExpression({
        context: context,
        folder: Config.GetTALibrary().GetFolderById(selectedFolder),
        allCategoriesParameter: "TA_ALL_CATEGORIES"
    });

    context.component.Expression = fExpr;
    }

    /**
     * @memberof TAFilters
     * @function FilterPageFilter
     * @description function to filtrate selected values on the filterpage
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function FilterPageFilter(context){
        var fExpr = "";
        fExpr = new TAFilterComponents(context).GetGlobalsFilterExpression(context);
        context.component.Expression = fExpr
    }

    /**
     * @memberof TAFilters
     * @function WordsFilter
     * @description function to filter Hitlist by words from word cloud
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function WordsFilter(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var TAQuestion = folder.GetQuestionId();
        var includeWordsExpr = [];
        var excludedWordsExpr = [];
        var expressionParts = [];

        if(!context.state.Parameters.IsNull('TA_INCLUDE_WORDS')) {
            var wordCloudIncWords : ParameterValueMultiSelect = context.state.Parameters["TA_INCLUDE_WORDS"];

            for(var i = 0; i < wordCloudIncWords.Count; i++) {
                var word : ParameterValueResponse = wordCloudIncWords[i];
                includeWordsExpr.push('IN(word_' + TAQuestion + ', "' + word.StringKeyValue + '")');
            }
            expressionParts.push('(' + includeWordsExpr.join(" " + (ParameterValueResponse)(context.state.Parameters("TA_INCLUDE_WORDS_FILTER_TYPE")).StringKeyValue + " ")+')');
        }

        if(!context.state.Parameters.IsNull('TA_EXCLUDE_WORDS')) {
            var wordCloudIExcWords : ParameterValueMultiSelect = context.state.Parameters["TA_EXCLUDE_WORDS"];

            for(var i = 0; i < wordCloudIExcWords.Count; i++) {
                word = wordCloudIExcWords[i];
                excludedWordsExpr.push('NOT IN(word_' + TAQuestion + ', "' + word.StringKeyValue + '")');
            }
            expressionParts.push('(' + excludedWordsExpr.join(" " + (ParameterValueResponse)(context.state.Parameters("TA_EXCLUDE_WORDS_FILTER_TYPE")).StringKeyValue + " ")  + ')');
        }
        context.component.Expression = expressionParts.join(  " AND " );
    }

    /**
     * @memberof TAFilters
     * @function CJParameter
     * @description function to filter Report by selected value for CJ_CARDS parameter (clicking by card on the CJ page)
     * @param {Object} context - {component: filter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function CJParameter(context){
        var cj_parameter = !context.state.Parameters.IsNull("TA_CJ_CARDS") &&
            context.state.Parameters.GetString("TA_CJ_CARDS") !== 'emptyv' &&
            context.state.Parameters.GetString("TA_CJ_CARDS");

        var expr = '';

        if(cj_parameter){
            var indexOfAsterisk = cj_parameter.indexOf('*');
            if(indexOfAsterisk >= 0) {
                expr = cj_parameter.substr(0, indexOfAsterisk) + ' = "' +  cj_parameter.substr(indexOfAsterisk + 1) + '"';
            } else {
                expr = 'NOT ISNULL(' + cj_parameter + ')'
            }
        }
        context.component.Expression = expr;
    }
}