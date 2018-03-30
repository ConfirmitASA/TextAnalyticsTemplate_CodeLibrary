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
    private var _gap = 3;

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

        _setScaleMask();
        _addTimeSeriesColumn();
        _setupConditionalFormatting();
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _setScaleMask
     */
    private function _setScaleMask(){
        if(_sentiment != 'all') {
            var header : HeaderQuestion =  _table.RowHeaders.Item(1);
            var mask : MaskFlat = new MaskFlat();
            mask.IsInclusive = true;

            switch (_sentiment) {
                case "neg":
                    mask.Codes.AddRange(_config.SentimentRange.Negative);
                    break;
                case "neu":
                    mask.Codes.AddRange(_config.SentimentRange.Neutral);
                    break;
                case "pos":
                    mask.Codes.AddRange(_config.SentimentRange.Positive);
                    break;
            }

            header.ScaleMask = mask;
            header.FilterByMask = true;
        }
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
        headerTimeSeries.SubHeaders.AddRange(_getHeaderStatistics());
        _table.ColumnHeaders.Add(headerTimeSeries);
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @description to calculate count, avg.sentiment and stdev we use statistics header, data is filtered by scale mast in rowheaders
     * @function _getHeaderStatistics
     * @returns {Header}
     */
    private function _getHeaderStatistics(){
        var columnsCollection: HeaderCollection = new HeaderCollection();

        var countHeader : HeaderStatistics = new HeaderStatistics();
        countHeader.Statistics.Count = true;
        countHeader.Decimals = 0;
        countHeader.HideHeader = true;
        columnsCollection.Add(countHeader);

        var avgAndStdevHeader : HeaderStatistics = new HeaderStatistics();
        avgAndStdevHeader.Statistics.Avg = true;
        avgAndStdevHeader.Statistics.StdevP = true;
        avgAndStdevHeader.Decimals = 4;
        avgAndStdevHeader.HideHeader = true;
        avgAndStdevHeader.HideData = true;
        columnsCollection.Add(avgAndStdevHeader);

        return columnsCollection;
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _setupConditionalFormatting
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

        var prevTotal = 'cellv(col-' + _gap + ',1)';
        var curTotal = 'cellv(col,1)';
        var prevCount = 'cellv(col-' + _gap + ',row)';
        var curCount = 'cellv(col,row)';
        var prevAvg = 'cellv(col+1-' + _gap + ',row)';
        var curAvg = 'cellv(col+1,row)';
        var prevStdev = 'cellv(col+2-' + _gap + ',row)';
        var curStdev = 'cellv(col+2,row)';


        var sigTestCountsConditions = [
            {
                expression: '' + curCount + ' >= 5 AND ' + prevCount + ' >= 5 AND ' +
                            '((' + curCount + '/' + curTotal + ' - ' + prevCount + '/' + prevTotal + ') / ' +
                            'SQRT(' +
                                '(' + prevCount + ' + ' + curCount + ')/(' + prevTotal + ' + ' + curTotal + ')*' +
                                '(1 - (' + prevCount + ' + ' + curCount + ')/(' + prevTotal + ' + ' + curTotal + '))*' +
                                '(1/' + curTotal + ' + 1/' + prevTotal + ')' +
                            ')) < -1.96',
                style: 'decreasing'
            },
            {
                expression: '' + curCount + ' >= 5 AND ' + prevCount + ' >= 5 AND ' +
                            '((' + curCount + '/' + curTotal + ' - ' + prevCount + '/' + prevTotal + ') / ' +
                            'SQRT(' +
                                '(' + prevCount + ' + ' + curCount + ')/(' + prevTotal + ' + ' + curTotal + ')*' +
                                '(1 - (' + prevCount + ' + ' + curCount + ')/(' + prevTotal + ' + ' + curTotal + '))*' +
                                '(1/' + curTotal + ' + 1/' + prevTotal + ')' +
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
                expression: prevCount + ' >= 10 AND ' + curCount + ' >= 10 AND ' +
                            '((' + curAvg + ' - ' + prevAvg + ') / ' +
                            'SQRT(' +
                                '(1/' + prevCount + ' + 1/' + curCount + ') * ' +
                                '((' + prevCount + ' - 1)*POWER(' + prevStdev + ', 2) + (' + curCount + ' - 1)*POWER(' + curStdev + ', 2)) / '+
                                '(' + prevCount + ' + ' + curCount + ' - 2)' +
                            ')) < -1.96',
                style: 'decreasing'
            },
            {
                expression: prevCount + ' >= 10 AND ' + curCount + ' >= 10 AND ' +
                            '((' + curAvg + ' - ' + prevAvg + ') / ' +
                            'SQRT(' +
                                '(1/' + prevCount + ' + 1/' + curCount + ') * ' +
                                '((' + prevCount + ' - 1)*POWER(' + prevStdev + ', 2) + (' + curCount + ' - 1)*POWER(' + curStdev + ', 2)) / '+
                                '(' + prevCount + ' + ' + curCount + ' - 2)' +
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