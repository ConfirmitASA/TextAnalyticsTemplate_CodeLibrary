class JSON
{
    static function stringify(obj) { // implement JSON.stringify serialization
    function escapeEntities(str) {
        var entitiesMap = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '\"': '\\&quot;',
            '\'':'&amp;apos;'
        };
        return str.replace(/[&<>\"\']/g, function(key) {
            return entitiesMap[key];
        });
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+ escapeEntities(obj) +'"';
        else if(t=="number") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string"){
                v = '"'+ escapeEntities(v) +'"';
            }
            else if (t == "object" && v !== null) v = stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

    static function print(config, configName){ // JSON.print prints JSON `config` to page as JavaScript variable with a specified `configName`
    var varName = configName || 'config';
    return '<script type="text/javascript">var '+ varName + '=' + stringify(config) +'</script>';
};
}

class TATableData{
    //Globals
    static var pageContext: ScriptPageContext;
    static var log: Logger;
    static var report: Report;
    static var confirmit: ConfirmitFacade;
    static var user: User;

    /**
     * @param {Logger} l - log
     * @param {Report} r - report
     * @param {ConfirmitFacade} c - confirmit
     * @param {User} u - user
     */
    static function setGlobals(p: ScriptPageContext, l: Logger, r: Report, c: ConfirmitFacade, u: User){
        pageContext = p;
        log = l;
        report = r;
        confirmit = c;
        user = u;
    }

    /**
     * function to get rowheaders with ids
     * @param {String} tableName
     * @return {Object} - object with ids, titles and row indexes
     */
    static function getTableRowHeaders(tableName){
        var rowheaders={};
        var rowHeaderTitles = report.TableUtils.GetRowHeaderCategoryTitles(tableName);
        var rowHeaderIds = report.TableUtils.GetRowHeaderCategoryIds(tableName);
        for(var i=0; i<rowHeaderIds.length;i++){
            rowheaders[rowHeaderIds[i][0]+((rowHeaderIds[i].length>1)?("_"+rowHeaderIds[i][1]):null)] = {title: rowHeaderTitles[i][0], index: i, categoryId: rowHeaderIds[i][0], parentId: ((rowHeaderIds[i].length>1)?(rowHeaderIds[i][1]):null)};
        }
    return rowheaders;
    }
}