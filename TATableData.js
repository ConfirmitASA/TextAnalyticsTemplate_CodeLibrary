/**
 * @class TATableData
 * @classdesc Class to get Data from built table
 */
class TATableData{

    /**
     * @memberof TATableData
     * @function GetTableRowHeaders
     * @description function to get rowheaders with ids
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          tableName: {String}
     *      }
     * @returns {Object} - object with ids, titles and row indexes
     */
    static function GetTableRowHeaders(params){
        var context = params.context;
        var tableName = params.tableName;
        var rowheaders={
            length: 0
        };

        var rowHeaderTitles = context.report.TableUtils.GetRowHeaderCategoryTitles(tableName);
        var rowHeaderIds = context.report.TableUtils.GetRowHeaderCategoryIds(tableName);

        for(var i=0; i<rowHeaderIds.length;i++){
            var rowheaderId = rowHeaderIds[i][0]+
                ((rowHeaderIds[i].length>1)
                    ? ("_block"+rowHeaderIds[i][1])
                    :"");

            var blockId = ((rowHeaderIds[i].length>1)
                ?("block"+rowHeaderIds[i][1])
                :null);

            rowheaders[rowheaderId] = {
                title: rowHeaderTitles[i][0],
                index: i,
                categoryId: rowHeaderIds[i][0].toLowerCase(),
                blockId: blockId
            };
            rowheaders.length++;

        }

        return rowheaders;
    }

    /**
     * @memberof TATableData
     * @instance
     * @function GetBlocks
     * @description function to get parent rowheader ids
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          tableName: {String}
     *      }
     * @returns {String}
     */
    static function GetBlocks(params, isSigTable){
        var context = params.context;
        var tableName = params.tableName;
        var blocks = [];
        var rowHeaderIds = context.report.TableUtils.GetRowHeaderCategoryIds(tableName);
        var blockExists = false;
        if(rowHeaderIds.length >0 && (!isSigTable && rowHeaderIds[0].length > 1 || isSigTable && rowHeaderIds[1].length > 1)){
            var firstRowHeaderIndex = !isSigTable ? 0 : 1;
            for(var i=firstRowHeaderIndex; i<rowHeaderIds.length; i++){
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