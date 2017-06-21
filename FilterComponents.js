/**
 * @class FilterComponents
 * @classdesc Class to process filters on Filter page
 *
 * @constructs FilterComponents
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {String[]} questionsArray
 * @param {String} dataSource - ds id
 */
//TODO: make filter components static across the report
class FilterComponents{
    private var _filterQuestions;
    private var _parameterUtilities;


    function FilterComponents(params){

        var context = params.context;
        var questionsArray = params.questionsArray;
        var dataSource = params.dataSource;

        _filterQuestions = [];

        var project  = context.report.DataSource.GetProject(dataSource);
        for( var i = 0; i < questionsArray.length; i++ ){
            _filterQuestions.push(project.GetQuestion(questionsArray[i]))
        }
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function GetFilterQuestion
     * @description function to get Question object for the particular filter
     * @param {Number} filterNumber
     * @returns {Question}
     */
    function GetFilterQuestion(filterNumber){
        var filterQuestion = false;
        if(_filterQuestions.length > filterNumber && ( _filterQuestions[(filterNumber)].QuestionType === QuestionType.Multi || _filterQuestions[(filterNumber)].QuestionType === QuestionType.Single )){
            var filterQuestion = _filterQuestions[(filterNumber)];
        }

        return filterQuestion
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function GetFilterTitle
     * @description function to get Title for the particular filter
     * @param {Number} filterNumber
     * @returns {String}
     */
    function GetFilterTitle(filterNumber){
        var filterQuestion = GetFilterQuestion(filterNumber);
        var label = "";
        if(filterQuestion)
            var label = filterQuestion.Title ? filterQuestion.Title : filterQuestion.QuestionId;

        return label
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function GetGlobalsFilterExpression
     * @description function to get filter expression for all selected filters
     * @returns {String}
     */
    function GetGlobalsFilterExpression(){
        var fExpr;
        var filterExpressionSegments = [];
        var codes = GetAllAnsweredFilterCodes()
        for (var i = 0; i < codes.length; i++){
            if( codes[i].questionType == QuestionType.Multi ) {
                filterExpressionSegments.push ('ANY(' + codes[i].questionId + ',"' + codes[i].values.join('","') + '")');
            }
            else
            {
                filterExpressionSegments.push ('IN(' + codes[i].questionId + ',"' + codes[i].values.join('","') + '")');
            }
        }

        fExpr = filterExpressionSegments.join(" AND ")
        return fExpr
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function GetAllAnsweredFilterCodes
     * @description function to get selected filters information
     * @returns {Object[]} - array of Objects with Filter information and answers like { questionTitle: "Title", questionId: "qId", values: [1,2], texts: ["one", "two"]}
     */
    function GetAllAnsweredFilterCodes(){
        var answeredCodes = [];
        for (var i = 0; i < _filterQuestions.length; i++){
            var codes = GetFilterInformation(i);
            if(codes && codes.values.length > 0){
                answeredCodes.push(codes);
            }
        }
        return answeredCodes
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function GetFilterInformation
     * @description function to get filter information
     * @param {Number} filterNumber
     * @returns {Object} - Object with Filter information and answers like { questionTitle: "Title", questionId: "qId", values: [1,2], texts: ["one", "two"]}
     */
    function GetFilterInformation(filterNumber){
        var result = false;
        var parameterName = 'FILTER' + (filterNumber +1);
        var codes = _parameterUtilities.GetParameterCodes(parameterName);
        if ( codes.length > 0 ){
            var fTitle = GetFilterTitle(filterNumber);
            var fId = _filterQuestions[filterNumber].QuestionId;
            var fType = _filterQuestions[filterNumber].QuestionType
            result = {
                questionTitle: fTitle,
                questionId: fId,
                questionType: fType,
                values: [],
                texts: []
            };
            for ( var i = 0; i < codes.length; i++){
                result.values.push(codes[i]);
                result.texts.push(_filterQuestions[filterNumber].GetAnswer(codes[i]).Text)
            }
        }
        return result
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function ClearFilters
     * @description function to set all filter parameters to null
     */
    static function ClearFilters(context){
        var filterQuestions = Config.GetTALibrary().GetFilterQuestions();
        for (var i = 0; i < filterQuestions.length; i++){
            context.state.Parameters["FILTER"+(i+1)] = null;
        }
    }
}