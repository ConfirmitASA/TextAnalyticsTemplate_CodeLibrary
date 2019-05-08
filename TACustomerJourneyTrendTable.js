class TACustomerJourneyTrendTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _table: Table;
    private var _period;
    private var _viewBy;
    private var _config;
    private var _report;

    function TACustomerJourneyTrendTable(params){
        var context = params.context;
        _table = context.component;
        _report = context.report;

        _folder = params.folder;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _period = {
            Unit: params.period ? params.period : "m",
            From: -12,
            To: 0
        };
        _viewBy = params.viewBy;
        _config = params.config;
        _render();
    }

    /**
     * @memberof TACustomerJourneyTrendTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TACustomerJourneyTrendTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType = "categorysentiment";
        var rowexpr = _getRowHeadersExpression();
        _taTableUtils.CreateTableFromExpression(rowexpr);
        _addTimeSeriesColumn();
        _table.Use1000Separator = false;
    }


    /**
     * @memberof TACustomerJourneyTrendTable
     * @private
     * @instance
     * @function _getRowHeadersExpression
     */
    private function _getRowHeadersExpression(){
        var headerExpressions = [];
        var totalHeaderExpressions = [];
        var questions = _config.CustomerJourneyQuestions;
        var ds : Project = _report.DataSource.GetProject(_folder.GetDatasourceId());
        var qe : QuestionnaireElement;
        var qID, qPrecode;


        for (var i = 0; i < questions.length; i++) {
            if (questions[i].DatasourceId.ToUpper() == _folder.GetDatasourceId().ToUpper()){
                if (questions[i].IsCollapsed){
                    var indexOfDot = questions[i].QuestionId.indexOf('.');
                    if(indexOfDot >= 0) {
                        qID = questions[i].QuestionId.substr(0, indexOfDot);
                        qPrecode = questions[i].QuestionId.substr(indexOfDot + 1);
                        qe = ds.CreateQuestionnaireElement(qID, qPrecode);
                    } else {
                        qID = questions[i].QuestionId;
                        qe = ds.CreateQuestionnaireElement(qID);
                    }
                    var questionElem : Question = ds.GetQuestion(qe);
                    var title = questionElem.Title || questionElem.Text || qPrecode || qID;
                    totalHeaderExpressions.push( questions[i].QuestionId + '{collapsed:true;totals:false;hidedata:true;hideheader:true}' );
                    totalHeaderExpressions.push( '[SEG]{label:"Empty Header";hidedata:true;hideheader:true;expression:"NOT ISNULL(' + questions[i].QuestionId.replace('.', '_') + ')"}' );

                    headerExpressions.push( questions[i].QuestionId + '{collapsed:true;totals:false}' );
                    headerExpressions.push( '[SEG]{label:"Empty Header";expression:"NOT ISNULL(' + questions[i].QuestionId.replace('.', '_') + ')"}' );

                } else {
                    totalHeaderExpressions.push( questions[i].QuestionId + '{collapsed:' + questions[i].IsCollapsed  + ';totals:false;hidedata:true;hideheader:true}');
                    headerExpressions.push( questions[i].QuestionId + '{collapsed:' + questions[i].IsCollapsed  + ';totals:false}');
                }
            }
        }


        var mask;
        var sentiment = _viewBy.replace("_percent", "");

        switch (sentiment) {
            case "positive":
                mask = _config.SentimentRange.Positive;
                break;
            case "negative":
                mask = _config.SentimentRange.Negative;
                break;
            default:
                mask = null;
                break;
        }

        var qType = "overallsentiment";
        var additionalExpr = "hideheader:true;filterbymask:true";
        var totalExpr;

        if(_viewBy != "avg_sentiment") {
            additionalExpr += ";defaultstatistics:count";
            totalExpr = _taTableUtils.GetTAQuestionExpression(qType, null, "hidedata:true;" +  additionalExpr);
        }

        var sentimentTotalRows = sentiment != 'total' ?
            "/(" + totalHeaderExpressions.join('+') + ")":
            "";

        var totalRows = totalExpr ?
            (totalExpr + sentimentTotalRows + "+") :
            "";

        var sentimentExpr = _taTableUtils.GetTAQuestionExpression(qType, mask, additionalExpr);

        var rowexpr = totalRows + sentimentExpr + "/(" + headerExpressions.join('+') + ")";

        return rowexpr;
    }

    /**
     * @memberof TACustomerJourneyTrendTable
     * @private
     * @instance
     * @function _addTimeSeriesColum
     */
    private function _addTimeSeriesColumn(){
        var headerTimeSeries : HeaderQuestion = _taTableUtils.GetTimePeriodHeader(_period.Unit, _period.From, _period.To);
        _table.ColumnHeaders.Add(headerTimeSeries);

        if(_viewBy == "avg_sentiment") {
            var stat : HeaderStatistics = new HeaderStatistics();
            stat.Statistics.Avg = true;
            stat.Statistics.Count = true;
            headerTimeSeries.SubHeaders.Add(stat);
        } else {
            var sentiment = _viewBy.replace("_percent", "");
            var base : HeaderBase = new HeaderBase();
            var percent : HeaderFormula = new HeaderFormula();
            percent.Type = FormulaType.Expression;

            if(sentiment != 'total') {
                percent.Expression = 'IF(row-ROWS/2 <= 0 OR cellv(col-1,row-ROWS/2) = 0 , emptyv(),cellv(col-1,row) / cellv(col-1,row-ROWS/2) * 100)';
            } else {
                percent.Expression = 'IF(cellv(col-1,1) = 0 , emptyv(),cellv(col-1,row) / cellv(col-1,1) * 100)';
            }

            headerTimeSeries.SubHeaders.Add(base);
            headerTimeSeries.SubHeaders.Add(percent);
        }
    }
}