/**
 * @class TAFolder
 * @classdesc Class to work with Text Analytics variables
 *
 * @constructs TAFolder
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {Object} questionObj - Object from Config.TAQuestions[i]
 */
class TAFolder{
    private var _globals;

    //TA Fields
    private var _id: String;
    private var _qName: String;
    private var _modelNo: String;

    //additional fields
    private var _timeVariableId: String;
    private var _datasourceId: String;
    private var _variablesToViewBy;
    private var _hitlistColumns;

    private var _hierarchy: Hierarchy;


    function TAFolder(globals, questionIndex, config){
        _globals = globals;
        _id = config.TAQuestions[questionIndex].TAFolderId;
        _qName = config.TAQuestions[questionIndex].TAQuestionName;
        _modelNo = config.TAQuestions[questionIndex].TAModelNo;

        _timeVariableId = TAHelper.GetConfiguredVariables(globals,[config.TAQuestions[questionIndex].TimeVariableId], config.TimeVariableId, null, ["interview_start"])[0];


        _datasourceId = TAHelper.GetConfiguredVariables(globals,[config.TAQuestions[questionIndex].DatasourceId], [config.DS_Main], null, ["ds0"])[0];
    var variablesToViewBy = TAHelper.GetTagsFromSurvey(globals, _datasourceId, ["ta_viewby"]);
        _variablesToViewBy = TAHelper.GetConfiguredVariables(globals, config.TAQuestions[questionIndex].VariablesToViewBy, config.VariablesToViewBy, variablesToViewBy, []);
    var hitlistColumns = TAHelper.GetTagsFromSurvey(globals, _datasourceId, ["ta_hitlist"]);
        _hitlistColumns = TAHelper.GetConfiguredVariables(globals, config.TAQuestions[questionIndex].HitlistColumns, config.HitlistColumns, hitlistColumns, []);
        _hierarchy = new Hierarchy(globals, {
            schemaId: config.TAQuestions[questionIndex].DatabaseSchemaId,
            tableName: config.TAQuestions[questionIndex].DatabaseTableName,
            relationshipColumnName: config.TAQuestions[questionIndex].RelationshipColumnName,
            textSeparator: config.TAQuestions[questionIndex].TextSeparator != "" ? config.TAQuestions[questionIndex].TextSeparator: null
        });
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetQuestionId
     * @description function to Get id of text analytics variable (verbatim if no parameters)
     * @param {String} questionType - type of the question "overallsentiment" or "os", "categories" or "c", "positivementions" or "positive" or "pm", "negativementions" or "negative" or "nm", "categorysentiment" or "cs"
     * @returns {String}
     */
    function GetQuestionId(questionType){
        var postfix;
        if(!questionType){
            return _qName;
        }
        switch(questionType.toLowerCase()){
            case "overallsentiment":
            case "os":
                postfix = "OverallSentiment";
                break;
            case "categories":
            case "c":
                postfix = "Categories";
                break;
            case "positivementions":
            case "positive":
            case "pm":
                postfix = "PositiveMentions";
                break;
            case "negativementions":
            case "negative":
            case "nm":
                postfix = "NegativeMentions";
                break;
            case "categorysentiment":
            case "cs":
                postfix = "CategorySentiment"
                break;
            case "verbatim":
            default:
                postfix = false;
                break;
        }

        return _qName+( postfix ? (_modelNo + postfix) : "" );
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetHierarchy
     * @description function to Get Hierarchy for the text analytics set
     * @returns {Hierarchy}
     */
    function GetHierarchy(){
        return _hierarchy;
}

    /**
     * @memberof TAFolder
     * @instance
     * @function GetId
     * @description function to Get unique Id for the text analytics set
     * @returns {String}
     */
    function GetId(){
        return _id;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetTimeVariableId
     * @description function to Get qId of time variable for the set
     * @returns {String}
     */
    function GetTimeVariableId(){
        return _timeVariableId;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetDatasourceId
     * @description function to Get Id of the datasource
     * @returns {String}
     */
    function GetDatasourceId(){
        return _datasourceId;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetViewByVariables
     * @description function to Get array of qIds to use in the detailed analysis table
     * @returns {String[]}
     */
    function GetViewByVariables(){
        return _variablesToViewBy;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetHitlistColumns
     * @description function to Get array of qIds to use in the end of the hitlist
     * @returns {String[]}
     */
    function GetHitlistColumns(){
        return _hitlistColumns;
    }
}