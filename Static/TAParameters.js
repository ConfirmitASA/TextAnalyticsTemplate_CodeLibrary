/**
 * @class TAParameters
 * @classdesc Static class for Reportal parameter components
 */
class TAParameters{
    /**
     * @memberof TAParameters
     * @function TA_FOLDERS_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_FOLDERS_Domain(context){
        TAParametersBuilder.RenderFoldersParameter({
            context: context
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_LEVEL_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_LEVEL_Domain(context){
        TAParametersBuilder.RenderLevelsParameter({context: context});
    }

    /**
     * @memberof TAParameters
     * @function TA_COMPARE_PERIODS_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_COMPARE_PERIODS_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var parameterValues = [
            {Code: "wow", Label: currentDictionary["Current vs Last Week"]},
            {Code: "mom", Label: currentDictionary["Current vs Last Month"]},
            {Code: "qoq", Label: currentDictionary["Current vs Last Quarter"]},
            {Code: "yoy", Label: currentDictionary["Current vs Last Year"]}
        ];

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_PERIOD_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_PERIOD_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var parameterValues = [
            {Code: "w", Label: currentDictionary["Weeks"]},
            {Code: "m", Label: currentDictionary["Months"]},
            {Code: "q", Label: currentDictionary["Quarters"]},
            {Code: "y", Label: currentDictionary["Years"]}
        ];

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_TOP_CATEGORIES_SINGLE_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_ALL_CATEGORIES_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        TAParametersBuilder.RenderAllCategoriesParameter({
            context: context,
            emptyValueLabel: currentDictionary["-select-"]
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_TOP_CATEGORIES_SINGLE_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_TOP_CATEGORIES_SINGLE_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        TAParametersBuilder.RenderLevelCategoriesParameter({
            context: context,
            level: 0,
            emptyValueLabel: currentDictionary["-select-"]
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_SUB_CATEGORIES_SINGLE_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_SUB_CATEGORIES_SINGLE_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        TAParametersBuilder.RenderLevelCategoriesParameter({
            context: context,
            level: 1,
            emptyValueLabel: currentDictionary["-select-"]
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_ATTRIBUTES_SINGLE_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_ATTRIBUTES_SINGLE_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        TAParametersBuilder.RenderLevelCategoriesParameter({
            context: context,
            level: 2,
            emptyValueLabel: currentDictionary["-select-"]
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_SUB_CATEGORIES_SINGLE_Mask
     * @param {Object} context - {component: mask, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_SUB_CATEGORIES_SINGLE_Mask(context){
        var category = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");

        if(category && category !== "emptyv")
            TAParametersBuilder.MaskSelectedCategoryChildren({
                context: context,
                category: category,
                addEmpty: true
            });
    }

    /**
     * @memberof TAParameters
     * @function TA_ATTRIBUTES_SINGLE_Mask
     * @param {Object} context - {component: mask, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_ATTRIBUTES_SINGLE_Mask(context){
        var category = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");

        if(category && category !== "emptyv")
            TAParametersBuilder.MaskSelectedCategoryChildren({
                context: context,
                category: category,
                addEmpty: true
            });
    }

    /**
     * @memberof TAParameters
     * @function TA_VIEW_SENTIMENT_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_VIEW_SENTIMENT_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var parameterValues = [
            {Code: "emptyv", Label: currentDictionary["All sentiments"]},
            {Code: "pos", Label: currentDictionary["Positive"]},
            {Code: "neu", Label: currentDictionary["Neutral"]},
            {Code: "neg", Label: currentDictionary["Negative"]}
        ];

        //var parameterValues = TAParameterValues._getParameterValues(currentDictionary, 'TA_VIEW_SENTIMENT');

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_DISTRIBUTION_TOGGLE_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_DISTRIBUTION_TOGGLE_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var parameterValues = [
            {Code: 0, Label: currentDictionary["Count"]},
            {Code: 1, Label: "%"}
        ];

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_VIEW_BY_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_VIEW_BY_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        TAParametersBuilder.RenderViewByParameter({
            context: context,
            emptyValueLabel: currentDictionary["-select-"]
        });
    }

    /**
     * @memberof TAParameters
     * @function TA_HIDE_EMPTY_ROWS_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_HIDE_EMPTY_ROWS_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var parameterValues = [
            {Code: "hide", Label: currentDictionary["Hide categories with no hits"]}
        ];

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParameters
     * @function FILTER_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function FILTER_Domain(context, filterNumber){
        Config.SetTALibrary(context);
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new TAFilterComponents(context);

        var filterQuestion = filterComponents.GetFilterQuestion(filterNumber -1 );
        if(filterQuestion){
            var parameterValues = [];
            var answers = filterQuestion.GetAnswers()
            for( var i = 0; i < answers.length; i++){
                parameterValues.push({
                    Code: answers[i].Precode,
                    Label: answers[i].Text
                });
            }

            TAParameterUtilities.LoadParameterValues({
                context: context,
                parameterValues: parameterValues
            });
        }
    }

    /**
     * @memberof TAParameters
     * @function TA_TOGGLE_CHART_Domain
     * @param {Object} context - {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function TA_TOGGLE_CHART_Domain(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var parameterValues = [
            {Code: "toggle", Label: currentDictionary["Toggle chart view"]}
        ];

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameterValues: parameterValues
        });
    }
}