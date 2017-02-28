/**
 * @class Page_comments
 * @classdesc Static class for Reportal Page comments components
 */
class Page_comments{
    private static var _filterComponents;
    private static var _filter_panel;
    private static var _folder;
    private static var _selectedCategory;
    private static const _defaultParameters = [
        {
            Id: "TA_ALL_CATEGORIES",
            Value: "emptyv"
        },
        {
            Id: "TA_TOP_CATEGORIES_SINGLE",
            Value: "emptyv"
        },
        {
            Id: "TA_SUB_CATEGORIES_SINGLE",
            Value: "emptyv"
        },
        {
            Id: "TA_ATTRIBUTES_SINGLE",
            Value: "emptyv"
        },
        {
            Id: "TA_COMMENTS_SENTIMENT",
            Value: "emptyv"
        },
        {
            Id: "TA_FOLDERS",
            Value: Config.TAQuestions[0].TAFolderId
        }
    ];

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
    Config.SetTALibrary(TAHelper.GetGlobals(context));
    _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(), Config.DS_Main);
        if(context.component.SubmitSource == "ClearFilters"){
            _filterComponents.ClearFilters();
            context.state.Parameters["TA_DATE_FROM"] = null;
            context.state.Parameters["TA_DATE_TO"] = null;
        }

        if(context.component.SubmitSource == "lstQuestions") {
            context.state.Parameters["TA_ALL_CATEGORIES"] = null;
            context.state.Parameters["TA_ATTRIBUTES_SINGLE"] = null;
            context.state.Parameters["TA_LEVEL"] = null;
            context.state.Parameters["TA_SUB_CATEGORIES_SINGLE"] = null;
            context.state.Parameters["TA_TOP_CATEGORIES_SINGLE"] = null;
            context.state.Parameters["TA_VIEW_BY"] = null;
        }

        TAHelper.SetLastVisitedPage(TAHelper.GetGlobals(context), "comments");
        var paramUtils = new ParameterUtilities(TAHelper.GetGlobals(context));

        paramUtils.SetDefaultParameterValues(_defaultParameters);

        var taParams  = new TAParameters(TAHelper.GetGlobals(context), Config.GetTALibrary());
        //context.log.LogDebug("page render: "+context.state.Parameters["TA_FOLDERS"]);
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        /*try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        } catch(e){
            selectedFolder = null;
        }*/
    _folder = Config.GetTALibrary().GetFolderById(selectedFolder);

    _filter_panel = new FilterPanel(_filterComponents);
        taParams.ClearSubcategoriesParameters(selectedFolder, "emptyv", "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
        taParams.ClearSubcategoriesParameters(selectedFolder, "emptyv", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");

    if(context.component.SubmitSource == "lstCategory" || context.component.SubmitSource == "lstSubCategory" || context.component.SubmitSource == "lstAttribute"){
        _selectedCategory = TAHelper.GetSelectedCategory(context.state, "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE");
        context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse(_selectedCategory);
    }else {
        _selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
        TAHelper.SetSelectedCategory(context.state, _folder.GetHierarchy(), _selectedCategory, "TA_TOP_CATEGORIES_SINGLE", "TA_SUB_CATEGORIES_SINGLE", "TA_ATTRIBUTES_SINGLE",context.log);
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
            Config.SetTALibrary(TAHelper.GetGlobals(context));
        }
        if(!_folder){
            //context.log.LogDebug("htl render: "+context.state.Parameters["TA_FOLDERS"]);
            //var selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
            //_folder =Config.GetTALibrary().GetFolderById(selectedFolder);

            var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
			/*try {
				selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
			} catch(e){
				selectedFolder = null;
			}*/
			 _folder = Config.GetTALibrary().GetFolderById(selectedFolder);
			
			
        }
        var htlComments = new TAHitlistUtils(TAHelper.GetGlobals(context), _folder, context.component);
        var selectedCategory = _selectedCategory
        if( selectedCategory && selectedCategory != "emptyv" ){
            htlComments.AddTAColumn("categorysentiment", false, selectedCategory);

        }
        htlComments.AddTAColumn("verbatim");
        htlComments.AddColumn(_folder.GetTimeVariableId(), true);
        htlComments.AddTAColumn("overallsentiment");
        //htlComments.AddTAColumn("categories");
        htlComments.AddConfiguredColumns();
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

        var selectedCategory = _selectedCategory;

        hitlistHeaders["sentiment"] = []

        if( selectedCategory && selectedCategory != "emptyv"){
            hitlistHeaders["sentiment"].push( {
                    name: _folder.GetQuestionId("categorysentiment")+"_"+selectedCategory
            } );
        }

        hitlistHeaders["verbatim"] = [{
            name: _folder.GetQuestionId(),
            title: "Comments",
            main: true
        }];

        hitlistHeaders["date"] = [{
            name: _folder.GetTimeVariableId() ? _folder.GetTimeVariableId() : "interview_start",
            title: "Date"
        }];

        /*
            hitlistHeaders["categories"] = {
                name: _folder.GetQuestionId("categories")
            };
         */

        hitlistHeaders["sentiment"].push( {
            name: _folder.GetQuestionId("overallSentiment"),
            title: "Overall Sentiment"
        });

        hitlistHeaders["other"] = [];

        var hitlistColumns = _folder.GetHitlistColumns();
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
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
    }

    /**
     * @memberof Page_comments
     * @function lstAttribute_Hide
     * @description function to hide the Attribute selector
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstAttribute_Hide(context){
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
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
        var label = "Category";
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
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
    }

    /**
     * @memberof Page_comments
     * @function txtSubCategory_Render
     * @description function to render the sub Category selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSubCategory_Render(context){
        var label = "Sub category";
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
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue == "emptyv" || _folder.GetHierarchy().GetObjectById(parameterValue).subcells.length == 0)
    }

    /**
     * @memberof Page_comments
     * @function txtAttribute_Render
     * @description function to render the attributes selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtAttribute_Render(context){
        var label = "Attribute";
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
        var label = "Sentiment";
        context.component.Output.Append(label);
    }

    static function txtFilterTitle_Hide(context, filterNumber){
    return _filter_panel.txtFilterTitle_Hide(context, filterNumber);
}

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
    _filter_panel.txtFilterTitle_Render(context, filterNumber);
}

    /**
     * @memberof Page_filters
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
    return _filter_panel.lstFilterList_Hide(context, filterNumber);
}
}