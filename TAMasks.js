/**
 * @class TAMasks
 * @classdesc Class to work with different types of masks for text analytics
 *
 * @constructs TAMasks
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TAFolder} folder
 */

//TODO: Refactor masks
class TAMasks{
    private var _globals;
    private var _folder: TAFolder;

    function TAMasks(params){
        _globals = params.context;
        _folder = params.folder;
    }

    /**
     * @memberof TAMasks
     * @instance
     * @function GetCategoriesMask
     * @description returns all categories on the selected level
     * @param {String} level
     * @returns {String[]}
     */
    function GetCategoriesMask(level){
        var mask = [];
        var levelArray = _folder.GetHierarchy().GetLevelArray(parseInt(level));
        for(var i = 0; i < levelArray.length; i++){
            mask.push(levelArray[i].id);
        }
        return mask
    }

    /**
     * @memberof TAMasks
     * @instance
     * @function GetChildrenMask
     * @description returns all children ids for the selected category
     * @param {String} level
     * @returns {String[]}
     */
    function GetChildrenMask(category){
        var mask = [];
        var childrenArray = _folder.GetHierarchy().GetObjectById(category).subcells;
        for(var i = 0; i < childrenArray.length; i++){
            mask.push(childrenArray[i].id);
        }

        return mask
    }

    /**
     * @memberof TAMasks
     * @instance
     * @function GetAllChildrenMask
     * @description returns all children and grand-children ids for the selected category
     * @param {String} level
     * @returns {String[]}
     */
    function GetAllChildrenMask(category, mask){
        var mask = mask ? mask : [];
        var childrenArray = _folder.GetHierarchy().GetObjectById(category).subcells;
        for(var i = 0; i < childrenArray.length; i++){
            mask.push(childrenArray[i].id);
            mask = GetAllChildrenMask(childrenArray[i].id, mask);
        }

        return mask
    }
}