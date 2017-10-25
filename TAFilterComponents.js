/**
 * @class TAFilterComponents
 * @classdesc Class to process filters on Filter page and Filter Panel
 *
 * @constructs TAFilterComponents
 * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 */
class TAFilterComponents{
    private var _filterQuestions;

    function FilterComponents(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var questionsArray = Config.GetTALibrary().GetFolderById(selectedFolder).GetFilterQuestions();
        var dataSource =  Config.GetTALibrary().GetFolderById(selectedFolder).GetDatasourceId();

        _filterQuestions = [];

        var project  = context.report.DataSource.GetProject(dataSource);

        for( var i = 0; i < questionsArray.length; i++ ){
            _filterQuestions.push(project.GetQuestion(questionsArray[i]))
        }
    }

    /**
     * @memberof TAFilterComponents
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
     * @memberof TAFilterComponents
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
     * @memberof TAFilterComponents
     * @instance
     * @function GetGlobalsFilterExpression
     * @description function to get filter expression for all selected filters
     * @params {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
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
     * @memberof TAFilterComponents
     * @instance
     * @function GetAllAnsweredFilterCodes
     * @description function to get selected filters information
     * @params {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Object[]} - array of Objects with Filter information and answers like { questionTitle: "Title", questionId: "qId", values: [1,2], texts: ["one", "two"]}
     */
    function GetAllAnsweredFilterCodes(context){
        var answeredCodes = [];
        for (var i = 0; i < _filterQuestions.length; i++){
            var codes = GetFilterInformation({
                context: context,
                filterNumber: i
            });

            if(codes && codes.values.length > 0){
                answeredCodes.push(codes);
            }
        }

        return answeredCodes
    }

    /**
     * @memberof TAFilterComponents
     * @instance
     * @function GetFilterInformation
     * @description function to get filter information
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          filterNumber: {Number}
     *      }
     * @returns {Object} - Object with Filter information and answers like { questionTitle: "Title", questionId: "qId", values: [1,2], texts: ["one", "two"]}
     */
    function GetFilterInformation(params){
        var context = params.context;
        var filterNumber = params.filterNumber;
        var result = false;

        var parameterName = 'FILTER' + (filterNumber +1);

        var codes = TAParameterUtilities.GetParameterCodes({
            context: context,
            parameterName: parameterName
        });

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
     * @memberof TAFilterComponents
     * @instance
     * @function ClearFilters
     * @description function to set all filter parameters to null
     */
    static function ClearFilters(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var filterQuestions = Config.GetTALibrary().GetFolderById(selectedFolder).GetFilterQuestions();
        for (var i = 0; i < filterQuestions.length; i++){
            context.state.Parameters["FILTER"+(i+1)] = null;
        }
    }
}