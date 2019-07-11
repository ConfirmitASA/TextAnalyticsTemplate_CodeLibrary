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
    private var _selectedCategory;
    private var _period;
    private var _config;

    function TAThemeDistributionTable(params){
        var context = params.context;
        _folder = params.folder;
        _table = params.table;
        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });

        _taMasks = new TAMasks({
            context: context,
            folder: _folder
        });

        _sentiment = params.sentiment === "emptyv" ? "all" : params.sentiment;
        _selectedCategory = params.category && params.category !== "emptyv" ? params.category : "all";

        _period = {
            Unit: params.period ? params.period : "m",
            From: params.sigTestingWidgetTable ? -2 : -11,
            To: params.sigTestingWidgetTable ? -1 : 0
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
    }

    /**
     * @memberof TAThemeDistributionTable
     * @private
     * @instance
     * @function _setScaleMask
     */
    private function _setScaleMask(){
        if(_sentiment != 'all') {
            var header : HeaderQuestion = _table.RowHeaders.Item(1);
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
        var rowexpr = "";

        var overallHeader = _taTableUtils.GetTAQuestionExpression("overallsentiment");
        var qType = "categorysentiment";
        var categoryHeader = "(";

        var mask = false;

        if( _selectedCategory != "all" ){
            mask = _taMasks.GetAllChildrenMask(_selectedCategory);
            mask.push(_selectedCategory)
        }

        categoryHeader += _taTableUtils.GetTAQuestionExpression(qType, mask) + ")";

        rowexpr += overallHeader + "+" + categoryHeader;

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

        var avgHeader : HeaderStatistics = new HeaderStatistics();
        avgHeader.Statistics.Avg = true;
        avgHeader.Decimals = 1;
        avgHeader.HideHeader = true;
        columnsCollection.Add(avgHeader);

        var percentVolumeHeader : HeaderFormula = new HeaderFormula();
        percentVolumeHeader.Type = FormulaType.Expression;
        percentVolumeHeader.Expression = "cellv(col-2, row)/cellv(col-2, 1)";
        percentVolumeHeader.Percent = true;
        percentVolumeHeader.Decimals = 1;
        columnsCollection.Add(percentVolumeHeader);

        var stdevHeader : HeaderStatistics = new HeaderStatistics();
        stdevHeader.Statistics.StdevP = true;
        stdevHeader.Decimals = 4;
        columnsCollection.Add(stdevHeader);

        return columnsCollection;
    }
}