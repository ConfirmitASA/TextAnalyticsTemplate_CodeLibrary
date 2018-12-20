class TAHitlistComponent {
    /**
     * @memberof TAHitlistComponent
     * @function txtCommentsTitle_Render
     * @description function to render the hitlist title
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCommentsTitle_Render(context) {
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        context.component.Output.Append(currentDictionary['Comments']);
    }

    /**
     * @memberof TAHitlistComponent
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
                sortable: true,
                postfix: selectedCategory
            });
        }

        htlComments.AddTAColumn({context: context, columnName: "verbatim", sortable: true});

        htlComments.AddColumn({
            context: context,
            columnName: folder.GetTimeVariableId(),
            sortable: true
        });

        htlComments.AddTAColumn({context: context, columnName: "overallsentiment", sortable: true});
        htlComments.AddTAColumn({context: context, columnName: "categories"});

        htlComments.AddConfiguredColumns(context);
    }

    /**
     * @memberof TAHitlistComponent
     * @function txtCommentsScript_Render
     * @description function to render the script which processes hitlist
     * @param {Object} context - {component: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCommentsScript_Render(context, isAlertsHitlist){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var textSeparator = folder.GetHierarchy().GetTextSeparator();

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var hitlistInit = "<script>"+
            "Y.Global.on('hitlistloaded', function (e) {  "+
            "var upgradedHitlist = new Reportal.Hitlist({"+
            "hitlist: document.querySelector('.reportal-hitlist-container'),"+
            "separator: '" + (textSeparator ? textSeparator : "") + "',"+
            "headers: hitlistHeaders,"+
            "sentimentConfig: sentimentConfig,"+
            "currentCategory: currentCategory,"+
            "infoText: '" +  (isAlertsHitlist ? currentDictionary["hitlist alerts text"] : currentDictionary["hitlist info text"]) + "',"+
            "filterInfoText: \"" + currentDictionary["filter info text"] + "\""+
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
}