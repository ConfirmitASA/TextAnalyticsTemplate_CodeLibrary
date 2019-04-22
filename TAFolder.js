/**
 * @class TAFolder
 * @classdesc Class to work with Text Analytics variables
 *
 * @constructs TAFolder
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {Object} questionIndex - index of question in cofig
 * @param {Object} Config
 */
class TAFolder{
    private var _globals;

    //TA Fields
    private var _id: String;
    private var _folderName;
    private var _qName: String;
    private var _modelNo: String;

    //additional fields
    private var _timeVariableId: String;
    private var _datasourceId: String;
    private var _variablesToViewBy;
    private var _hitlistColumns;
    private var _filterQuestions;
    private var _correlationVariableId;
    private var _correlationSuppressingBase;
    private var _significantTestScore;
    private var _correlationVariableShownName;
    private var _salesforceParameters;

    private var _hierarchy: TAHierarchy;



    function TAFolder(globals, questionIndex, config){
        _globals = globals;
        _id = config.TAQuestions[questionIndex].DatasourceId + config.TAQuestions[questionIndex].TAQuestionName + config.TAQuestions[questionIndex].TAModelNo;
        _folderName = config.TAQuestions[questionIndex].TAFolderId;
        _qName = config.TAQuestions[questionIndex].TAQuestionName;
        _modelNo = config.TAQuestions[questionIndex].TAModelNo;
        _timeVariableId = config.TAQuestions[questionIndex].TimeVariableId;

        _datasourceId = config.TAQuestions[questionIndex].DatasourceId;

        _variablesToViewBy = config.TAQuestions[questionIndex].VariablesToViewBy;

        _hitlistColumns = config.TAQuestions[questionIndex].HitlistColumns;

        _filterQuestions = config.TAQuestions[questionIndex].FilterQuestions;

        _correlationVariableId = config.TAQuestions[questionIndex].CorrelationVariableId;

        _correlationSuppressingBase = config.TAQuestions[questionIndex].CorrelationSuppressingBase;

        _significantTestScore = config.TAQuestions[questionIndex].SignificantTestScore;

        _correlationVariableShownName = config.TAQuestions[questionIndex].CorrelationVariableShownName;
        _salesforceParameters = config.TAQuestions[questionIndex].Salesforce;

        _hierarchy = new TAHierarchy(globals, {
            schemaId: config.TAQuestions[questionIndex].DatabaseSchemaId,
            tableName: config.TAQuestions[questionIndex].DatabaseTableName,
            relationshipColumnName: config.TAQuestions[questionIndex].RelationshipColumnName,
            textColumnName: "__l"+globals.report.CurrentLanguage,
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
     * @description function to Get TAHierarchy for the text analytics set
     * @returns {TAHierarchy}
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
     * @function GetName
     * @description function to Get Name configured for the text analytics set
     * @returns {String}
     */
    function GetName(){
        return _folderName;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetModelNumber
     * @description function to Get Model Number configured for the text analytics set
     * @returns {String}
     */
    function GetModelNumber(){
        return _modelNo;
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
     * @function GetCorrelationVariables
     * @description function to Get array of qIds to use in the correlation table
     * @returns {String[]}
     */
    function GetCorrelationVariables(){
        return _correlationVariableId;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetCorrelationSuppressingBase
     * @description function to Get the suppressing base for correlation table
     * @returns {String[]}
     */
    function GetCorrelationSuppressingBase(){
        return _correlationSuppressingBase;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetSignificantTestScore
     * @description function to Get the significant test score for theme distribution table
     * @returns {String[]}
     */
    function GetSignificantTestScore(){
        return _significantTestScore;
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

    /**
     * @memberof TAFolder
     * @instance
     * @function GetFilterQuestions
     * @description function to Get array of qIds to use as filters
     * @returns {String[]}
     */
    function GetFilterQuestions(){
         return _filterQuestions;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetCorrelationVariableId
     * @description function to Get qId to use for building Impact Analysis page
     * @returns {String[]}
     */
    function GetCorrelationVariableId(){
        return _correlationVariableId;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetCorrelationVariableShownName
     * @description function to Get shown question name to use for building Impact Analysis page
     * @returns {String[]}
     */
    function GetCorrelationVariableShownName(){
        return _correlationVariableShownName;
    }

    /**
     * @memberof TAFolder
     * @instance
     * @function GetSalesforceParameters
     * @description function to salesforce parameters to use for Salesforce page
     * @returns {Object}
     */
    function GetSalesforceParameters(){
        return _salesforceParameters;
    }
}