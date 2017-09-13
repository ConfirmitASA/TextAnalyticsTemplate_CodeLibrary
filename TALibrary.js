/**
 * @class TALibrary
 * @classdesc Class to work with different TAFolders
 *
 * @constructs TALibrary
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {Object[]} folders - Config.TAQuestions
 */
class TALibrary{
    private var _globals;
    private var _folders = [];
    private var _currentFolder: TAFolder;
    private var _filterQuestions;


    function TALibrary(globals,config){
        _globals = globals;
        var filterQuestions = TAHelper.GetTagsFromSurvey(globals, config.DS_Main, ["ta_filter"]);
        _filterQuestions = TAHelper.GetConfiguredVariables(globals, null, config.FilterQuestions, filterQuestions, []);
        var folder: TAFolder;
        for(var i = 0 ; i < config.TAQuestions.length; i++){
                folder = new TAFolder(_globals,i, config);
                _folders.push(folder);
            }
            _currentFolder = _folders[0];
    }

    /**
     * @memberof TALibrary
     * @instance
     * @function GetFolders
     * @returns {TAFolder[]}
     */
    function GetFolders(){
        return _folders;
    }

    /**
     * @memberof TALibrary
     * @instance
     * @function GetFolderById
     * @param {String} id
     * @returns {TAFolder}
     */
    function GetFolderById(id){
    var result;
        if(id){
            for(var i=0; i<_folders.length; i++){
                if(_folders[i].GetId() == id){
                    result = _folders[i];
                    break;
                }
            }
            if(!result) {
                throw new Error(201, "incorrect question Id");
            }
            return result
        }else{
            return _folders[0];
        }
    }

    /**
     * @memberof TALibrary
     * @instance
     * @function GetFilterQuestions
     * @returns {String[]}
     */
    function GetFilterQuestions(){
        return _filterQuestions;
    }

    /**
     * @memberof TALibrary
     * @instance
     * @function SetCurrentFolder
     * @param {String} id
     */
    function SetCurrentFolder(id){
        for(var i=0; i<_folders.length; i++){
            if(_folders[i].id == id){
                _currentFolder = _folders[i];
                break;
            }
        }
    }

    static function GetTAFoldersParameterValue(context) {
        var selectedFolder = null;
        try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        } catch(e) {
            selectedFolder = null;
        } finally {
            return selectedFolder;
        }
    }
}