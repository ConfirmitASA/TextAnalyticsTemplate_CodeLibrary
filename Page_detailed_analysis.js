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
        TATableUtils.createDetailedAnalysisTiles(context.component,"total");
    }

    static function tblNegativeCommentsTile_Hide(context){
        return false;
    }
    static function tblNegativeCommentsTile_Render(context){
        TATableUtils.createDetailedAnalysisTiles(context.component,"neg",context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE"));
    }

    static function tblNeutralCommentsTile_Hide(context){
    return false;
}
    static function tblNeutralCommentsTile_Render(context){
        TATableUtils.createDetailedAnalysisTiles(context.component,"neu",context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE"));
    }

    static function tblPositiveCommentsTile_Hide(context){
    return false;
}
    static function tblPositiveCommentsTile_Render(context){
        TATableUtils.createDetailedAnalysisTiles(context.component,"pos",context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE"));
    }

    static function txtViewBy_Hide(context){
        return false;
    }
    static function txtViewBy_Render(context){
        context.component.Output.Append("View by:");
    }

    static function tblDetailedAnalysis_Hide(context){
        return false;
    }
    static function tblDetailedAnalysis_Render(context){
        TATableUtils.createDetailedAnalysisTable(context.component, context.state.Parameters.GetString("TA_VIEW_BY"), context.state.Parameters.GetString("TA_DISTRIBUTION_TOGGLE"));
        TATableUtils.setupTableClasses(context.component, ["reportal-table","reportal-categories", "reportal-fixed-header", "reportal-hierarchy-table", "reportal-barchart"]);
    }
}
