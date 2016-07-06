class Parameters {

    static function TA_LEVEL_Domain(context){
    var parameterValues = [{Code: "themes", Label: "1st level (category)"},{Code: "categories", Label: "2nd level (sub-category)"}]
    if(TALibrary.currentQuestion.attributes.length>0){
        parameterValues.push({Code: "attributes", Label: "3rd level (attributes)"});
    }
    ParameterUtilities.LoadParameterValues(context.report, context.component, parameterValues);
}

    static function TA_COMPARE_PERIODS_Domain(context){
    var parameterValues = [
        {Code: "wow", Label: "Current vs Last Week"},
        {Code: "qoq", Label: "Current vs Last Quarter"},
        {Code: "mom", Label: "Current vs Last Month"},
        {Code: "yoy", Label: "Current vs Last Year"}
    ]
    ParameterUtilities.LoadParameterValues(context.report, context.component, parameterValues);
}

    static function TA_VIEW_SENTIMENT_Domain(context){
    var parameterValues = [
        {Code: "all", Label: "All sentiments"},
        {Code: "neg", Label: "Negative"},
        {Code: "neu", Label: "Neutral"},
        {Code: "pos", Label: "Positive"}
    ]
    ParameterUtilities.LoadParameterValues(context.report, context.component, parameterValues);
}


    static function COMPARATIVE_RATING_METRICS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function COMPARATIVE_RATING_NESTING_1_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function COMPARATIVE_RATING_NESTING_2_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function COMPARATIVE_RATING_STATISTICS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_BASE_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_DECIMALS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_INDIVIDUAL_SCORES_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_QUESTIONS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_SIGTEST_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_STATS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_TOTALS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_TRENDING_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function CROSSTAB_TRENDING_INTERVAL_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function FREQUENCY_DISTRIBUTION_QUESTION_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function FREQUENCY_DISTRIBUTION_QUESTIONS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function POSITIONING_DEMOGRAPHIC_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function POSITIONING_METRIC_1_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function POSITIONING_METRIC_2_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function RESPONSERATE_INTERVAL_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function RESPONSERATE_LABELS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function RESPONSERATE_TRENDUNIT_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function TRENDPAGE_INTERVAL_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}


    static function TRENDPAGE_LABELS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}


    static function TRENDPAGE_METRIC_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}


    static function TRENDPAGE_STATISTIC_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}


    static function TRENDPAGE_UNIT_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}


    static function VERBATIM_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function VERBATIM_DEMOGRAPHICS_Domain(context) {
    ParameterLoadedFromScript_Domain(context);
}

    static function ParameterLoadedFromScript_Domain(context) {
    var parameterValues = ParameterLists.GetParameterValues(context.Component.ParameterId, context.Report, context.Log);
    ParameterUtilities.LoadParameterValues(context.Report, context.Component, parameterValues);
}

    static function FILTER1_Domain(context) {
    var filterNumber = 1;
    Filters_Domain(context, filterNumber);
}

    static function FILTER2_Domain(context) {
    var filterNumber = 2;
    Filters_Domain(context, filterNumber);
}

    static function FILTER3_Domain(context) {
    var filterNumber = 3;
    Filters_Domain(context, filterNumber);
}

    static function FILTER4_Domain(context) {
    var filterNumber = 4;
    Filters_Domain(context, filterNumber);
}

    static function FILTER5_Domain(context) {
    var filterNumber = 5;
    Filters_Domain(context, filterNumber);
}

    static function FILTER6_Domain(context) {
    var filterNumber = 6;
    Filters_Domain(context, filterNumber);
}

    static function FILTER7_Domain(context) {
    var filterNumber = 7;
    Filters_Domain(context, filterNumber);
}

    static function FILTER8_Domain(context) {
    var filterNumber = 8;
    Filters_Domain(context, filterNumber);
}

    static function FILTER9_Domain(context) {
    var filterNumber = 9;
    Filters_Domain(context, filterNumber);
}

    static function FILTER10_Domain(context) {
    var filterNumber = 10;
    Filters_Domain(context, filterNumber);
}

    static function FILTER11_Domain(context) {
    var filterNumber = 11;
    Filters_Domain(context, filterNumber);
}

    static function FILTER12_Domain(context) {
    var filterNumber = 12;
    Filters_Domain(context, filterNumber);
}

    static function FILTER13_Domain(context) {
    var filterNumber = 13;
    Filters_Domain(context, filterNumber);
}

    static function FILTER14_Domain(context) {
    var filterNumber = 14;
    Filters_Domain(context, filterNumber);
}

    static function FILTER15_Domain(context) {
    var filterNumber = 15;
    Filters_Domain(context, filterNumber);
}

    static function FILTER16_Domain(context) {
    var filterNumber = 16;
    Filters_Domain(context, filterNumber);
}

    static function FILTER17_Domain(context) {
    var filterNumber = 17;
    Filters_Domain(context, filterNumber);
}

    static function FILTER18_Domain(context) {
    var filterNumber = 18;
    Filters_Domain(context, filterNumber);
}

    static function FILTER19_Domain(context) {
    var filterNumber = 19;
    Filters_Domain(context, filterNumber);
}

    static function FILTER20_Domain(context) {
    var filterNumber = 20;
    Filters_Domain(context, filterNumber);
}

    static function FILTER21_Domain(context) {
    var filterNumber = 21;
    Filters_Domain(context, filterNumber);
}

    static function FILTER22_Domain(context) {
    var filterNumber = 22;
    Filters_Domain(context, filterNumber);
}

    static function FILTER23_Domain(context) {
    var filterNumber = 23;
    Filters_Domain(context, filterNumber);
}

    static function FILTER24_Domain(context) {
    var filterNumber = 24;
    Filters_Domain(context, filterNumber);
}

    static function FILTER25_Domain(context) {
    var filterNumber = 25;
    Filters_Domain(context, filterNumber);
}

    static function FILTER26_Domain(context) {
    var filterNumber = 26;
    Filters_Domain(context, filterNumber);
}

    static function FILTER27_Domain(context) {
    var filterNumber = 27;
    Filters_Domain(context, filterNumber);
}

    static function FILTER28_Domain(context) {
    var filterNumber = 28;
    Filters_Domain(context, filterNumber);
}

    static function FILTER29_Domain(context) {
    var filterNumber = 29;
    Filters_Domain(context, filterNumber);
}

    static function FILTER30_Domain(context) {
    var filterNumber = 30;
    Filters_Domain(context, filterNumber);
}

    static function Filters_Domain(context, filterNumber) {
    var parameterList = FilterParameterLists.GetFilterOptions(context.Report, filterNumber, context.Log);
    if(parameterList != null) {
        ParameterUtilities.LoadParameterValues(context.Report, context.Component, parameterList);
    }
}

    static function ParameterName_Mask(context) {
}

    static function ParameterName_FilterSummary(context) {
}
}