/**
 * @class TAThemeDistributionTable
 * @classdesc Class to work with ThemeDistribution table
 *
 * @constructs TAThemeDistributionTable
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFoldee} folder - Text Analytics folder to build table from
 * @param {Table} table
 * @param {String} sentiment - "emptyv", "neg", "neu", "pos"
 */
class TAThemeDistributionTable{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _sentiment;
    private var _percents;
    private var _period;
    private var _config;

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
        _period = {
            Unit: params.period ? params.period : "m",
            From: -11,
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
        var qType = "categorysentiment";
        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType);

        _taTableUtils.CreateTableFromExpression(rowexpr);
        _addTimeSeriesColumn();
        _setupConditionalFormatting();
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _addTimeSeriesColum
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
     */
    private function _getCountsColumn(){
        var columnsCollection: HeaderCollection = _taTableUtils.GetCategoriesHeader(_sentiment, false, true, false, Config.SentimentRange);
        return columnsCollection
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
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
                    break;

                case "neu":
                    headerStatistics.Expression = "0";
                    break;

                case "pos":
                    headerStatistics.Expression = "6";
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
            [
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
            ],
            "NegNeuPos",
            {
                axis: Area.Columns,
                direction: Area.Left,
                indexes: "1-1000"
            }
        )
    }
}