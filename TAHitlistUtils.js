/**
 * @class TAHitlistUtils
 * @classdesc Class to work with the hitlist
 *
 * @constructs TAHitlistUtils
 * @param {Object} params - {
 *          context:  {componet: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
 *          folder: {TAFolder}
 *      }
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
     * @param {Object} params - {
     *          columnName: {String}  - type of the question "overallsentiment" or "os", "categories" or "c", "positivementions" or "positive" or "pm", "negativementions" or "negative" or "nm", "categorysentiment" or "cs"
     *          sortable: {Boolean}
     *          postfix: {String} - id of the selected category
     *      }
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

        _hitlist.Columns.Add(hitlistColumn);
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddColumn
     * @description function to add a not text analytics variable to the hitlist
     * @param {Object} params - {
     *          columnName: {String} - variable qId
     *          sortable: {Boolean}
     *      }
     */
    function AddColumn(params){
        var context = params.context;
        var columnName = params.columnName;
        var sortable = params.sortable;

        var hitlistColumn: HitListColumn = new HitListColumn();
        var project : Project = context.report.DataSource.GetProject(_folder.GetDatasourceId());

        hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columnName);
        sortable ? (hitlistColumn.IsSortable = true) : null;
        _hitlist.Columns.Add(hitlistColumn);
    }

    /**
     * @memberof TAHitlistUtils
     * @instance
     * @function AddConfiguredColumns
     * @description function to add columns from config
     * @param {Object} context - {componet: hitlist, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    function AddConfiguredColumns(context){
        var hitlistColumn: HitListColumn;
        var project : Project = context.report.DataSource.GetProject(_folder.GetDatasourceId());

        var columns = _folder.GetHitlistColumns();

        for( var i = 0; i < columns.length; i++){
            hitlistColumn = new HitListColumn();
            hitlistColumn.QuestionnaireElement = project.CreateQuestionnaireElement(columns[i]);
            _hitlist.Columns.Add(hitlistColumn);
        }
    }
}