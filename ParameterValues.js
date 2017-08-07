class ParameterValues {
    private static function getParameterValues(currentDictionary, parameterId) {
        switch(parameterId) {
            case "TA_LEVEL":
                return [
                    {Code: "0", Label: currentDictionary["1st level (category)"]},
                    {Code: "1", Label: currentDictionary["2nd level (sub-category)"]},
                    {Code: "2", Label: currentDictionary["3rd level (attributes)"]}
                ];
            case "TA_COMPARE_PERIODS":
                return [
                    {Code: "wow", Label: currentDictionary["Current vs Last Week"]},
                    {Code: "mom", Label: currentDictionary["Current vs Last Month"]},
                    {Code: "qoq", Label: currentDictionary["Current vs Last Quarter"]},
                    {Code: "yoy", Label: currentDictionary["Current vs Last Year"]}
                ];
            case "TA_VIEW_SENTIMENT":
                return [
                    {Code: "emptyv", Label: currentDictionary["All sentiments"]},
                    {Code: "pos", Label: currentDictionary["Positive"]},
                    {Code: "neu", Label: currentDictionary["Neutral"]},
                    {Code: "neg", Label: currentDictionary["Negative"]}
                ];
                /*"TA_VIEW_BY": [],
                 "TA_ALL_CATEGORIES": [],
                 "TA_TOP_CATEGORIES_SINGLE": [],
                 "TA_SUB_CATEGORIES_SINGLE": [],
                 "TA_ATTRIBUTES_SINGLE": [],*/
            case "TA_COMMENTS_SENTIMENT":
                return [
                    {Code: "emptyv", Label: currentDictionary["All sentiments"]},
                    {Code: "pos", Label: currentDictionary["Positive"]},
                    {Code: "neu", Label: currentDictionary["Neutral"]},
                    {Code: "neg", Label: currentDictionary["Negative"]}
                ];
            case "TA_DISTRIBUTION_TOGGLE":
                return [
                    {Code: 0, Label: currentDictionary["Count"]},
                    {Code: 1, Label: "%"}
                ];
            case "TA_PERIOD":
                return [
                    {Code: "w", Label: currentDictionary["Weeks"]},
                    {Code: "m", Label: currentDictionary["Months"]},
                    {Code: "q", Label: currentDictionary["Quarters"]},
                    {Code: "y", Label: currentDictionary["Years"]}
                ];

            default:
                return [];
        }
    }

    private static function findValue(array, condition) {
        for(var i = 0; i < array.length; i++) {
            if(condition(array[i])) {
                return array[i];
            }
        }

        return null;
    }

    static function getParameterValue(state, currentDictionary, parameterID) {
        var parameterValue : ParameterValueResponse = state.Parameters[parameterID];
        var labels = ParameterValues.getParameterValues(currentDictionary, parameterID);
        var parameterValueLabel = ParameterValues.findValue(labels, function(item) { return item.Code == parameterValue.StringValue }).Label;
        return getParameterSpan(': ' + parameterValueLabel);
    }

    static function getCategoryParameterValue(context, currentDictionary, parameterID) {
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var parameterValueID = context.state.Parameters[parameterID].StringValue;

        var parameterValueLabel;
        try {
            parameterValueLabel = Config.GetTALibrary().GetFolderById(folderId).GetHierarchy().GetObjectById(parameterValueID).name;
        } catch(e) {
            parameterValueLabel = currentDictionary["-select-"];
        }

        return getParameterSpan(': ' + parameterValueLabel);
    }

    static function getViewByParameterValue(context, currentDictionary) {
        var parameterValueLabel = currentDictionary["-select-"];

        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var variables = folder.GetViewByVariables();
        var project = context.report.DataSource.GetProject(folder.GetDatasourceId());

        var parameterValue : ParameterValueResponse = context.state.Parameters['TA_VIEW_BY'];
        for( var i = 0; i < variables.length; i++){
            if(variables[i] == parameterValue.StringValue) {
                var question: Question = project.GetQuestion( variables[i] );
                parameterValueLabel = question.Title ? question.Title : variables[i]
            }
        }

        return getParameterSpan(' ' + parameterValueLabel);
    }

    private static function getParameterSpan(parameterValueLabel) {
        return '<span class="pdfExportVisibleOnly">' + parameterValueLabel + '</span>';
    }
}