class Page_comments {
    static private const PageId = "comments";

    static function Hide(context) {
        return false
    }

    static function Render(context) {
        var metaData = new MetaData(context.report, context.log);
        var parameterUtilities = new ParameterUtilities(context.report, context.state, context.log);
        var pageTemplate = new PageTemplate(context.component, context.report, parameterUtilities, context.log);
        pageTemplate.Process(PageId);

        TALibrary.setReport(context.pageContext, context.log, context.report, context.confirmit, context.user);
        TALibrary.setCurrentQuestion(context.pageContext.Items["questionID"]);
        TALibrary.currentQuestion.setCurrentTheme(context.state.Parameters.IsNull("TA_TOP_CATEGORIES_SINGLE") ? null : context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE"));

        if(context.state.Parameters.IsNull("TA_DISTRIBUTION_TOGGLE"))
            context.state.Parameters["TA_DISTRIBUTION_TOGGLE"] = new ParameterValueResponse("0");

        if(context.state.Parameters.IsNull("TA_VIEW_BY"))
            context.state.Parameters["TA_VIEW_BY"] = new ParameterValueResponse("0");
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

    static function htlComments_Hide(context){
        return false;
    }

    static function htlComments_Render(context){
        if(TALibrary.currentQuestion.currentTheme>=0){
            context.component.Columns.Add(TAHitlistUtils.getTAHitlistColumn("categorysentiment"));
        }
        context.component.Columns.Add(TAHitlistUtils.getTAHitlistColumn("verbatim"));
        context.component.Columns.Add(TAHitlistUtils.getTAHitlistColumn(Config.DateVariableId ? Config.DateVariableId : "interview_start"));
        context.component.Columns.Add(TAHitlistUtils.getTAHitlistColumn("overallsentiment"));

        for(var i = 0 ; i < TALibrary.currentQuestion.questionDetails.TAHitlistFields.length; i++){
            context.component.Columns.Add(TAHitlistUtils.getTAHitlistColumn(TALibrary.currentQuestion.questionDetails.TAHitlistFields[i]));
        }

    }


}
