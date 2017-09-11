/**
 * @class TATiles
 * @classdesc Class to work with Tiles on the Detailed analysis page
 *
 * @constructs TATiles
 * @param {Object} params - {
 *          context: {component: table, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          folder: {TAFolder},
 *          type: { "all" | "neg" | "neu" | "pos" },
 *          selectedCategory: {String},
 *          distribution - 0 for counts, 1 for percents
 *      }
 */
class TATiles{
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _sentiment;
    private var _distribution;
    private var _selectedCategory;


    function TATiles(params){
        var context = params.context;
        _folder = params.folder;
        _taMasks = new TAMasks({
            context: context,
            folder: _folder
        });
        _table = context.component;

        _taTableUtils = new TATableUtils({
            context: context,
            folder: _folder,
            table: _table
        });
        _sentiment = params.type ? params.type : "all";
        _selectedCategory = params.category !== "emptyv" ? params.category : "all";
        _distribution = params.distribution ? params.distribution : "0";

        _render();
    }

    /**
     * @memberof TATiles
     * @instance
     * @function GetTATableUtils
     * @returns {TATAbleUtils}
     */
    function GetTATableUtils(){
        return _taTableUtils;
    }

    /**
     * @memberof TATiles
     * @private
     * @instance
     * @function _render
     */
    private function _render(){
        var qType;
        var mask;
        if( _selectedCategory === "all" ){
            qType = "os";
            mask = false;
        }else{
            qType = "cs";
            mask = [_selectedCategory];
        }

        var rowexpr = _taTableUtils.GetTAQuestionExpression(qType, mask);
        var columnexpr = _taTableUtils.GetCategoriesExpression( _sentiment, false, true, _distribution, Config.SentimentRange);
        _taTableUtils.CreateTableFromExpression(rowexpr, columnexpr);

        _table.Distribution.Enabled = true;
        _table.Distribution.VerticalPercents = false;

        if(_distribution === "1" && _sentiment !== "all"){
            _table.Distribution.HorizontalPercents = true;
            _table.Distribution.Count = false;
        }else{
            _table.Distribution.HorizontalPercents = false;
            _table.Distribution.Count = true;
        }
    }
}