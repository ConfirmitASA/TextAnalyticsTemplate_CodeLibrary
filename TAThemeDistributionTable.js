/**
 * @class TAThemeDistributionTable
 * @classdesc Class to work with ThemeDistribution table
 *
 * @constructs TAThemeDistributionTable
 * @param {Object} params - {
 *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          table: {Table},
 *          folder: {TAFolder},
 *          sentiment: { "emptyv" | "neg" | "neu" | "pos" },
 *          period: { "m" | "q" | "w" | "y" }
 *          config: {Object}
 *      }
 */
class TAThemeDistributionTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _sentiment;
    private var _sigTestingUseCounts;
    private var _sigTestingAlertsTable;
    private var _percents;
    private var _period;
    private var _config;
    private var _gap = 2;

    function TAThemeDistributionTable(params){
        var context = params.context;
        _folder = params.folder;
        _taMasks = new TAMasks({context: context, folder: _folder});
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _sentiment = params.sentiment === "emptyv" ? "all" : params.sentiment;
        _sigTestingUseCounts = params.sigTestingUseCounts;
        _sigTestingAlertsTable = params.sigTestingAlertsTable;

        _period = {
            Unit: params.period ? params.period : "m",
            From: _sigTestingAlertsTable ? -1 : -11,
            To: 0
        };
        _config = params.config;
        _render();
    }

    /**
     * @memberof TAThemeDistributionTable
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var rowexpr = _getRowheadersExpression();

        _taTableUtils.CreateTableFromExpression(rowexpr);
        _addTimeSeriesColumn();
        _setupConditionalFormatting();
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _getRowheadersExpression
     */
    private function _getRowheadersExpression(){
        var overallQuestion = _taTableUtils.GetTAQuestionExpression("overallsentiment",false,"hidedata:true");
        var categoryQuestion = _taTableUtils.GetTAQuestionExpression("categorysentiment");

        var rowexpr = overallQuestion + "+" + categoryQuestion;

        return rowexpr;
    }


    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _addTimeSeriesColumn
     * @description for columns we use timeseries header with rolling and counts and sentiments(hidden) subheaders
     */
    private function _addTimeSeriesColumn(){
        var headerTimeSeries = _taTableUtils.GetTimePeriodHeader(_period.Unit, _period.From, _period.To);
        var columnsCollection: HeaderCollection = new HeaderCollection();

        columnsCollection.AddRange(_getCountsColumn());
        columnsCollection.Add(_getHeaderStatistics());

        headerTimeSeries.SubHeaders.AddRange(columnsCollection);
        _table.ColumnHeaders.Add(headerTimeSeries);
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _getCountsColumn
     * @returns {HeaderCollection}
     * @description to calculate counts we use categories header and formula to calculate counts of particular sentiment range
     */
    private function _getCountsColumn(){
        var columnsCollection: HeaderCollection = _taTableUtils.GetCategoriesHeader(_sentiment, false, true, false, Config.SentimentRange);
        return columnsCollection
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @description to calculate sentiment we use categories header and formula to calculate counts of particular sentiment range and average sentiment of that category
     * @function _getHeaderStatistics
     * @returns {Header}
     */
    private function _getHeaderStatistics(){
        var headerStatistics;

        if( _sentiment == "all"){
            headerStatistics = new HeaderStatistics();
            headerStatistics.Statistics.Avg = true;
        }else{
            headerStatistics = new HeaderFormula();
            headerStatistics.Type = FormulaType.Expression;
            headerStatistics.Decimals = 0;
            headerStatistics.Priority = 0;

            switch (_sentiment) {
                case "neg":
                    headerStatistics.Expression = "-6";
                    _gap += _config.SentimentRange.Negative.length;
                    break;

                case "neu":
                    headerStatistics.Expression = "0";
                    _gap += _config.SentimentRange.Neutral.length;
                    break;

                case "pos":
                    headerStatistics.Expression = "6";
                    _gap += _config.SentimentRange.Positive.length;
                    break;
            }
        }
        headerStatistics.HideHeader = true;
        headerStatistics.HideData = true;
        return headerStatistics
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _setupConditionalFormatting}
     */
    private function _setupConditionalFormatting(){
        _taTableUtils.SetupConditionalFormatting(
            _getConditions()
            ,
            "NegNeuPos",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "1-1000"
            }
        )
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _getConditions
     */
    private function _getConditions(){
        var negNeuPostConditions = [
            {
                expression: 'cellv(col+1, row)<('+(_config.SentimentRange.Neutral[0] - 6)+') AND cellv(col,row)<>EMPTYV() ',
                style: 'negative'
            },

            {
                expression: '(cellv(col+1, row)>=('+(_config.SentimentRange.Neutral[0] - 6)+')) AND (cellv(col+1, row)<='+(_config.SentimentRange.Neutral[_config.SentimentRange.Neutral.length - 1] - 6)+') AND cellv(col,row)<>EMPTYV()',
                style: 'neutral'
            },
            {
                expression: 'cellv(col+1, row)>'+(_config.SentimentRange.Neutral[_config.SentimentRange.Neutral.length - 1] - 6)+' AND cellv(col,row)<>EMPTYV()',
                style: 'positive'
            }
        ];

        var sigTestCountsConditions = [
            {
                expression: 'cellv(col,row) >= 5 AND cellv(col-' + _gap + ',row) >= 5 AND ' +
                            '((cellv(col,row)/cellv(col,1) - cellv(col-' + _gap + ',row)/cellv(col-' + _gap + ',1)) / ' +
                            'SQRT(' +
                                '(cellv(col-' + _gap + ',row) + cellv(col,row))/(cellv(col-' + _gap + ',1) + cellv(col,1))*' +
                                '(1 - (cellv(col-' + _gap + ',row) + cellv(col,row))/(cellv(col-' + _gap + ',1) + cellv(col,1)))*' +
                                '(1/cellv(col,1) + 1/cellv(col-' + _gap + ',1))' +
                            ')) < -1.96',
                style: 'decreasing'
            },
            {
                expression: 'cellv(col,row) >= 5 AND cellv(col-' + _gap + ',row) >= 5 AND ' +
                            '((cellv(col,row)/cellv(col,1) - cellv(col-' + _gap + ',row)/cellv(col-' + _gap + ',1)) / ' +
                            'SQRT(' +
                                '(cellv(col-' + _gap + ',row) + cellv(col,row))/(cellv(col-' + _gap + ',1) + cellv(col,1))*' +
                                '(1 - (cellv(col-' + _gap + ',row) + cellv(col,row))/(cellv(col-' + _gap + ',1) + cellv(col,1)))*' +
                                '(1/cellv(col,1) + 1/cellv(col-' + _gap + ',1))' +
                            ')) > 1.96',
                style: 'increasing'
            },
            {
                expression: 'true',
                style: ''
            }
        ];

        var sigTestSentimentConditions = [
            {
                expression: 'cellv(col,row) >= 5 AND cellv(col-' + _gap + ',row) >= 5 AND ' +
                            '((cellv(col +1,row)/cellv(col+1,1) - cellv(col+1-' + _gap + ',row)/cellv(col+1-' + _gap + ',1)) / ' +
                            'SQRT(' +
                                '(cellv(col+1-' + _gap + ',row) + cellv(col+1,row))/(cellv(col+1-' + _gap + ',1) + cellv(col+1,1))*' +
                                '(1 - (cellv(col+1-' + _gap + ',row) + cellv(col+1,row))/(cellv(col+1-' + _gap + ',1) + cellv(col+1,1)))*' +
                                '(1/cellv(col+1,1) + 1/cellv(col+1-' + _gap + ',1))' +
                            ')) < -1.96',
                style: 'decreasing'
            },
            {
                expression: 'cellv(col,row) >= 5 AND cellv(col-' + _gap + ',row) >= 5 AND ' +
                            '((cellv(col+1,row)/cellv(col+1,1) - cellv(col+1-' + _gap + ',row)/cellv(col+1-' + _gap + ',1)) / ' +
                            'SQRT(' +
                                '(cellv(col+1-' + _gap + ',row) + cellv(col+1,row))/(cellv(col+1-' + _gap + ',1) + cellv(col+1,1))*' +
                                '(1 - (cellv(col+1-' + _gap + ',row) + cellv(col+1,row))/(cellv(col+1-' + _gap + ',1) + cellv(col+1,1)))*' +
                                '(1/cellv(col+1,1) + 1/cellv(col+1-' + _gap + ',1))' +
                            ')) > 1.96',
                style: 'increasing'
            },
            {
                expression: 'true',
                style: ''
            }
        ];

        var combinedConditions = [];

        if(_sigTestingAlertsTable) {
            for(var i = 0; i < negNeuPostConditions.length; i++) {
                var negNeuPosItem = negNeuPostConditions[i];

                for(var j = 0; j < sigTestCountsConditions.length; j++) {
                    var sigTestCountsItem = sigTestCountsConditions[j];

                    for(var k = 0; k < sigTestSentimentConditions.length; k++) {
                        var sigTestSentimentItem = sigTestSentimentConditions[k];
                        var item = {};

                        item.expression = negNeuPosItem.expression + ' AND ' + sigTestCountsItem.expression + ' AND ' + sigTestSentimentItem.expression;
                        item.style = negNeuPosItem.style + ' ' + sigTestCountsItem.style + 'C ' + sigTestSentimentItem.style + 'S ';

                        combinedConditions.push(item);
                    }
                }
            }
        } else {
            var arrayToCombineWith = _sigTestingUseCounts ? sigTestCountsConditions : sigTestSentimentConditions;

            for(var i = 0; i < negNeuPostConditions.length; i++) {
                var negNeuPosItem = negNeuPostConditions[i];

                for(var j = 0; j < arrayToCombineWith.length; j++) {
                    var sigTestItem = arrayToCombineWith[j];
                    var item = {};

                    item.expression = negNeuPosItem.expression + ' AND ' + sigTestItem.expression;
                    item.style = negNeuPosItem.style + ' ' + sigTestItem.style;

                    combinedConditions.push(item);
                }
            }
        }

        return combinedConditions;
    }
}