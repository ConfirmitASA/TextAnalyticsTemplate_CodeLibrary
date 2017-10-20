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
    private var _folder: TAFolder;
    private var _hitlist: HitList;

    function TAHitlistUtils(params){
        var context = params.context;
        _folder = params.folder;
        _hitlist = context.component;
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
    function AddTAColumn(params){
        var context = params.context;
        var columnName = params.columnName;
        var sortable = params.sortable;
        var postfix = params.postfix;

        var hitlistColumn: HitListColumn = new HitListColumn();
        var dsId = _folder.GetDatasourceId();

        var project: Project = context.report.DataSource.GetProject(dsId);

        var columnId = _folder.GetQuestionId(columnName);


        hitlistColumn.QuestionnaireElement = columnName === "categorysentiment"
            ? project.CreateQuestionnaireElement(columnId, postfix)
            : project.CreateQuestionnaireElement(columnId);

        sortable ? (hitlistColumn.IsSortable = true) : null;

        hitlistColumn.IsSearchable = true;
        _hitlist.Columns.Add(hitlistColumn);
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddColumn
     * @description function to add a not text analytics variable to the hitlist
     * @param {String} columnName - variable qId
     * @param {Boolean} sortable
     */
    function AddColumn(params){
        var context = params.context;
        var columnName = params.columnName;
        var sortable = params.sortable;

        var hitlistColumn: HitListColumn = new HitListColumn();
        var project : Project = context.report.DataSource.GetProject(_folder.GetDatasourceId());

        hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columnName);
        sortable ? (hitlistColumn.IsSortable = true) : null;
        hitlistColumn.IsSearchable = true;
        _hitlist.Columns.Add(hitlistColumn);
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddConfiguredColumns
     * @description function to add columns from config
     */
    function AddConfiguredColumns(context){
        var hitlistColumn: HitListColumn;
        var project : Project = context.report.DataSource.GetProject(_folder.GetDatasourceId());

        var columns = _folder.GetHitlistColumns();

        for( var i = 0; i < columns.length; i++){
            hitlistColumn.IsSearchable = true;
            if(columns[i] == 'client_first_name' || columns[i] == 'client_last_name') {
                if(!context.user.HasRole('Ops Support')) {
                    hitlistColumn = new HitListColumn();
                    hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columns[i]);
                    _hitlist.Columns.Add(hitlistColumn);
                }
            } else {
                hitlistColumn = new HitListColumn();
                hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columns[i]);
                _hitlist.Columns.Add(hitlistColumn);
            }
        }
    }
}