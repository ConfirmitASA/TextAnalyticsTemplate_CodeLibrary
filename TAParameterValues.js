/**
 * @class TAParameterValues
 * @classdesc Class to buld parameters with static codes to get them in PDF view
 */
class TAParameterValues {
    /**
     * @memberof TAParameterValues
     * @private
     * @function  _getParameterValues
     * @param {Object} currentDictionary
     * @param {String} parameterId
     * @returns {Object[]}
     */
    private static function _getParameterValues(currentDictionary, parameterId) {
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

    /**
     * @memberof TAParameterValues
     * @private
     * @function  _findValue
     * @param {Object[]} array
     * @param {Function} condition
     * @returns {Object}
     */
    private static function _findValue(array, condition) {
        for(var i = 0; i < array.length; i++) {
            if(condition(array[i])) {
                return array[i];
            }
        }

        return null;
    }

    /**
     * @memberof TAParameterValues
     * @function  getParameterValue
     * @param {ReportState} state
     * @param {Object} currentDictionary
     * @param {String} parameterID
     *
     * @returns {String}
     */
    static function getParameterValue(state, currentDictionary, parameterID, log) {
        var parameterValue : ParameterValueResponse = state.Parameters[parameterID];
        var labels = TAParameterValues._getParameterValues(currentDictionary, parameterID);
        var parameterValueLabel = TAParameterValues._findValue(labels, function(item) { return item.Code == parameterValue.StringKeyValue }).Label;
        return _getParameterSpan(': ' + parameterValueLabel);
    }

    /**
     * @memberof TAParameterValues
     * @function  getCategoryParameterValue
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Object} currentDictionary
     * @param {String} parameterID
     *
     * @returns {String}
     */
    static function getCategoryParameterValue(context, currentDictionary, parameterID) {
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var parameterValueID = context.state.Parameters[parameterID].StringKeyValue;

        var parameterValueLabel;
        try {
            parameterValueLabel = Config.GetTALibrary().GetFolderById(folderId).GetHierarchy().GetObjectById(parameterValueID).name;
        } catch(e) {
            parameterValueLabel = currentDictionary["-select-"];
        }

        return _getParameterSpan(': ' + parameterValueLabel);
    }

    /**
     * @memberof TAParameterValues
     * @function  getViewByParameterValue
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Object} currentDictionary
     *
     * @returns {String}
     */
    static function getViewByParameterValue(context, currentDictionary) {
        var parameterValueLabel = currentDictionary["-select-"];

        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var variables = folder.GetViewByVariables();
        var project = context.report.DataSource.GetProject(folder.GetDatasourceId());

        var parameterValue : ParameterValueResponse = context.state.Parameters['TA_VIEW_BY'];
        for( var i = 0; i < variables.length; i++){
            if(variables[i] === parameterValue.StringKeyValue) {
                var question: Question = project.GetQuestion( variables[i] );
                parameterValueLabel = question.Title ? question.Title : variables[i]
            }
        }

        return _getParameterSpan(' ' + parameterValueLabel);
    }

    /**
     * @memberof TAParameterValues
     * @function  getCorrelationQuestionParameterValue
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Object} currentDictionary
     *
     * @returns {String}
     */
    static function getCorrelationQuestionParameterValue(context, currentDictionary) {
        var parameterValueLabel = '';

        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var variables = folder.GetCorrelationVariables();
        var project = context.report.DataSource.GetProject(folder.GetDatasourceId());

        var parameterValue : ParameterValueResponse = context.state.Parameters['TA_CORRELATION_QUESTION'];
        for( var i = 0; i < variables.length; i++){
            if(variables[i] === parameterValue.StringKeyValue) {
                var question: Question = project.GetQuestion( variables[i] );
                parameterValueLabel = question.Title ? question.Title : variables[i]
            }
        }

        return _getParameterSpan(': ' + parameterValueLabel);
    }

    /**
     * @memberof TAParameterValues
     * @private
     * @function  _getParameterSpan
     * @param {String} parameterValueLabel
     *
     * @returns {String}
     */
    private static function _getParameterSpan(parameterValueLabel) {
        return '<span class="pdfExportVisibleOnly">' + parameterValueLabel + '</span>';
    }
}