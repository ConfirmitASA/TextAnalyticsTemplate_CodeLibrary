/**
 * @class Page_wordcloud
 * @classdesc Static class for Reportal Page Impact Analysis components
 */
class Page_wordcloud{

    /**
     * @memberof Page_wordcloud
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);
        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "word_cloud");
        TAPageRenderer.ClearCategoriesParameters(context);

        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_wordcloud
     * @function txtSelect2Styles_Render
     * @description function to render the select2 style for Excluded words
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtSelect2Styles_Render(context){
        var wcInit = "<script src=\"https://code.jquery.com/jquery-3.2.1.min.js\" integrity=\"sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=\" crossorigin=\"anonymous\"></script>" +
            "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/css/select2.min.css\" rel=\"stylesheet\">" +
            "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js\"></script>  " +
            "<script>" +
            "$(function() {" +
            "$(\"#wc_exceptions .reportal-select:not(:first-child) select\").select2();" +
            "$(\"#select-word .reportal-select:not(:first-child) select\").select2();" +
            "});" +
            "</script>";

        context.component.Output.Append(wcInit);
    }

    /**
     * @memberof Page_wordcloud
     * @function tblWordCloud_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: table, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblWordCloud_Render(context){
        var table = context.component;
        table.Caching.Enabled = false;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var TAQuestion = folder.GetQuestionId();

        var taTableUtils = new TATableUtils({
            context: context,
            folder: folder,
            table: table
        });

        var blockHeader;
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        //if( selectedCategory && selectedCategory !== "emptyv" ){
        //    blockHeader = taTableUtils.GetTAQuestionExpression("categorysentiment",[selectedCategory],"");
        //} else {
            blockHeader = taTableUtils.GetTAQuestionExpression("overallsentiment",false,"");
        //}

        taTableUtils.CreateTableFromExpression('', blockHeader);

        var project : Project = context.report.DataSource.GetProject(folder.GetDatasourceId());

        var question_word = project.CreateQuestionnaireElement('word', TAQuestion);
        var questionHeader_word : HeaderQuestion = new HeaderQuestion(question_word);
        questionHeader_word.Sorting.Enabled = false;
        questionHeader_word.ShowTotals = false;

        var question_frequency = project.CreateQuestionnaireElement('frequency', TAQuestion);
        var questionHeader_frequency : HeaderQuestion = new HeaderQuestion(question_frequency);
        questionHeader_frequency.IsCollapsed = true;
        questionHeader_frequency.DefaultStatistic = StatisticsType.Sum;
        questionHeader_frequency.Preaggregation = StatisticsType.Sum;


        table.RowHeaders.Add(questionHeader_word);
        table.ColumnHeaders.Insert(0, questionHeader_frequency);
        table.Use1000Separator = false;

        taTableUtils.SetupRowsTableSorting(false, 1, 150);
    }

    /**
     * @memberof Page_wordcloud
     * @function tblWordCloud_parameter_Hide
     * @description function to render the sentiment selector label
     * @param {Object} context - {pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function tblWordCloud_parameter_Hide(context){
        return true;
    }

    /**
     * @memberof Page_wordcloud
     * @function tblWordCloud_parameter_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: table, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblWordCloud_parameter_Render(context){
        var table = context.component;
        table.Caching.Enabled = true;

        var taTableUtils = new TATableUtils({
            context: context,
            folder: folder,
            table: table
        });

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var TAQuestion = folder.GetQuestionId();
        var project : Project = context.report.DataSource.GetProject(folder.GetDatasourceId());

        var question_word = project.CreateQuestionnaireElement('word', TAQuestion);
        var questionHeader_word : HeaderQuestion = new HeaderQuestion(question_word);
        questionHeader_word.ShowTotals = false;

        questionHeader_word.Sorting.Enabled = true;
        questionHeader_word.Sorting.Direction = TableSortDirection.Descending;
        questionHeader_word.Sorting.TopN = 1000;
        questionHeader_word.Sorting.SortByType = TableSortByType.Position;
        questionHeader_word.Sorting.Position = 1;

        var question_frequency = project.CreateQuestionnaireElement('frequency', TAQuestion);
        var questionHeader_frequency : HeaderQuestion = new HeaderQuestion(question_frequency);
        questionHeader_frequency.IsCollapsed = true;
        questionHeader_frequency.DefaultStatistic = StatisticsType.Sum;
        questionHeader_frequency.Preaggregation = StatisticsType.Sum;

        table.RowHeaders.Add(questionHeader_word);
        table.ColumnHeaders.Add(questionHeader_frequency);
        table.Use1000Separator = false;
        table.Sorting.Rows.Enabled = false;
    }

    /**
     * @memberof Page_wordcloud
     * @function txtWordsFilterType_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtWordsFilterType_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var label = currentDictionary["Matching"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_wordcloud
     * @function txtWordCloud_Render
     * @description function to render the correlation variable selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtWordCloud_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Include words"];
        context.component.Output.Append(label);
        // context.component.Output.Append(TAParameterValues.getWordCloudParameterValue(context, currentDictionary));
    }

    /**
     * @memberof Page_wordcloud
     * @function txtExcludedWords_Render
     * @description function to render the correlation variable selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtExcludedWords_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Exclude words"];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getExcludeWordsParameterValue(context, currentDictionary));
    }

    /**
     * @memberof Page_wordcloud
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

        //var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

        var htlComments = new TAHitlistUtils({context: context, folder: folder});

        /*if( selectedCategory && selectedCategory !== "emptyv" ){
            htlComments.AddTAColumn({
                context: context,
                columnName:"categorysentiment",
                sortable: true,
                postfix: selectedCategory
            });
        }*/

        // custom question - Property Name
        htlComments.AddColumn({
            context: context,
            columnName: "property_name",
            sortable: true
        });

        // custom question - Apartment Number
        htlComments.AddColumn({
            context: context,
            columnName: "apartment_number",
            sortable: true,
            notSearchable: true
        });

        htlComments.AddTAColumn({context: context, columnName: "verbatim", sortable: true});

        htlComments.AddColumn({
            context: context,
            columnName: folder.GetTimeVariableId(),
            sortable: true
        });

        htlComments.AddTAColumn({context: context, columnName: "overallsentiment", sortable: true, notSearchable: true});
        htlComments.AddTAColumn({context: context, columnName: "categories"});

        htlComments.AddConfiguredColumns(context);

        htlComments.AddColumn({
            context: context,
            columnName: "Rep_Channel",
            sortable: true
        });
    }

    /**
     * @memberof Page_wordcloud
     * @function txtCommentsScript_Render
     * @description function to render the script which processes hitlist
     * @param {Object} context - {component: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCommentsScript_Render(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var textSeparator = folder.GetHierarchy().GetTextSeparator();
        var selectedWCWords;

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        if ( !context.state.Parameters.IsNull("TA_INCLUDE_WORDS") ){
            var wordCloudFilterWords : ParameterValueMultiSelect = context.state.Parameters["TA_INCLUDE_WORDS"];
            var words = [];

            for(var i = 0; i < wordCloudFilterWords.Count; i++) {
                var word : ParameterValueResponse = wordCloudFilterWords[i];
                words.push(word.StringKeyValue);
            }
            selectedWCWords = words.join("|")
        }

        var hitlistInit = "<script>"+
            "Y.Global.on('hitlistloaded', function (e) {  "+
            "var upgradedHitlist = new Reportal.Hitlist({"+
            "hitlist: document.querySelector('.reportal-hitlist-container'),"+
            "separator: '" + (textSeparator ? textSeparator : "") + "',"+
            "headers: hitlistHeaders,"+
            "sentimentConfig: sentimentConfig," +
            "selectedWCWord: '" + selectedWCWords + "',"+
            "selectedWordsContainerId: '" + folder.GetQuestionId() + "',"+
            "infoText: '" +  currentDictionary["hitlist info text"] + "',"+
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
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(hitlistInit);
    }

    /**
     * @memberof Page_wordcloud
     * @function txtWordCloudScript_Render
     * @description function to render word cloud script
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtWordCloudScript_Render(context){
        // 0.0001 - hack to make wc work
        var wc_limiters = [-5, Config.SentimentRange.Neutral[0] - 6 - 0.0001, Config.SentimentRange.Positive[0] - 1 - 6 + 0.0001, 5];

        var wc_colors = [
            Config.Colors.NegNeuPosPalette.Negative,
            Config.Colors.NegNeuPosPalette.Neutral,
            Config.Colors.NegNeuPosPalette.Positive
        ];

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var wcInit = "<script>" +
            "var wcClickFunc = function(e) {" +
            "   var wordsSelect = document.querySelectorAll('#select-word select')[1];" +
            "   var wordsSelectOptions = wordsSelect.querySelectorAll('option');" +
            "   for (var i = 0; i < wordsSelectOptions.length; i++) {" +
            "       wordsSelectOptions[i].selected = e.target.innerHTML.toLowerCase() === wordsSelectOptions[i].innerText.toLowerCase();" +
            "   }" +
            "   var saveBtn = document.querySelector('#wc-filter-save-btn input');" +
            "   saveBtn.click();" +
            "};" +
            "var ta_wc = new Reportal.WordCloud({" +
            "                elementFromId: \"wc-table\"," +
            "                elementToId: \"cloud\"," +
            "                countId: 1," +
            "				 sentimentId: 2," +
            "                colorConfig: {" +
            "                    limiters: wc_limiters," +
            "                    colors: wc_colors" +
            "                }," +
            "                clickFunc: wcClickFunc," +
            "				 translations: translations" +
            "            });" +
            //"document.getElementById('wc_exceptions').querySelector('select').onchange = function() { ta_wc.restart(); }" +
            "</script>";

        context.component.Output.Append(JSON.print(wc_limiters,"wc_limiters"));
        context.component.Output.Append(JSON.print(wc_colors,"wc_colors"));
        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(wcInit);
    }
}