/**
 * @class TAFilters
 * @classdesc Class to create TA filters Expression
 */
class TAFilters{
    /**
     * @memberof TAFilters
     * @instance
     * @function GetSelectedCategoryFilterExpression
     * @param {Object} params - {
            context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
            folder: {TAFolder},
            categoriesParameterName: {String},
            subCategoriesParameterName: {String},
            attributesParameterName: {String}
        }
     * @returns {String}
     */
    static function GetSelectedCategoryFilterExpression(params){
        var fExpr;

        var context = params.context;
        var folder = params.folder;
    context.log.LogDebug("-------5-------");
        var selectedCategory = context.state.Parameters.GetString(params.allCategoriesParameter)
    context.log.LogDebug("-------6-------");
        fExpr = (selectedCategory && selectedCategory !=="emptyv") ?('ANY(' + folder.GetQuestionId("categories") + ',"'+selectedCategory+'")'):'NOT ISNULL('+folder.GetQuestionId("overallSentiment")+')';

        return fExpr;
    }

    /**
     * @memberof TAFilters
     * @instance
     * @function GetSentimentFilterExpression
     * @param {Object} params - {
     *      context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     *      config: {Object}
     *      sentimentParameter: {String}
     *      allCategoriesParameter: {String}
     *      folder: {TAFolder}
     * }
     * @returns {String}
     */
    static function GetSentimentFilterExpression(params){
        var fExpr = "";
        var context = params.context;
        var sentimentRanges = params.config.SentimentRange;
        var sentimentParameter = params.sentimentParameter;
        context.log.LogDebug("-------1-------");
        var sentimentParameterValue = context.state.Parameters.GetString(sentimentParameter);
    context.log.LogDebug("-------2-------");
        var sentimentRange = "";

        switch( sentimentParameterValue ){
            case "pos":
                sentimentRange ='"'+sentimentRanges.Positive.join('","')+'"';
                break;
            case "neu":
                sentimentRange ='"'+ sentimentRanges.Neutral.join('","') +'"';
                break;
            case "neg":
                sentimentRange ='"' + sentimentRanges.Negative.join('","')+'"';
                break;
        }

        if(sentimentRange.length > 0 ){
            var folder = params.folder;
            context.log.LogDebug("-------3-------");
            var selectedCategory = context.state.Parameters.GetString(params.allCategoriesParameter)
            context.log.LogDebug("-------4-------");
            var questionName = (selectedCategory && selectedCategory !== "emptyv")
                ? (folder.GetQuestionId("categorysentiment")+"_"+selectedCategory)
                : folder.GetQuestionId("overallsentiment");

            fExpr = 'IN(' + questionName + ','+sentimentRange+')'
        }

        return fExpr;
    }

    /**
     * @memberof TAFilters
     * @instance
     * @function GetDateFilterExpression
     * @param {Object} params - {
     *       context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *       folder: {TAFolder},
     *       fromParameter: {String},
     *       toParameter: {String};
     * }
     * @returns {String}
     */
    static function GetDateFilterExpression(params){
        var fExpr;

        var context = params.context;
        var folder = params.folder;
        var fromParameter = params.fromParameter;
        var toParameter = params.toParameter;

        var isFrom = context.state.Parameters.IsNull(fromParameter);
        var isTo = context.state.Parameters.IsNull(toParameter);

        var fromExpr;
        var toExpr;
        var resultArray = [];

        if(!isFrom)
        {
            fromExpr = folder.GetTimeVariableId() + ' >= PValDate("' +fromParameter+'")';
            resultArray.push(fromExpr);
        }

        if(!isTo){
            toExpr = folder.GetTimeVariableId() + ' <= PValDate("' +toParameter+'")';
            resultArray.push(toExpr);
        }

        fExpr = resultArray.join(" AND ");

        return fExpr
    }
}