/**
 * @class TAFiltersBuilder
 * @classdesc Class to create TA filters Expression
 */
class TAFiltersBuilder{
    /**
     * @memberof TAFiltersBuilder
     * @function GetSelectedCategoryFilterExpression
     * @param {Object} params - {
            context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
            folder: {TAFolder},
            allCategoriesParameter: {String}
        }
     * @returns {String}
     */
    static function GetSelectedCategoryFilterExpression(params){
        var fExpr;

        var context = params.context;
        var folder = params.folder;
        var selectedCategory = context.state.Parameters.GetString(params.allCategoriesParameter)
        fExpr = (selectedCategory && selectedCategory !=="emptyv") ?('ANY(' + folder.GetQuestionId("categories") + ',"'+selectedCategory+'")'):'NOT ISNULL('+folder.GetQuestionId("overallSentiment")+')';

        return fExpr;
    }

    /**
     * @memberof TAFiltersBuilder
     * @function GetUncategorizedCommentsFilterExpression
     * @param {Object} params - {
            context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
            folder: {TAFolder},
            allCategoriesParameter: {String}
        }
     * @returns {String}
     */
    static function GetUncategorizedCommentsFilterExpression(params){
        var fExpr;

        var context = params.context;
        var folder = params.folder;
        //var selectedCategory = context.state.Parameters.GetString(params.allCategoriesParameter)
        //fExpr = (selectedCategory && selectedCategory !=="emptyv") ?('ANY(' + folder.GetQuestionId("categories") + ',"'+selectedCategory+'")'):'NOT ISNULL('+folder.GetQuestionId("overallSentiment")+')';

        fExpr = 'NOT ANY(' + folder.GetQuestionId("categories") + ',"uc' + folder.GetModelNumber() + '")';
        return fExpr;
    }

    /**
     * @memberof TAFiltersBuilder
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

        var sentimentParameterValue = context.state.Parameters.GetString(sentimentParameter);
        var setimentValues = params.sentimentValues;
        var sentimentRange = "";

        if (setimentValues.length > 0) {
            sentimentRange ='"'+setimentValues.join('","')+'"';
        }
        else {
            switch (sentimentParameterValue) {
                case "pos":
                    sentimentRange = '"' + sentimentRanges.Positive.join('","') + '"';
                    break;
                case "neu":
                    sentimentRange = '"' + sentimentRanges.Neutral.join('","') + '"';
                    break;
                case "neg":
                    sentimentRange = '"' + sentimentRanges.Negative.join('","') + '"';
                    break;
            }
        }

        if(sentimentRange.length > 0 ){
            var folder = params.folder;
            var selectedCategory = context.state.Parameters.GetString(params.allCategoriesParameter)
            var questionName = (selectedCategory && selectedCategory !== "emptyv")
                ? (folder.GetQuestionId("categorysentiment")+"_"+selectedCategory)
                : folder.GetQuestionId("overallsentiment");

            fExpr = 'IN(' + questionName + ','+sentimentRange+')'
        }

        return fExpr;
    }

    /**
     * @memberof TAFiltersBuilder
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