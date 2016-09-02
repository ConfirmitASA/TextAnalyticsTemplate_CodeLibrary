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
    private var _filtersQuestions;


    function TALibrary(globals,folders){
        _globals = globals;

        _filtersQuestions = TAHelper.GetConfiguredVariables(globals, null, Config.FiltersQuestions, "ta_filter", []);
        var folder: TAFolder;
        for(var i = 0 ; i < folders.length; i++){
            folder = new TAFolder(_globals,folders[i]);
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
        if(id){

            for(var i=0; i<_folders.length; i++){
                if(_folders[i].id == id){
                    return _folders[i];
                    break;
                }
            }

            throw new Error(201, "incorrect question Id");

        }else{
            return _folders[0];
        }
    }

    /**
     * @memberof TALibrary
     * @instance
     * @function GetFiltersQuestions
     * @returns {String[]}
     */
    function GetFiltersQuestions(){
        return _filtersQuestions;
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
}