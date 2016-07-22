class Page_detailed_analysis {
    static private const PageId = "detailed_analysis";

    static function Hide(context) {
        return false
    }

    static function Render(context) {
        var metaData = new MetaData(context.report, context.log);
        //var configurationManager = new ConfigurationManager();
        //var dashboardComponents = new DashboardComponents(context.Report, metaData, configurationManager, context.Log);
        //context.PageContext.Items.Add("dashboardComponents", dashboardComponents);

        var parameterUtilities = new ParameterUtilities(context.report, context.state, context.log);
        var pageTemplate = new PageTemplate(context.component, context.report, parameterUtilities, context.log);
        pageTemplate.Process(PageId);

        TALibrary.setReport(context.pageContext, context.log, context.report, context.confirmit, context.user);
        TALibrary.setCurrentQuestion(context.pageContext.Items["questionID"]);
        TALibrary.currentQuestion.setCurrentTheme(context.state.Parameters.IsNull("TA_TOP_CATEGORIES_SINGLE") ? null : context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE"));
    context.log.LogDebug(TALibrary.currentQuestion.currentTheme+ " on page");

        if(context.state.Parameters.IsNull("TA_DISTRIBUTION_TOGGLE"))
            context.state.Parameters["TA_DISTRIBUTION_TOGGLE"] = new ParameterValueResponse("0");
    }

    static function txtCategory_Hide(context){
        return false;
    }

    static function txtCategory_Render(context){
        context.component.Output.Append("Category");
    }

    static function lstCategory_Hide(context){
        return false;
    }

    static function tblTotalCommentsTile_Hide(context){
        return false;
    }

    static function tblTotalCommentsTile_Render(context){
    context.log.LogDebug(TALibrary.currentQuestion.currentTheme+ " on table");
        TATableUtils.createDetailedAnalysisTiles(context.component,"total");
    }
}
