class ParameterValues {
    private static function calculateParameterValues(currentDictionary) {
        return {
            "TA_LEVEL": [
                {Code: "0", Label: currentDictionary["1st level (category)"]},
                {Code: "1", Label: currentDictionary["2nd level (sub-category)"]},
                {Code: "2", Label: currentDictionary["3rd level (attributes)"]}
            ],
            "TA_COMPARE_PERIODS": [
                {Code: "wow", Label: currentDictionary["Current vs Last Week"]},
                {Code: "mom", Label: currentDictionary["Current vs Last Month"]},
                {Code: "qoq", Label: currentDictionary["Current vs Last Quarter"]},
                {Code: "yoy", Label: currentDictionary["Current vs Last Year"]}
            ],
            "TA_VIEW_SENTIMENT": [
                {Code: "emptyv", Label: currentDictionary["All sentiments"]},
                {Code: "pos", Label: currentDictionary["Positive"]},
                {Code: "neu", Label: currentDictionary["Neutral"]},
                {Code: "neg", Label: currentDictionary["Negative"]}
            ],
            /*"TA_VIEW_BY": [],
            "TA_ALL_CATEGORIES": [],
            "TA_TOP_CATEGORIES_SINGLE": [],
            "TA_SUB_CATEGORIES_SINGLE": [],
            "TA_ATTRIBUTES_SINGLE": [],*/
            "TA_COMMENTS_SENTIMENT": [
                {Code: "emptyv", Label: currentDictionary["All sentiments"]},
                {Code: "pos", Label: currentDictionary["Positive"]},
                {Code: "neu", Label: currentDictionary["Neutral"]},
                {Code: "neg", Label: currentDictionary["Negative"]}
            ],
            "TA_DISTRIBUTION_TOGGLE": [
                {Code: 0, Label: currentDictionary["Count"]},
                {Code: 1, Label: "%"}
            ],
            "TA_PERIOD": [
                {Code: "w", Label: currentDictionary["Weeks"]},
                {Code: "m", Label: currentDictionary["Months"]},
                {Code: "q", Label: currentDictionary["Quarters"]},
                {Code: "y", Label: currentDictionary["Years"]}
            ]
        };
    }

    private static function getParameterValues(currentDictionary, parameterId) {
        var values = calculateParameterValues(currentDictionary);
        return values[parameterId];
    }

    /*static function getParameterValues_TA_LEVEL(currentDictionary) {
        return [
            {Code: "0", Label: currentDictionary["1st level (category)"]},
            {Code: "1", Label: currentDictionary["2nd level (sub-category)"]},
            {Code: "2", Label: currentDictionary["3rd level (attributes)"]}
        ]
    }

    static function getParameterValues_TA_COMPARE_PERIODS(currentDictionary) {
        return [
            {Code: "wow", Label: currentDictionary["Current vs Last Week"]},
            {Code: "mom", Label: currentDictionary["Current vs Last Month"]},
            {Code: "qoq", Label: currentDictionary["Current vs Last Quarter"]},
            {Code: "yoy", Label: currentDictionary["Current vs Last Year"]}
        ]
    }*/

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
        return '<span class="pdfExportVisibleOnly">: ' + parameterValueLabel + '</span>';
    }
}