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
        var tableName = params.tableName;

        var rowheaders={
            length: 0
        };

        var rowHeaderTitles = context.report.TableUtils.GetRowHeaderCategoryTitles(tableName);
        var rowHeaderIds = context.report.TableUtils.GetRowHeaderCategoryIds(tableName);

        //TODO: change styling
        for(var i=0; i<rowHeaderIds.length;i++){
            rowheaders[rowHeaderIds[i][0]+((rowHeaderIds[i].length>1)?("_block"+rowHeaderIds[i][1]):"")] = {title: rowHeaderTitles[i][0], index: i, categoryId: rowHeaderIds[i][0].toLowerCase(), blockId: ((rowHeaderIds[i].length>1)?("block"+rowHeaderIds[i][1]):null)};
            rowheaders.length++;
        }

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