/**
 * @class TAHitlistUtils
 * @classdesc Class to work with the hitlist
 *
 * @constructs TAHitlistUtils
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFolder} folder
 * @param {Hitlist} hitlist
 */
class TAHitlistUtils{
    private var _globals;
    private var _folder: TAFolder;
    private var _hitlist: HitList;

    function TAHitlistUtils(globals, folder, hitlist){
        _globals = globals;
        _folder = folder;
        _hitlist = hitlist;
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddTAColumn
     * @description function to add a text analytics variable to the hitlist
     * @param {String} columnName - type of the question "overallsentiment" or "os", "categories" or "c", "positivementions" or "positive" or "pm", "negativementions" or "negative" or "nm", "categorysentiment" or "cs"
     * @param {Boolean} sortable
     * @param {String} postfix - id of the selected category
     */
    function AddTAColumn(columnName, sortable, postfix){
        var hitlistColumn: HitListColumn = new HitListColumn();
try {
    var dsId = _folder.GetDatasourceId();
}catch(t){
    _globals.log.LogDebug("Error in AddTAColumn 0. Column name: "+ columnName+". ErrorMessage: "+t);

}
    try{
        var project: Project = _globals.report.DataSource.GetProject(dsId);
    } catch(e){
        _globals.log.LogDebug("Error in AddTAColumn 1. Column name: "+ columnName+". ErrorMessage: "+e);
    }
    try{
        var columnId = _folder.GetQuestionId(columnName);
    } catch(l){
        _globals.log.LogDebug("Error in AddTAColumn 2. Column name: "+ columnName+". ErrorMessage: "+l);
    }
    try{
        hitlistColumn.QuestionnaireElement = columnName == "categorysentiment" ? project.CreateQuestionnaireElement(columnId, postfix) : project.CreateQuestionnaireElement(columnId);
        sortable ? (hitlistColumn.IsSortable = true) : null;
        _hitlist.Columns.Add(hitlistColumn);
    } catch(z){
        _globals.log.LogDebug("Error in AddTAColumn 3. Column name: "+ columnName+". ErrorMessage: "+z);
    }
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddColumn
     * @description function to add a not text analytics variable to the hitlist
     * @param {String} columnName - variable qId
     * @param {Boolean} sortable
     */
    function AddColumn(columnName, sortable){
        var hitlistColumn: HitListColumn = new HitListColumn();
        var project : Project = _globals.report.DataSource.GetProject(_folder.GetDatasourceId());

        hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columnName);
        sortable ? (hitlistColumn.IsSortable = true) : null;
        _hitlist.Columns.Add(hitlistColumn);
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddConfiguredColumns
     * @description function to add columns from config
     */
    function AddConfiguredColumns(){
        var hitlistColumn: HitListColumn;
        var project : Project = _globals.report.DataSource.GetProject(_folder.GetDatasourceId());
        var columns = _folder.GetHitlistColumns();
        for( var i = 0; i < columns.length; i++){
            hitlistColumn = new HitListColumn();
            hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columns[i]);
            _hitlist.Columns.Add(hitlistColumn);
        }
    }
}