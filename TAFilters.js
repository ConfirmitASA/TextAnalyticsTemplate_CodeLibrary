/**
 * @class TAFilters
 * @classdesc Class to work with Text Analytics filters
 *
 * @constructs TAFilters
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFolder} folder - Text Analytics folder to build table from
 */
class TAFilters{
    private var _globals;
    private var _folder: TAFolder;
    private var _parameterUtilities: ParameterUtilities;

    function TAFilters(globals, folder){
        _globals = globals;
        _folder = folder;
    }

    /**
     * @memberof TAFilters
     * @instance
     * @function GetSelectedCategoryFilterExpression
     * @param {String} categoriesParameter
     * @param {String} subCategoriesParameter
     * @param {String} attributesParameter
     * @returns {String}
     */
    function GetSelectedCategoryFilterExpression(categoriesParameter, subCategoriesParameter, attributesParameter){
        var fExpr;
        var selectedCategory = TAHelper.GetSelectedCategory(_globals.state, categoriesParameter, subCategoriesParameter, attributesParameter);

        fExpr = selectedCategory ?('ANY(' + _folder.GetQuestionId("categories") + ',"'+selectedCategory+'")'):'NOT ISNULL('+_folder.GetQuestionId("overallSentiment")+')';

        return fExpr;
    }

    /**
     * @memberof TAFilters
     * @instance
     * @function GetSentimentFilterExpression
     * @param {String} categoriesParameter
     * @param {String} subCategoriesParameter
     * @param {String} attributesParameter
     * @param {String} sentimentParameter
     * @returns {String}
     */
    function GetSentimentFilterExpression(categoriesParameter, subCategoriesParameter, attributesParameter, sentimentParameter){
        var fExpr;
        var selectedCategory = TAHelper.GetSelectedCategory(_globals.state, categoriesParameter, subCategoriesParameter, attributesParameter);
        var sentimentParameterValue = _globals.state.Parameters.GetString(sentimentParameter);
        var sentimentRange = false;
        switch( sentimentParameterValue ){
            case "pos":
                sentimentRange ='"'+Config.SentimentRange.Positive.join('","')+'"';
                break;
            case "neu":
                sentimentRange ='"'+ Config.SentimentRange.Neutral.join('","') +'"';
                break;
            case "neg":
                sentimentRange ='"' + Config.SentimentRange.Negative.join('","')+'"';
                break;
        }
        var questionName = selectedCategory ? (_folder.GetQuestionId("categorysentiment")+"_"+selectedCategory) : _folder.GetQuestionId("overallsentiment");
        fExpr = sentimentRange ?('IN(' + questionName + ','+sentimentRange+')') : '';
        return fExpr;
    }

    /**
     * @memberof TAFilters
     * @instance
     * @function GetDateFilterExpression
     * @param {String} fromParameter
     * @param {String} toParameter
     * @returns {String}
     */
    function GetDateFilterExpression(fromParameter, toParameter){
        var fExpr;
        var isFrom = _globals.state.Parameters.IsNull(fromParameter);
        var isTo = _globals.state.Parameters.IsNull(toParameter);
        var fromExpr;
        var toExpr;
        var resultArray = [];
        if(!isFrom)
        {
            fromExpr = _folder.GetTimeVariableId() + ' >= PValDate("' +fromParameter+'")';
            resultArray.push(fromExpr);
        }

        if(!isTo){
            toExpr = _folder.GetTimeVariableId() + ' <= PValDate("' +toParameter+'")';
            resultArray.push(toExpr);
        }

        fExpr = resultArray.join(" AND ");

        return fExpr
    }
}