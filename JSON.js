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
            rowheaders[rowHeaderIds[i][0]+((rowHeaderIds[i].length>1)?("_block"+rowHeaderIds[i][1]):null)] = {title: rowHeaderTitles[i][0], index: i, categoryId: rowHeaderIds[i][0], blockId: ((rowHeaderIds[i].length>1)?("block"+rowHeaderIds[i][1]):null)};
        }
    return rowheaders;
    }

    /**
     * function to get blocks Ids for DA table
     */
    static function getBlockIds(qName){
        var blocks=[];
        var question: Question = TALibrary.currentQuestion.project.GetQuestion(qName);
        var answers = question.GetAnswers();
        for(var i = 0; i < answers.length; i++){
            blocks.push("block"+answers[i].Precode);
        }
        return blocks;
    }


    static function createDetailedAnalysisHeader(rowheadersObject,hierarchyObject,blockId){
        rowheadersObject[hierarchyObject.id+(blockId?("_"+blockId):"")]= {
            title: hierarchyObject.name,
            index: rowheadersObject.index,
            categoryId: hierarchyObject.id,
            blockId: blockId
        };
    rowheadersObject.index++;
        for(var i =0; i<hierarchyObject.children.length;i++){
            rowheadersObject = createDetailedAnalysisHeader(rowheadersObject,hierarchyObject.children[i],blockId);
        }
    return rowheadersObject;
    }

    static function getDetailedAnalysisHeaders(blocks) {
        var rowheadersObject = {};
        rowheadersObject.index = 0;
        var index = 0;
        var themesArray = [];
        if (!blocks.length > 0) blocks.push(null);
        TALibrary.currentQuestion.currentTheme > -1 ? themesArray.push(TALibrary.currentQuestion.themes[TALibrary.currentQuestion.currentTheme]) : themesArray = TALibrary.currentQuestion.themes;
        for (var i = 0; i < blocks.length; i++) {
            for (var j = 0; j < themesArray.length; j++) {
                rowheadersObject = createDetailedAnalysisHeader(rowheadersObject,themesArray[j],blocks[i]);
            }
        }
        return rowheadersObject;
    }
}