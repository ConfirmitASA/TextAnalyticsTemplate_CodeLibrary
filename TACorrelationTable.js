
class TACorrelationTable{
    private var _globals;
    private var _folder: TAFolder;
    private var _taTableUtils: TATableUtils;
    private var _taMasks: TAMasks;
    private var _table: Table;
    private var _selectedCategory;
    private var _currentLanguage;
    private var _curDictionary;

    function TACorrelationTable(params){

    var context = params.context;
    _globals = context;
    _currentLanguage = context.report.CurrentLanguage;
    _curDictionary = Translations.dictionary(_currentLanguage);
    _folder = params.folder;
    _table = context.component;

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

    _selectedCategory = params.category && params.category !== "emptyv" ? params.category : "all";

    _render();
}


    function GetTATableUtils(){
    return _taTableUtils;
}


    private function _render(){
    var rowexpr = _getRowheadersExpression();
    _taTableUtils.CreateTableFromExpression(rowexpr);
    _createColumns();
    _setupConditionalFormatting();
    _setupSupressing();
    _setupSorting();
}


    private function _getRowheadersExpression(){
    var rowexpr = "";
    var qType = "categorysentiment";
    var categoryHeader = "";

    var mask = false;


    if( _selectedCategory != "all" ){
        var chMask = _taMasks.GetChildrenMask(_selectedCategory);
        if(chMask.length >0){
            mask = chMask;
        }else{
            mask = [_selectedCategory]
        }
    } else{
        mask = _taMasks.GetCategoriesMask(0)
    }

    categoryHeader += _taTableUtils.GetTAQuestionExpression(qType, mask);

    var overallHeader = _taTableUtils.GetTAQuestionExpression("overallsentiment");
    rowexpr = [overallHeader,categoryHeader].join("+");
    return rowexpr
}

    private function _createColumns(){
    var columnsCollection: HeaderCollection = new HeaderCollection();
    columnsCollection.Add(_getStatisticsColumn());
    columnsCollection.Add(_getCorrelation());
    columnsCollection.Add(_getBaseColumn());
    columnsCollection.Add(_getFormulaColumn());
    _table.ColumnHeaders.AddRange(columnsCollection);
}

    private function _getStatisticsColumn(){
    var headerStatistics;
    headerStatistics = new HeaderStatistics();
    headerStatistics.Statistics.Avg = true;

    return headerStatistics
}

    private function _getCorrelation(){
    var selectedFolder = TALibrary.GetTAFoldersParameterValue(_globals);
    var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

    var project = _globals.report.DataSource.GetProject(folder.GetDatasourceId());

    var questionnaireElement: QuestionnaireElement = project.CreateQuestionnaireElement(folder.GetCorrelationVariableId());

    var headerCorrelation : HeaderCorrelation = new HeaderCorrelation(CorrelationType.Correlation, questionnaireElement);

    return headerCorrelation
}

    private function _getBaseColumn(){
    var headerBase: HeaderBase = new HeaderBase();
    return headerBase
}

    private function _getFormulaColumn(){
    var headerFormula: HeaderFormula = new HeaderFormula();
    headerFormula.Type = FormulaType.Expression;
    headerFormula.Expression = "(IF(cellv(col-3,row)<cellv(col-3,1), (10 - (cellv(col-3,row) + 5)), (cellv(col-3,row) + 5))) * cellv(col-2,row) * cellv(col-1, row)";
    headerFormula.HideData = false;

    return headerFormula
}

    private function _setupConditionalFormatting(){
    _taTableUtils.SetupConditionalFormatting(
        [
            {
                expression: 'cellv(col + 1, row)>0 AND cellv(col,row) <= cellv(col, 1) ',
                style: 'issues'
            },

            {
                expression: 'cellv(col + 1, row)<=0 AND cellv(col,row) <= cellv(col, 1) ',
                style: 'monitor'
            },
            {
                expression: 'cellv(col + 1, row)>0 AND cellv(col,row) > cellv(col, 1) ',
                style: 'strength'
            },
            {
                expression: 'cellv(col + 1, row)<=0 AND cellv(col,row) > cellv(col, 1) ',
                style: 'maintain'
            }
        ],
        "NegNeuPos",
        {
            axis: Area.Columns,
            direction: Area.Left,
            indexes: "1"
        }
    )
}

    private function _setupSupressing(){
    _table.SuppressData.BaseLessThan = 10;
    _table.SuppressData.BaseDisplay = BaseDisplayOption.Hide;
    _table.SuppressData.SuppressData = true;
}

    private function _setupSorting(){
    _taTableUtils.SetupRowsTableSorting(false, 4);
}
}