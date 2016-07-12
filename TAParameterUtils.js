class TAParameterUtils{
    //Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;

    /**
     * @param {Logger} l - log
     * @param {Report} r - report
     * @param {ReportState} s - state
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     */
    static function setGlobals(p: ScriptPageContext, l: Logger, r: Report, c: ConfirmitFacade, u: User){
        pageContext = p;
        log = l;
        report = r;
        confirmit = c;
        user = u;
    }

    /**
     * domain script to get list of top TA categories
     * @param {Parameter} parameter - parameter object
     * @param {Byte} questionID - question number in TAConfig
     */
    static function createThemesListParameter(parameter: Parameter,questionID){
        var parameterValues=[];
        var question: TAQuestion;
        parameterValues.push({Code: "all", Label: "All"});
        question=(questionID?TALibrary.questions[questionID]:TALibrary.currentQuestion);

        for(var i=0; i<question.themes.length; i++)
        {
            parameterValues.push({Code: question.themes[i].id, Label: question.themes[i].name});
        }
        ParameterUtilities.LoadParameterValues(report, parameter, parameterValues);
    }
}