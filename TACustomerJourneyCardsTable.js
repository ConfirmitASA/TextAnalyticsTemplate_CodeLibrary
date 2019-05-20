class TACustomerJourneyCardsTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _table: Table;
    private var _period;
    private var _config;
    private var _report;
    private var _state;
    private var _pageContext;
    private var _currentLanguage;
    private var _options = [];
    private var _statisticIDs = ["count", "avg", "max", "min", "sum"];
    private var _columnIDs = [];
    private var _rowItems = [];
    private var _columnItems = [];
    private var _statisticItems = [];
    private var _log;

    function TACustomerJourneyCardsTable(params){
        var context = params.context;
        _table = context.component;
        _report = context.report;
        _state = context.state;
        _pageContext = context.pageContext;
        _folder = params.folder;
        _currentLanguage = params.currentLanguage;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });

        _config = params.config;
        _render();
    }

    /**
     * @memberof TACustomerJourneyCardsTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TACustomerJourneyCardsTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        //_table.Use1000Separator = false;
        createRowsAndCols();
        _taTableUtils.CreateTableFromExpression(_rowItems.join('+'), _columnItems.join('+'));
        _table.RowNesting = TableRowNestingType.AsLines;
        _pageContext.Items.Add('options', _options);
    }

    private function createRowsAndCols() {
        var folderDS = _folder.GetDatasourceId();

        for (var i = 0; i < _config.CustomerJourneyQuestions.length; i++) {
            var currentOptions = _config.CustomerJourneyQuestions[i];

            if(currentOptions.DatasourceId !== folderDS) {
                continue;
            }

            var index = _options.length;
            _options[index] = {};
            _options[index].MetricIds = [];
            _options[index].isCollapsed = currentOptions.IsCollapsed;
            _options[index].colors = currentOptions.Colors || _config.CustomerJourneyColors;
            _options[index].questionId = currentOptions.QuestionId.replace('.', '_');

            if(!currentOptions.IsCollapsed) {
                /* TODO: only non collapsed singles are supported */
                var project : Project = _report.DataSource.GetProject(currentOptions.DatasourceId);
                var question : Question = project.GetQuestion(currentOptions.QuestionId);
                var answers : Answer[] = question.GetAnswers();
                _options[index].answerIds = TAArrayUtils.map(answers, function(item) { return item.Precode; });
            }

            var isSomeStatisticUsed = createColumnItems(currentOptions, _options[index]);
            var rowItem = createRowItem(currentOptions, _options[index], isSomeStatisticUsed);
            _rowItems.push(rowItem)
        }

        if(_statisticItems.length > 0) {
            addStatisticHeader();
        }
    }

    private function createRowItem(currentOptions, optionsToSave, isSomeStatisticUsed) {
        var linebreakSegment = 'qbreaker';
        var questionSegment = 'qtitle';
        optionsToSave.linebreakSegment = linebreakSegment;
        optionsToSave.questionSegment = questionSegment;
        optionsToSave.isSomeStatisticUsed = isSomeStatisticUsed;

        var questionExpr;

        if(currentOptions.IsCollapsed) {
            if(!isSomeStatisticUsed) {
                questionExpr = '(' +
                    currentOptions.QuestionId + '{collapsed:true}/[CONTENT]' +
                    '+ [SEG]{label:"' + questionSegment + '";expression:"NOT ISNULL(' + currentOptions.QuestionId.replace('.', '_') + ')"}' +
                    ')';
            } else {
                questionExpr = currentOptions.QuestionId + '{collapsed:true;totals:false}';
            }
        } else {
            questionExpr = currentOptions.QuestionId + '{collapsed:false;totals:false}';
        }

        var rowQuestion = '([SEG]{label:"' + linebreakSegment + '"}/' + questionExpr + ')';
        return rowQuestion;
    }

    private function createColumnItems(currentOptions, optionsToSave) {
        var isSomeStatisticUsed = false;

        for (var j = 0; j < currentOptions.MetricIds.length; j++) {
            var currentMetric = currentOptions.MetricIds[j];
            var loweredCurrentMetric = currentMetric.ToLower();
            var currentMetricIndex = TAArrayUtils.indexOf(_columnIDs, currentMetric);

            if(currentMetricIndex < 0) {
                if(TAArrayUtils.indexOf(_statisticIDs, loweredCurrentMetric) >= 0) {
                    if(loweredCurrentMetric != "count") {
                        isSomeStatisticUsed = true;
                    }

                    if(TAArrayUtils.indexOf(_statisticItems, loweredCurrentMetric) < 0) {
                        _statisticItems.push(loweredCurrentMetric);
                    }
                    currentMetricIndex = loweredCurrentMetric;
                } else {
                    var questionName = currentMetric;
                    var columnQuestion = questionName + '{collapsed:true;totals:false;defaultstatistics:avg}';

                    if(loweredCurrentMetric == 'ta_sentiment') {
                        var selectedCategory = _state.Parameters.GetString("TA_ALL_CATEGORIES");

                        questionName = (selectedCategory && selectedCategory !== "emptyv")
                            ? (_folder.GetQuestionId("categorysentiment")+"."+selectedCategory)
                            : _folder.GetQuestionId("overallsentiment");
                        columnQuestion = questionName + '{collapsed:false;totals:true;defaultstatistics:count;hidedata:true;hideheader:true;mask:' + Config.SentimentRange.Positive.join(",") + '}';

                        var cellsExpression = "";
                        for(var i = 0; i < Config.SentimentRange.Positive.length; i++)
                            cellsExpression += "if (cellv(col - " + (i + 2) + ", row) > 0, cellv(col - " + (i + 2) + ", row), 0) + "
                        cellsExpression += "0";
                        var formulaExpression = "if(cellv(col- 1, row) > 0," +
                            "100*( " + cellsExpression + ")/cellv(col- 1, row), " +
                            "emptyv())";
                        columnQuestion += '+ [FORMULA]{expression:"' + formulaExpression + '";percent:false;decimals:0;label:"' + Translations.dictionary(_currentLanguage)['Gauges OSAT title'] + '"}'
                    }
                    currentMetricIndex = _columnIDs.length;
                    _columnItems.push(columnQuestion);
                    _columnIDs.push(currentMetric);
                }
            }

            optionsToSave.MetricIds.push(currentMetricIndex);

            if(_columnIDs[currentMetricIndex] == currentOptions.KeyMetricId) {
                optionsToSave.KeyMetricId = currentMetricIndex;
            }
        }

        if(optionsToSave.KeyMetricId == undefined) {
            optionsToSave.KeyMetricId = currentOptions.KeyMetricId;
        }

        return isSomeStatisticUsed;
    }

    private function addStatisticHeader() {
        _fixStatisticsOrder();

        var statExpression = '[STAT]{statistics: ' + _statisticItems.join(',') + '}';
        _columnItems.push(statExpression);

        for (var i = 0; i < _options.length; i++) {
            for (var j = 0; j < _options[i].MetricIds.length; j++) {
                var currentMetric = _options[i].MetricIds[j];
                var keyMetric = _options[i].KeyMetricId;
                var indexOfStats = TAArrayUtils.indexOf(_statisticItems, currentMetric);
                var updatedIndex = indexOfStats + _columnIDs.length;

                if(indexOfStats >= 0) {
                    _options[i].MetricIds[j] = updatedIndex;

                    if(keyMetric == currentMetric) {
                        _options[i].KeyMetricId = updatedIndex;
                    }
                }
            }
        }
    }

    /**
     * Function to align added statistics to the header order, specified in _statisticsIDs
     */
    private function _fixStatisticsOrder() {
        var fixedArray = [];

        for(var i = 0, length = _statisticIDs.length; i < length; i++) {
            var currentStat = _statisticIDs[i];

            if(TAArrayUtils.indexOf(_statisticItems, currentStat) >= 0) {
                fixedArray.push(currentStat);
            }
        }

        _statisticItems = fixedArray;
    }
}