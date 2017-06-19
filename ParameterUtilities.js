/**
 * @class ParameterUtilities
 * @classdesc Class to work with different parameters
 *
 * @constructs ParameterUtilities
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 */
class ParameterUtilities {

    /**
     * @memberof ParameterUtilities
     * @instance
     * @function LoadParameterValues
     * @description function to load possible values to string response parameter
     * @param {Parameter} parameter
     * @param {Object[]} parameterValues - array of values like {Code: "AnswerCode", Label: "AnswerText"}
     */
    static function LoadParameterValues(params) {
        var parameter = params.parameter;
        var parameterValues = params.parameterValues;

        for (var i = 0; i < parameterValues.length; ++i) {
            var parameterValueResponse: ParameterValueResponse = new ParameterValueResponse();
            parameterValueResponse.StringKeyValue = parameterValues[i].Code;

            var labels: LanguageTextCollection = new LanguageTextCollection();
            labels.Add(new LanguageText(_globals.report.CurrentLanguage, parameterValues[i].Label));

            parameterValueResponse.LocalizedLabel = new Label(labels);
            parameterValueResponse.StringValue = parameterValues[i].Label;

            parameter.Items.Add(parameterValueResponse);
        }
    }

    /**
     * @memberof ParameterUtilities
     * @instance
     * @function GetCheckedValues
     * @description function to get checked values for the multi string response parameter
     * @param {String} parameterName
     * @returns {ParameterValueResponse[]}
     */
    static function GetCheckedValues(params) {
        var context = params.context;
        var parameterName = params.parameterName;

        var values = []
        if (!context.state.Parameters.IsNull(parameterName)) {
            var selected: ParameterValueMultiSelect = context.state.Parameters[parameterName],
                response: ParameterValueResponse;
            for (var i = 0; i < selected.Count; i++)
            {
                response = selected[i];
                values.push(response);
            }
        }
        return values
    }

    /**
     * @memberof ParameterUtilities
     * @instance
     * @function GetCheckedValues
     * @description function to set default value to parameters if they haven't been selected
     * @param {Object[]} valuesArray - array of objects like {Id: "ParameterId", Value: "defaultCode"}
     */
    static function SetDefaultParameterValues(params) {
        var context = params.context;
        var valuesArray = params.valuesArray;

        for (var i = 0; i < valuesArray.length; i++) {
            try {
                context.state.Parameters[valuesArray[i].Id] = new ParameterValueResponse(valuesArray[i].Value);
            } catch (e) {
                context.log.LogDebug(e);
            }
        }
    }

    static function SetDefaultParameterValuesForEmpty(params) {
    var context = params.context;
    var valuesArray = params.valuesArray;
        for (var i = 0; i < valuesArray.length; i++) {
            try {
                if (!context.state.Parameters.GetString(valuesArray[i].Id))
                    context.state.Parameters[valuesArray[i].Id] = new ParameterValueResponse(valuesArray[i].Value);
            } catch (e) {
                context.log.LogDebug(e);
            }
        }
    }

    /**
     * @memberof ParameterUtilities
     * @instance
     * @function GetCheckedValues
     * @description function to get checked codes for the multi string response parameter
     * @param {String} parameterName
     * @returns {String[]}
     */
    static function GetParameterCodes(params) {
        var context = params.context;
        var parameterName = parameterName.valuesArray;

        var parameterValues: ParameterValueMultiSelect = _globals.state.Parameters[parameterName]
        ? _globals.state.Parameters[parameterName]
        : ParameterValueMultiSelect(null);

        var codes = [];

        if (parameterValues != null) {
            for (var enumerator : Enumerator = new Enumerator(parameterValues);
            !enumerator.atEnd();
            enumerator.moveNext()
             ){
                var parameterValue: ParameterValueResponse = enumerator.item();
                codes.push(parameterValue.StringKeyValue);
            }
        }
        return codes;
    }
}