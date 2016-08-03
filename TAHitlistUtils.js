class TAHitlistUtils {
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;

    /**
     * @param {Logger} l - log
     * @param {Report} r - report
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
     * function to add column to hitlist
     * @param {String} name - question id or TA postfix
     * @return {HitListColumn}
     */
    static function

    getTAHitlistColumn(name, sortable){

        var hitlistColumn: HitListColumn = new HitListColumn();
        switch (name.toLowerCase()) {
            case "overallsentiment":
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.overallSentiment.questionnaireElement;
                break;
            case "categories":
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.categories.questionnaireElement;
                break;
            case "positivementions":
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.positiveMentions.questionnaireElement;
                break;
            case "negativementions":
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.negativeMentions.questionnaireElement;
                break;
            case "categorysentiment":
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.currentTheme>=0 ? TALibrary.currentQuestion.project.CreateQuestionnaireElement(TALibrary.currentQuestion.categorySentiment.questionName, TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].id) : TALibrary.currentQuestion.categorySentiment.questionnaireElement;
                break;
            case "verbatim":
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.verbatim.questionnaireElement;
                break;
            default:
                hitlistColumn.QuestionnaireElement = TALibrary.currentQuestion.project.CreateQuestionnaireElement(name);
                break;
        }
        sortable ? (hitlistColumn.IsSortable = true) : null;

        return hitlistColumn
    }
}