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

        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "comments");
        TAPageRenderer.ClearCategoriesParameters(context);
        TAPageRenderer.ProcessSelectedCategoryParameter(context);
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
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        var htlComments = new TAHitlistUtils({context: context, folder: folder});

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
            columnName: folder.GetTimeVariableId(),
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
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var textSeparator = folder.GetHierarchy().GetTextSeparator();

        var hitlistInit = "<script>"+
                "Y.Global.on('hitlistloaded', function (e) {  "+
                    "var upgradedHitlist = new Reportal.Hitlist({"+
                        "hitlist: document.querySelector('.reportal-hitlist-container'),"+
                        "separator: '" + (textSeparator ? textSeparator : "") + "',"+
                        "headers: hitlistHeaders,"+
                        "sentimentConfig: sentimentConfig,"+
                        "currentCategory: currentCategory"+
                    "});"+
                "});"+
            "</script>";

        var hitlistHeaders = {};
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
        var currentCategory = "";
        if(selectedCategory && selectedCategory !== "emptyv" && Config.ShowOnlySelectedCategoryTagInHitlist)
            currentCategory = folder.GetHierarchy().GetObjectById(selectedCategory).text;

        hitlistHeaders["sentiment"] = [];

        if( selectedCategory && selectedCategory !== "emptyv"){
            hitlistHeaders["sentiment"].push( {
                    name: folder.GetQuestionId("categorysentiment")+"_"+selectedCategory
            } );
        }

        var currentLanguage = context.report.CurrentLanguage;

        var currentDictionary = Translations.dictionary(currentLanguage);

        hitlistHeaders["verbatim"] = [{
            name: folder.GetQuestionId(),
            title: currentDictionary["Comments"],
            main: true
        }];

        hitlistHeaders["date"] = [{
            name: folder.GetTimeVariableId() ? folder.GetTimeVariableId() : "interview_start",
            title: currentDictionary["Date"]
        }];


            hitlistHeaders["categories"] = [{
                name: folder.GetQuestionId("categories")
            }];


        hitlistHeaders["sentiment"].push( {
            name: folder.GetQuestionId("overallSentiment"),
            title: currentDictionary["Overall Sentiment"]
        });

        hitlistHeaders["other"] = [];

        var hitlistColumns = folder.GetHitlistColumns();

        for(var i = 0 ; i < hitlistColumns.length; i++){
            hitlistHeaders["other"].push( {
                name: hitlistColumns[i]
            });
        }

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
        context.component.Output.Append(JSON.print(currentCategory,"currentCategory"));
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
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder)
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
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
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
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
        context.component.Output.Append(TAParameterValues.getCategoryParameterValue(context, currentDictionary, 'TA_TOP_CATEGORIES_SINGLE'));
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
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
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
        context.component.Output.Append(TAParameterValues.getCategoryParameterValue(context, currentDictionary, 'TA_SUB_CATEGORIES_SINGLE'));
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
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
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
        context.component.Output.Append(TAParameterValues.getCategoryParameterValue(context, currentDictionary, 'TA_ATTRIBUTES_SINGLE'));
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
     * @function txtSentiment_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSentiment_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Sentiment"];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getParameterValue(context.state, currentDictionary, 'TA_COMMENTS_SENTIMENT'));
    }
}