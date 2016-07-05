class TAQuestion{

    //Globals
    var log: Logger;
    var report: Report;
    var state: ReportState;
    var confirmit: ConfirmitFacade;
    var user: User;
    var project: Project;
    var schema: DBDesignerSchema;
    var table: DBDesignerTable;

    var questionDetails: Object;

    //TA Fields
    var verbatim: TAField;
    var overallSentiment: TAField;
    var categories: TAField;
    var positiveMentions: TAField;
    var negativeMentions: TAField;
    var categorySentiment: TAField;

    //TACategories
    var themes = [];
    var subcategories = [];
    var attributes = [];

    var hierarchy = []; //hierarchical structure of categories {id: String, name: String, children: []}
    var categoriesArray = [];//flat structure of categories {id: String, name: String, parentId: String}

    var currentTheme = -1;


    /**
     * TAQuestion Constructor
     * @param {Logger} l - log
     * @param {Report} r - report
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     * @param {Object} questionObj - TAConfig.TAQuestions[i]
     */
    function TAQuestion(l: Logger, r: Report, c: ConfirmitFacade, u: User, questionObj: Object){
    var codes: StringCollection;
    var names: StringCollection;
    var parents: StringCollection;

    //Globals
    log = l;
    report = r;
    confirmit = c;
    user = u;

    project = report.DataSource.GetProject(questionObj.TADatasourceId);
    schema = confirmit.GetDBDesignerSchema(questionObj.DatabaseSchemaId);
    table = schema.GetDBDesignerTable(questionObj.DatabaseTableName);

    questionDetails = questionObj;

    //TAFields
    verbatim = new TAField(questionDetails.TAQuestionName,project,"","");
    overallSentiment = new TAField(questionDetails.TAQuestionName,project,questionDetails.TAModelNo,"OverallSentiment");
    categories = new TAField(questionDetails.TAQuestionName,project,questionDetails.TAModelNo,"Categories");
    positiveMentions = new TAField(questionDetails.TAQuestionName,project,questionDetails.TAModelNo,"PositiveMentions");
    negativeMentions = new TAField(questionDetails.TAQuestionName,project,questionDetails.TAModelNo,"NegativeMentions");
    categorySentiment = new TAField(questionDetails.TAQuestionName,project,questionDetails.TAModelNo,"CategorySentiment");

    //hierarchies
    codes = table.GetColumnValues("id");
    names = table.GetColumnValues("__l9");
    try{
        parents = table.GetColumnValues(questionDetails.RelationshipColumnName?questionDetails.RelationshipColumnName:"parent");
    }catch(e){
        log.LogDebug("Incorrect name for relationship column in the table");
        parents = new StringCollection();
    }

    for(var i=0; i<codes.Count; i++){
        categoriesArray.push({id: codes.Item(i), name: names.Item(i), parent: parents.Count>0?parents.Item(i):null});
    }

    setupHierarchy(0, null);
}

    /**
     * Recursive function to build categories hierarchical structure
     * @param {StringCollection} codes - collection of categories precodes
     * @param {StringCollection} names - collection of categories names
     * @param {StringCollection} parents - collection of categories parent precodes
     * @param {Int} level - recursion depth (0-themes, 1-subcategories, 2-attributes)
     * @param {Object} parentObj - parent for current level
     */
    function setupHierarchy(level: Byte, parentObj){
    var newObj: Object;
    var parentObjId = parentObj?parentObj.id:"";

    for(var i=0; i<categoriesArray.length; i++){
        if((!parentObj && !categoriesArray[i].parent) || parentObjId.CompareTo(categoriesArray[i].parent?categoriesArray[i].parent:"") == 0){
            newObj = new Object();
            newObj = {id: categoriesArray[i].id, name: categoriesArray[i].name, parent: (parentObj?parentObj.id:""), children: []};

            setupHierarchy((level+1), newObj);

            if(!parentObj)
                hierarchy.push(newObj);
            else
                parentObj.children.push(newObj);

            switch(level){
                case 0:
                    themes.push(newObj);
                    break;
                case 1:
                    subcategories.push(newObj);
                    break;
                case 2:
                    attributes.push(newObj);
                    break;
                default:
                    break;
            }
        }
    }
}

    /**
     * function to set current top Category from parameter
     * @param {Object} context - context object from page {component: page, pageContext: pageContext, log: log, report: report, state: state, confirmit: confirmit, user: user}
     */
    function setCurrentTheme(context){
    var state: ReportState = context.state;

    if(state.Parameters.GetString(questionDetails.TACategoryListParameter)){
        var themeId = state.Parameters.GetString(questionDetails.TACategoryListParameter)
        for(var i=0; i<themes.length;i++){
            if(themes[i].id == themeId){
                currentTheme = i;
                break;
            }
        }
    }else{
        currentTheme = -1;
    }
}
}

class TAField{
    var questionName: String;
    var questionnaireElement: QuestionnaireElement;
    var question: Question;

    /**
     * TAField constructor
     * @param {String} qName - verbtim question name
     * @param {Project} project
     * @param {String} model - TA model id ("" for verbatim)
     * @param {String} postfix - TA field postfix("" for verbatim)
     */
    function TAField(qName: String, project: Project, model: String, postfix: String){
    questionName = qName+model+postfix;
    questionnaireElement = project.CreateQuestionnaireElement(questionName);
    question = project.GetQuestion(questionName);
}
}