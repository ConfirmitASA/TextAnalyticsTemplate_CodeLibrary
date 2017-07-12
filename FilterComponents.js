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

    function FilterComponents(params){
        var context = params.context;
        context.log.LogDebug("filtcomm1");
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
    context.log.LogDebug("filtcomm2");
        var questionsArray = Config.GetTALibrary().GetFolderById(selectedFolder).GetFilterQuestions();
    context.log.LogDebug("filtcomm3");
        var dataSource =  Config.GetTALibrary().GetFolderById(selectedFolder).GetDatasourceId();
    context.log.LogDebug("filtcomm4");
        _filterQuestions = [];
    context.log.LogDebug("filtcomm5");
        var project  = context.report.DataSource.GetProject(dataSource);
    context.log.LogDebug("filtcomm6");
        for( var i = 0; i < questionsArray.length; i++ ){

            _filterQuestions.push(project.GetQuestion(questionsArray[i]))
        }
    context.log.LogDebug("filtcomm7");
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
    function GetGlobalsFilterExpression(context){
        var fExpr;
        var filterExpressionSegments = [];
        var codes = GetAllAnsweredFilterCodes(context)
        for (var i = 0; i < codes.length; i++){
            if( codes[i].questionType === QuestionType.Multi ) {
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
    function GetAllAnsweredFilterCodes(context){

        var answeredCodes = [];
        for (var i = 0; i < _filterQuestions.length; i++){
            var codes = GetFilterInformation({
                context: context,
                filterNumber: i
            });

            context.log.LogDebug("filtc41 "+i);

            if(codes && codes.values.length > 0){
                answeredCodes.push(codes);
            }

            context.log.LogDebug("filtc51 "+i);
        }
    context.log.LogDebug("filtc61");
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
    function GetFilterInformation(params){
        var context = params.context;
    context.log.LogDebug("filtc1");
        var filterNumber = params.filterNumber;
    context.log.LogDebug("filtc2");
        var result = false;
    context.log.LogDebug("filtc3");
        var parameterName = 'FILTER' + (filterNumber +1);
    context.log.LogDebug("filtc4");
        var codes = ParameterUtilities.GetParameterCodes({
            context: context,
            parameterName: parameterName
        });
    context.log.LogDebug("filtc5");

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

    context.log.LogDebug("filtc6");
        return result
    }

    /**
     * @memberof FilterComponents
     * @instance
     * @function ClearFilters
     * @description function to set all filter parameters to null
     */
    static function ClearFilters(context){

    var context = context;
    var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
    var filterQuestions = Config.GetTALibrary().GetFolderById(selectedFolder).GetFilterQuestions();
        for (var i = 0; i < filterQuestions.length; i++){
            context.state.Parameters["FILTER"+(i+1)] = null;
        }
    }
}