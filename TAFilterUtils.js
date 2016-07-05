class TAFilterUtils{
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
     * filter for themes thrending based on the TA_VIEW_SENTIMENT parameter
     * @param {Filter} filter
     * @param {String} sentiment - value of TA_VIEW_SENTIMENT parameter "neg", "neu", "pos", "all" ("all" is default)
     */
    static function NegNeuPosFilter(filter: Filter, sentiment){
        var vName : String = TALibrary.currentQuestion.overallSentiment.questionName;
        var fExpr : String;

        switch (sentiment){
            case "neg":
                fExpr = '( ' + vName + ' = "1"';
                fExpr += ' OR ' + vName + ' = "2"';
                fExpr += ' OR ' + vName + ' = "3"';
                fExpr += ' OR ' + vName + ' = "4")';
                break;
            case "neu":
                fExpr = '( ' + vName  + ' = "5"';
                fExpr += ' OR ' + vName + ' = "6"';
                fExpr += ' OR ' + vName + ' = "7" )';
                break;
            case "pos":
                fExpr = '( ' + vName  + ' = "8"';
                fExpr += ' OR ' + vName + ' = "9"';
                fExpr += ' OR ' + vName + ' = "10"';
                fExpr += ' OR ' + vName + ' = "11" )';
                break;
            case "all":
            default:
                fExpr = "";
                break;
        }

    filter.Expression = fExpr;
    }

    /**
     * current theme filter
     * @param filter
     */
    static function currentThemeFilter(filter){
        var fExpr : String;
        var pCatList = TALibrary.currentQuestion.currentTheme;

        fExpr = pCatList>=0?('ANY(' + TALibrary.currentQuestion.categories.questionName + ',"'+TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme].id+'")'):'NOT ISNULL('+TALibrary.currentQuestion.overallSentiment.questionName+')';

        filter.Expression = fExpr;
    }
}