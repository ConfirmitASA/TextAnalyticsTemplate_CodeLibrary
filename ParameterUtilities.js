/**
 * @class ParameterUtilities
 * @classdesc Class to work with different parameters
 *
 * @constructs ParameterUtilities
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 */
class ParameterUtilities {
    private var _globals;

    function ParameterUtilities(globals) {
        _globals=globals
    }

    /**
     * @memberof ParameterUtilities
     * @instance
     * @function LoadParameterValues
     * @description function to load possible values to string response parameter
     * @param {Parameter} parameter
     * @param {Object[]} parameterValues - array of values like {Code: "AnswerCode", Label: "AnswerText"}
     */
    function LoadParameterValues(parameter, parameterValues) {
        for (var i=0; i<parameterValues.length; ++i) {
            var parameterValueResponse : ParameterValueResponse = new ParameterValueResponse();
            parameterValueResponse.StringKeyValue = parameterValues[i].Code;

            var labels : LanguageTextCollection = new LanguageTextCollection();
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
    function GetCheckedValues(parameterName){
        var values = []
        if(!_globals.state.Parameters.IsNull(parameterName))
        {
            var selected:ParameterValueMultiSelect = _globals.state.Parameters[parameterName],
            response: ParameterValueResponse;
            for(var i=0;i<selected.Count;i++) // add selected columns to the new column set
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
    function SetDefaultParameterValues(valuesArray){
        for( var i = 0; i < valuesArray.length; i++ ){
            try {
                _globals.log.LogDebug("val arr: "+valuesArray[i].Id+" : "+_globals.state.Parameters.GetString(valuesArray[i].Id));

                if (!_globals.state.Parameters.GetString(valuesArray[i].Id)) {
                    _globals.log.LogDebug("val arr val: "+valuesArray[i].Value);
                    _globals.state.Parameters[valuesArray[i].Id] = new ParameterValueResponse(valuesArray[i].Value);
                }
            }catch(e){
                _globals.log.LogDebug(e);
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
    function GetParameterCodes(parameterName) {
        var parameterValues : ParameterValueMultiSelect = _globals.state.Parameters[parameterName] ? _globals.state.Parameters[parameterName]: ParameterValueMultiSelect(null);
        var codes = [];
        if(parameterValues != null) {
            for (var enumerator : Enumerator = new Enumerator(parameterValues) ; !enumerator.atEnd(); enumerator.moveNext()) {
                var parameterValue : ParameterValueResponse = enumerator.item();
                codes.push(parameterValue.StringKeyValue);
            }

        }
        return codes;
    }
}