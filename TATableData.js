/**
 * @class TATableData
 * @classdesc Class to get Data from built table
 *
 * @constructs TATableData
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {String} tableName
 */
class TATableData{

    /**
     * @memberof TATableData
     * @instance
     * @function GetTableRowHeaders
     * @description function to get rowheaders with ids
     * @returns {Object} - object with ids, titles and row indexes
     */
    static function GetTableRowHeaders(params){
        var context = params.context;
        context.log.LogDebug("--tblData--1");
        var tableName = params.tableName;
    context.log.LogDebug("--tblData--2");
        var rowheaders={
            length: 0
        };
    context.log.LogDebug("--tblData--3");

        var rowHeaderTitles = context.report.TableUtils.GetRowHeaderCategoryTitles(tableName);
    context.log.LogDebug("--tblData--4");
        var rowHeaderIds = context.report.TableUtils.GetRowHeaderCategoryIds(tableName);
    context.log.LogDebug("--tblData--5");
        //TODO: change styling
        for(var i=0; i<rowHeaderIds.length;i++){
            context.log.LogDebug("--tblData--6 "+i);
            rowheaders[rowHeaderIds[i][0]+((rowHeaderIds[i].length>1)?("_block"+rowHeaderIds[i][1]):"")] = {title: rowHeaderTitles[i][0], index: i, categoryId: rowHeaderIds[i][0].toLowerCase(), blockId: ((rowHeaderIds[i].length>1)?("block"+rowHeaderIds[i][1]):null)};
            context.log.LogDebug("--tblData--7 "+i);
            rowheaders.length++;
            context.log.LogDebug("--tblData--8 "+i);

        }
    context.log.LogDebug("--tblData--9");

        return rowheaders;
    }

    /**
     * @memberof TATableData
     * @instance
     * @function GetBlocks
     * @description function to get parent rowheader ids
     * @returns {String}
     */
    static function GetBlocks(params){
        var context = params.context;
        var tableName = params.tableName;
        var blocks = [];
        var rowHeaderIds = context.report.TableUtils.GetRowHeaderCategoryIds(tableName);
        var blockExists = false;
        if(rowHeaderIds.length >0 && rowHeaderIds[0].length > 1){
            for(var i=0; i<rowHeaderIds.length; i++){
                blockExists = false;
                for(var j = 0; j < blocks.length; j++){
                    if( ("block"+rowHeaderIds[i][1]) === blocks[j]){
                        blockExists = true;
                        break;
                    }
                }

                if( !blockExists ){
                    blocks.push("block"+rowHeaderIds[i][1]);
                }
            }
        }
        return blocks
    }
}