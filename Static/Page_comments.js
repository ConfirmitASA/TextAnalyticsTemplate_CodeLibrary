/**
 * @class Page_comments
 * @classdesc Static class for Reportal Page comments components
 */
class Page_comments{

    /**
     * @memberof Page_comments
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){
        return false;
    }

    /**
     * @memberof Page_comments
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);

        initiateParameters(context);

        var taLibrary = Config.GetTALibrary();

        initializeFilters({context: context, taLibrary: taLibrary});

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        TAParameters.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_TOP_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            attributesParameter: "TA_ATTRIBUTES_SINGLE"

        });

        TAParameters.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_ATTRIBUTES_SINGLE"
        });

        processSelectedCategoryParameter({
            context: context,
            folder: selectedFolder
        })
    }

    static function initiateParameters(context){
        //TODO: refactor setting default parameters
        if(context.component.SubmitSource === "lstQuestions") {
            ParameterUtilities.SetDefaultParameterValues(
                {
                    context: context,
                    parameterValues: DefaultParameters.values
                }
            )
        }

        TAHelper.SetLastVisitedPage(context, "comments");

        ParameterUtilities.SetDefaultParameterValuesForEmpty({
            context: context,
            parameterValues: DefaultParameters.values.concat(
                {
                    Id: "TA_FOLDERS",
                    Value: (Config.TAQuestions[0].TAQuestionName+Config.TAQuestions[0].TAModelNo)
                }
            )
        });
    }

    static function initializeFilters(params){
        var context = params.context;
        var taLibrary = params.taLibrary;
        //TODO: clarify what to do with filter components

        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: taLibrary.GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        if(context.component.SubmitSource == "ClearFilters"){
            filterComponents.ClearFilters(context);

            var dateParameters = DefaultParameters.dateParameters;

            for(var i = 0; i < dateParameters.length; ++i)
                context.state.Parameters[dateParameters[i]] = null;
        }
    }

    static function processSelectedCategoryParameter(params){
        var context = params.context;
        var folder = params.folder;
        var submitSource = context.component.SubmitSource;
        var selectedCategory;
        if(submitSource === "lstCategory" || submitSource === "lstSubCategory" || submitSource === "lstAttribute"){
            selectedCategory = TAParameters.GetSelectedCategory({
                context: context,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });

            context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse(selectedCategory);
        }else {
            selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
            TAParameters.SetSelectedCategory({
                context: context,
                hierarchy: folder.GetHierarchy(),
                allCategoriesParameterValue: selectedCategory,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });
        }
    }

    /**
     * @memberof Page_comments
     * @function htlComments_Hide
     * @description function to hide the hitlist
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function htlComments_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function htlComments_Render
     * @description function to render the hitlist
     * @param {Object} context - {component: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function htlComments_Render(context){
        if(!Config.GetTALibrary()){
            Config.SetTALibrary(context);
        }

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        var htlComments = new TAHitlistUtils({context: context, folder: selectedFolder});

        if( selectedCategory && selectedCategory !== "emptyv" ){
            htlComments.AddTAColumn({
                context: context,
                columnName:"categorysentiment",
                sortable: false,
                postfix: selectedCategory
            });
        }
        htlComments.AddTAColumn({context: context, columnName: "verbatim"});

        htlComments.AddColumn({
            context: context,
            columnName: selectedFolder.GetTimeVariableId(),
            sortable: true
        });

        htlComments.AddTAColumn({context: context, columnName: "overallsentiment"});
        htlComments.AddTAColumn({context: context, columnName: "categories"});
        htlComments.AddConfiguredColumns(context);
    }

    /**
     * @memberof Page_comments
     * @function txtCommentsScript_Hide
     * @description function to hide the text
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCommentsScript_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtCommentsScript_Render
     * @description function to render the script which processes hitlist
     * @param {Object} context - {component: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCommentsScript_Render(context){
        var hitlistInit = "<script>"+
                "Y.Global.on('hitlistloaded', function (e) {  "+
                    "var upgradedHitlist = new Reportal.Hitlist({"+
                        "hitlist: document.querySelector('.reportal-hitlist-container'),"+
                        "headers: hitlistHeaders,"+
                        "sentimentConfig: sentimentConfig"+
                    "});"+
                "});"+
            "</script>";
        var hitlistHeaders = {};
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        hitlistHeaders["sentiment"] = []

        if( selectedCategory && selectedCategory !== "emptyv"){
            hitlistHeaders["sentiment"].push( {
                    name: selectedFolder.GetQuestionId("categorysentiment")+"_"+selectedCategory
            } );
        }

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        hitlistHeaders["verbatim"] = [{
            name: selectedFolder.GetQuestionId(),
            title: currentDictionary["Comments"],
            main: true
        }];

        hitlistHeaders["date"] = [{
            name: selectedFolder.GetTimeVariableId() ? selectedFolder.GetTimeVariableId() : "interview_start",
            title: currentDictionary["Date"]
        }];


            hitlistHeaders["categories"] = [{
                name: selectedFolder.GetQuestionId("categories")
            }];


        hitlistHeaders["sentiment"].push( {
            name: selectedFolder.GetQuestionId("overallSentiment"),
            title: currentDictionary["Overall Sentiment"]
        });

        hitlistHeaders["other"] = [];

        var hitlistColumns = selectedFolder.GetHitlistColumns();
        for(var i = 0 ; i < hitlistColumns.length; i++){
            hitlistHeaders["other"].push( {
                name: hitlistColumns[i]
            });
        }
    //TODO: configurable range of sentiments
        var sentimentConfig = [
            {
                sentiment: "positive",
                range: {min: (Config.SentimentRange.Positive[0]-6), max: (Config.SentimentRange.Positive[Config.SentimentRange.Positive.length - 1]-6)}
            },
            {
                sentiment: "neutral",
                range: {min: (Config.SentimentRange.Neutral[0]-6), max: (Config.SentimentRange.Neutral[Config.SentimentRange.Neutral.length - 1]-6)}
            },
            {
                sentiment: "negative",
                range: {min: (Config.SentimentRange.Negative[0]-6), max: (Config.SentimentRange.Negative[Config.SentimentRange.Negative.length - 1]-6)}
            }
        ];

        context.component.Output.Append(JSON.print(hitlistHeaders, "hitlistHeaders"));
        context.component.Output.Append(JSON.print(sentimentConfig,"sentimentConfig"));
        context.component.Output.Append(hitlistInit);
    }

    /**
     * @memberof Page_comments
     * @function lstCategory_Hide
     * @description function to hide the Category selector
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstCategory_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function lstSubCategory_Hide
     * @description function to hide the Sub Category selector
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstSubCategory_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || selectedFolder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_comments
     * @function lstAttribute_Hide
     * @description function to hide the Attribute selector
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstAttribute_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || selectedFolder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_comments
     * @function txtCategory_Hide
     * @description function to hide the Category selector label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCategory_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtCategory_Render
     * @description function to render the Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCategory_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Category"];
        context.component.Output.Append(label);
    }


    /**
     * @memberof Page_comments
     * @function txtSubCategory_Hide
     * @description function to hide the the sub category list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSubCategory_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || selectedFolder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSubCategory_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Sub category"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_comments
     * @function txtAttribute_Hide
     * @description function to hide the the attributes list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtAttribute_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || selectedFolder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
    }

    /**
     * @memberof Page_comments
     * @function txtAttribute_Render
     * @description function to render the attributes selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtAttribute_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Attribute"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_comments
     * @function txtSentiment_Hide
     * @description function to hide the the sentiment list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSentiment_Hide(context){
        return false
    }

    /**
     * @memberof Page_comments
     * @function txtAttribute_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSentiment_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Sentiment"];
        context.component.Output.Append(label);
    }

    static function txtFilterTitle_Hide(context, filterNumber){
        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: Config.GetTALibrary().GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        return FilterPanel.txtFilterTitle_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });

    }

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: Config.GetTALibrary().GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        FilterPanel.txtFilterTitle_Render({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof Page_filters
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: Config.GetTALibrary().GetFilterQuestions(),
            dataSource: Config.DS_Main
        });

        return FilterPanel.lstFilterList_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }
}