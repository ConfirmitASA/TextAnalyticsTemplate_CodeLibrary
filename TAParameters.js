/**
 * @class TAParameters
 * @classdesc Class to work with parameters using Text analytics variables
 *
 * @constructs TAParameters
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TALibrary} library
 */
class TAParameters{
    private var _globals;
    private var _library: TALibrary;
    private var _parameterUtilities: ParameterUtilities;

    function TAParameters(globals, library){
        _globals = globals;
        _library = library;
        _parameterUtilities = new ParameterUtilities(_globals);
    }

    /**
     * @memberof TAParameters
     * @instance
     * @private
     * @function _addEmptyValue
     * @param {String} EmptyValueLabel
     * @returns {Object[]}
     */
    private function _addEmptyValue(emptyValueLabel){
            var parameterValues = [];
        if(emptyValueLabel){
            parameterValues.push({
                Code : "emptyv",
                Label: emptyValueLabel
            });
        }
        return parameterValues
    }

    /**
     * @memberof TAParameters
     * @instance
     * @function RenderFoldersParameter
     * @description render parameter with list of TAFoders using in the report
     * @param {Parameter} parameter
     */
    function RenderFoldersParameter(parameter){
        var folders = _library.GetFolders();

        var parameterValues = [];
        var project;
        var question;
        for(var i = 0; i < folders.length; i++){
            project = _globals.report.DataSource.GetProject(folders[i].GetDatasourceId());
            question = project.GetQuestion(folders[i].GetQuestionId());
            parameterValues.push({
                Code: folders[i].GetId(),
                Label: folders[i].GetId() + " " + question.Text
            });
        }
        _parameterUtilities.LoadParameterValues(parameter, parameterValues);
    }

    /**
     * @memberof TAParameters
     * @instance
     * @function RenderLevelCategoriesParameter
     * @description render parameter with list of categories on the specified level
     * @param {Parameter} parameter
     * @param {String} folderId
     * @param {String} level
     * @param {String} emptyValueLabel
     */
    function RenderLevelCategoriesParameter(parameter,folderId, level, emptyValueLabel){
        var categories = _library.
        GetFolderById(folderId).
        GetHierarchy().
        GetLevelArray(level);

        var parameterValues = _addEmptyValue(emptyValueLabel);

        for(var i = 0; i < categories.length; i++){
            parameterValues.push({
                Code: categories[i].id,
                Label: categories[i].name
            })
        }
        _parameterUtilities.LoadParameterValues(parameter, parameterValues);
    }

    /**
     * @memberof TAParameters
     * @instance
     * @function MaskSelectedCategoryChildren
     * @description masking children for the specified category
     * @param {Mask} mask
     * @param {String} folderId
     * @param {String} category
     * @param {Boolean} addEmpty
     */
    function MaskSelectedCategoryChildren(mask,folderId,category,addEmpty){
        var folder = _library.GetFolderById(folderId);
        var taMasks = new TAMasks(_globals, folder);
        var children = taMasks.GetChildrenMask(category);
        mask.Access = ParameterAccessType.Inclusive;
        if( addEmpty )
            mask.Keys.Add("emptyv");
        for ( var i = 0; i< children.length; i++)
            mask.Keys.Add(children[i]);
    }

    /**
     * @memberof TAParameters
     * @instance
     * @function RenderLevelsParameter
     * @description render parameter with list of levels in the hierarchy
     * @param {Parameter} parameter
     * @param {String} folderId
     * @param {String} emptyValueLabel
     */
    function RenderLevelsParameter(parameter, folderId, emptyValueLabel){
        var levelValues = [
            {
                Code: "0",
                Label: "1st level (category)"
            },
            {
                Code: "1",
                Label: "2nd level (sub-category)"
            },
            {
                Code: "2",
                Label: "3rd level (attributes)"
            }
        ];
        var parameterValues = _addEmptyValue(emptyValueLabel);
        var folder = _library.GetFolderById(folderId);
        var hierarchy = folder.GetHierarchy();
        var levelsCount=hierarchy.GetLevelsCount();

        for( var i = 0; i < levelsCount; i++){
            parameterValues.push( levelValues[i] );
        }

        _parameterUtilities.LoadParameterValues(parameter, parameterValues);
    }

    /**
     * @memberof TAParameters
     * @instance
     * @function RenderViewByParameter
     * @description render parameter with list of questions for the detailed analysis table
     * @param {Parameter} parameter
     * @param {String} folderId
     * @param {String} emptyValueLabel
     */
    function RenderViewByParameter(parameter, folderId, emptyValueLabel){
        var parameterValues = _addEmptyValue(emptyValueLabel);
        var folder = _library.GetFolderById(folderId);
        var variables = folder.GetViewByVariables();
        var project = _globals.report.DataSource.GetProject(folder.GetDatasourceId());
        var question: Question;
        for( var i = 0; i < variables.length; i++){
            question = project.GetQuestion( variables[i] );
            parameterValues.push({
                Code: variables[i],
                Label: question.Title ? question.Title : variables[i]
            });
        }

        _parameterUtilities.LoadParameterValues(parameter, parameterValues);
    }

    /**
     * @memberof TAParameters
     * @instance
     * @function ClearSubcategoriesParameters
     * @description clear subcategories andattributes parameters when another parent selected
     * @param {String} folderId
     * @param {String} value - empty value for that parameter "emptyv"
     * @param {String} categoriesParameter
     * @param {String} subcategoriesParameter
     * @param {String} attributesParamete
     */
    function ClearSubcategoriesParameters(folderId, value, categoriesParameter, subcategoriesParameter, attributesParameter){
        var folder = _library.GetFolderById(folderId);
        var topCategory = _globals.state.Parameters.GetString(categoriesParameter);
        var subCategory = _globals.state.Parameters.GetString(subcategoriesParameter);
        if(subCategory && subCategory != value){
            if (folder.GetHierarchy().GetObjectById(subCategory).parent != topCategory){
                _globals.state.Parameters[subcategoriesParameter] = new ParameterValueResponse(value);
                if ( attributesParameter ){
                    _globals.state.Parameters[attributesParameter] = new ParameterValueResponse(value);
                }
            }
        }
    }
}