class TACustomerJourneyTrendTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _table: Table;
    private var _period;
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
            Unit: "m",
            From: -11,
            To: 0
        };
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
    }


    /**
     * @memberof TACustomerJourneyTrendTable
     * @private
     * @instance
     * @function _getRowHeadersExpression
     */
    private function _getRowHeadersExpression(){
        var headerExpressions = [];
        var questions = _config.CustomerJourneyQuestions;
        var ds : Project = _report.DataSource.GetProject(_folder.GetDatasourceId());
        var qe : QuestionnaireElement;
        var qID, qPrecode;


        for (var i = 0; i < questions.length; i++)
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
                    headerExpressions.push( questions[i].QuestionId + '{collapsed:true;totals:false}' );
                    headerExpressions.push( '[SEG]{label:"Empty Header";expression:"NOT ISNULL(' + questions[i].QuestionId.replace('.', '_') + ')"}' );
                }
                else
                    headerExpressions.push( questions[i].QuestionId + '{collapsed:' + questions[i].IsCollapsed  + ';totals:false}');
            }


        var qType = "overallsentiment";
        var sentimentExpr = _taTableUtils.GetTAQuestionExpression(qType, null, "hideheader:true");
        var rowexpr = sentimentExpr + "/(" + headerExpressions.join('+') + ")";
        return rowexpr;
    }

    /**
     * @memberof TACustomerJourneyTrendTable
     * @private
     * @instance
     * @function _addTimeSeriesColum
     */
    private function _addTimeSeriesColumn(){
        var headerTimeSeries = _taTableUtils.GetTimePeriodHeader(_period.Unit, _period.From, _period.To);
        _table.ColumnHeaders.Add(headerTimeSeries);
    }


    /**
     * @memberof TACustomerJourneyTrendTable
     * @private
     * @instance
     * @function _getHeaderStatistics
     * @returns {Header}
     */
    private function _getHeaderStatistics(){
        var headerStatistics;
        headerStatistics = new HeaderStatistics();
        headerStatistics.Statistics.Avg = true;
        headerStatistics.HideHeader = true;
        return headerStatistics;
    }
}