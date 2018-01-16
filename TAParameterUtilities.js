/**
 * @class TAParameterUtilities
 * @classdesc Class to work with different parameters
 */
class TAParameterUtilities {
    /**
     * @memberof TAParameterUtilities
     * @function LoadParameterValues
     * @description function to load possible values to string response parameter
     * @param {Object} params - {
     *          context: {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          parameterValues: {Object][} - array of values like {Code: "AnswerCode", Label: "AnswerText"
     *      }
     * @param {Object[]}
     */
    static function LoadParameterValues(params) {
        var context = params.context;
        var parameter = context.component;
        var parameterValues = params.parameterValues;

        for (var i = 0; i < parameterValues.length; ++i) {
            var parameterValueResponse: ParameterValueResponse = new ParameterValueResponse();
            parameterValueResponse.StringKeyValue = parameterValues[i].Code;

            var labels: LanguageTextCollection = new LanguageTextCollection();
            labels.Add(new LanguageText(context.report.CurrentLanguage, parameterValues[i].Label));

            parameterValueResponse.LocalizedLabel = new Label(labels);
            parameterValueResponse.StringValue = parameterValues[i].Label;

            parameter.Items.Add(parameterValueResponse);
        }
    }

    /**
     * @memberof TAParameterUtilities
     * @function GetCheckedValues
     * @description function to get checked values for the multi string response parameter
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          parameterName: {String}
     *      }
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
     * @memberof TAParameterUtilities
     * @function SetDefaultParameterValues
     * @description function to set default value to parameters
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          parameterValues: {Object[]} valuesArray - array of objects like {Id: "ParameterId", Value: "defaultCode"}
     *       }
     */
    static function SetDefaultParameterValues(params) {
        var context = params.context;
        var parameterValues = params.parameterValues;

        for (var i = 0; i < parameterValues.length; i++) {
            try {
                context.state.Parameters[parameterValues[i].Id] = new ParameterValueResponse(parameterValues[i].Value);
            } catch (e) {
                context.log.LogDebug(e + 'HERE 1');
            }
        }
    }

    /**
     * @memberof TAParameterUtilities
     * @function SetDefaultParameterValuesForEmpty
     * @description function to set default value to parameters only if they haven't been selected
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          parameterValues: {Object[]} valuesArray - array of objects like {Id: "ParameterId", Value: "defaultCode"}
     *       }
     */
    static function SetDefaultParameterValuesForEmpty(params) {
        var context = params.context;
        var parameterValues = params.parameterValues;
        for (var i = 0; i < parameterValues.length; i++) {
            try {
                if (!context.state.Parameters.GetString(parameterValues[i].Id)) {
                    context.state.Parameters[parameterValues[i].Id] = new ParameterValueResponse(parameterValues[i].Value);
                }
            } catch (e) {
                context.log.LogDebug(e  + 'HERE 2');
            }
        }
    }

    /**
     * @memberof TAParameterUtilities
     * @function GetParameterCodes
     * @description function to get function to get selected keys from multi parameter
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          parameterValues: {Object[]} valuesArray - array of objects like {Id: "ParameterId", Value: "defaultCode"}
     *       }
     */
    static function GetParameterCodes(params) {
        var context = params.context;
        var parameterName = params.parameterName;

        var parameterValues: ParameterValueMultiSelect = context.state.Parameters[parameterName]
        ? context.state.Parameters[parameterName]
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