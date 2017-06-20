/**
 * @class TAParameters
 * @classdesc Class to work with parameters using Text analytics variables
 *
 * @constructs TAParameters
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {TALibrary} library
 */
class TAParameters{
    /**
     * @memberof TAParameters
     * @instance
     * @private
     * @function _addEmptyValue
     * @param {String} EmptyValueLabel
     * @returns {Object[]}
     */
    private static function _addEmptyValue(emptyValueLabel){
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
    static function RenderFoldersParameter(params){
        var context = params.context;
        var parameter = context.component;
        var folders = Config.GetTALibrary().GetFolders();

        var parameterValues = [];
        var project;
        var question;

        for(var i = 0; i < folders.length; i++){
            project = context.report.DataSource.GetProject(folders[i].GetDatasourceId());
            question = project.GetQuestion(folders[i].GetQuestionId());
            parameterValues.push({
                Code: folders[i].GetId(),
                Label: folders[i].GetName() //+ (question.Text ? " - " + question.Text : "")
            });
        }

        ParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    static function RenderAllCategoriesParameter(params){
        var context = params.context;
        var parameter = context.component;
        var emptyValueLabel = params.emptyValueLabel;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);

        var categories = Config.GetTALibrary().
            GetFolderById(folderId).
            GetHierarchy().
            GetFlatArray();

        var parameterValues = _addEmptyValue(emptyValueLabel);

        for(var i = 0; i < categories.length; i++){
            parameterValues.push({
                Code: categories[i].id,
                Label: categories[i].name
            })
        }

        ParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
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
    static function RenderLevelCategoriesParameter(params){
        var context = params.context;
        var parameter = context.component;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var level = params.level;
        var emptyValueLabel = params.emptyValueLabel;

        var categories = Config.GetTALibrary().
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

        ParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
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
    static function MaskSelectedCategoryChildren(params){
        var context = params.context;
        var mask = context.component;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var category = params.category;
        var addEmpty = params.addEmpty;

        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var taMasks = new TAMasks({context: context, folder: folder});
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
    static function RenderLevelsParameter(params){
        var context = params.context;
        var parameter = context.component;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var parameterValues =[];

        var levelValues = [
            {
                Code: "0",
                Label: currentDictionary["1st level (category)"]
            },
            {
                Code: "1",
                Label: currentDictionary["2nd level (sub-category)"]
            },
            {
                Code: "2",
                Label: currentDictionary["3rd level (attributes)"]
            }
        ];

        var levelsCount = Config.GetTALibrary().
            GetFolderById(folderId).
            GetHierarchy().
            GetLevelsCount();

        for( var i = 0; i < levelsCount; i++){
            parameterValues.push( levelValues[i] );
        }

        ParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
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
    static function RenderViewByParameter(params){
        var context = params.context;
        var parameter = context.component;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var emptyValueLabel = params.emptyValueLabel;

        var parameterValues = _addEmptyValue(emptyValueLabel);
        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var variables = folder.GetViewByVariables();
        var project = context.report.DataSource.GetProject(folder.GetDatasourceId());
        var question: Question;

        for( var i = 0; i < variables.length; i++){
            question = project.GetQuestion( variables[i] );
            parameterValues.push({
                Code: variables[i],
                Label: question.Title ? question.Title : variables[i]
            });
        }

        ParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
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
     * @param {String} attributesParameter
     */
    static function ClearSubcategoriesParameters(params){
        var context = params.context;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var value = params.value;
        var categoriesParameter = params.categoriesParameter;
        var subcategoriesParameter = params.subcategoriesParameter;
        var attributesParameter = params.attributesParameter;

        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var topCategory = context.state.Parameters.GetString(categoriesParameter);
        var subCategory = context.state.Parameters.GetString(subcategoriesParameter);
        if(subCategory && subCategory !== value){
            if (folder.GetHierarchy().GetObjectById(subCategory).parent !== topCategory){
                context.state.Parameters[subcategoriesParameter] = new ParameterValueResponse(value);
                if ( attributesParameter ){
                    context.state.Parameters[attributesParameter] = new ParameterValueResponse(value);
                }
            }
        }
    }

    /**
     * @memberof TAHelper
     * @function GetSelectedCategory
     * @description function to get id of selected category, subcategory or attribute
     * @param {ReportState} state
     * @param {String} categoriesParameterName
     * @param {String} subCategoriesParameterName
     * @param {String} attributesParameterName
     * @returns {String}
     */
    static function GetSelectedCategory(params){
        var context = params.context;
        var categoriesParameterName = params.categoriesParameterName;
        var subCategoriesParameterName = params.subCategoriesParameterName;
        var attributesPararmeterName = params.attributesPararmeterName;

        var categoriesParameter;

        if(categoriesParameterName)
            categoriesParameter = context.state.Parameters.GetString(categoriesParameterName);


        var subCategoriesParameter;
        if(subCategoriesParameterName)
            subCategoriesParameter= context.state.Parameters.GetString(subCategoriesParameterName);


        var attributesParameter;
        if(attributesPararmeterName)
            attributesParameter = context.state.Parameters.GetString(attributesPararmeterName);

        var selectedCategory = "emptyv";

        if(categoriesParameter && categoriesParameter != "emptyv"){
            selectedCategory = categoriesParameter;
        }

        if(subCategoriesParameter && subCategoriesParameter != "emptyv"){
            selectedCategory = subCategoriesParameter;
        }

        if(attributesParameter && attributesParameter != "emptyv"){
            selectedCategory = attributesParameter;
        }

        return selectedCategory;
    }

    static function SetSelectedCategory(params){
        var context = params.context;
        var hierarchy = params.hierarchy;
        var allCategoriesParameterValue = params.allCategoriesParameterValue;
        var categoriesParameterName = params.categoriesParameterName;
        var subCategoriesParameterName = params.subCategoriesParameterName;
        var attribtesPararmeterName = params.attribtesPararmeterName;

        var defaultParameterValues = [
            {
                Id: categoriesParameterName,
                Value: "emptyv"
            },
            {
                Id: subCategoriesParameterName,
                Value: "emptyv"
            },
            {
                Id: attribtesPararmeterName,
                Value: "emptyv"
            }
        ];

        if( allCategoriesParameterValue != "emptyv"){
            var selectedCategory = hierarchy.GetObjectById(allCategoriesParameterValue);
            defaultParameterValues[selectedCategory.level].Value = selectedCategory.id;
            if(selectedCategory.level > 0){
                defaultParameterValues[selectedCategory.level-1].Value = selectedCategory.parent
            }

            if(selectedCategory.level == 2){
                defaultParameterValues[0].Value = hierarchy.GetObjectById(selectedCategory.parent).parent
            }

        }

        for(var i = 0; i < defaultParameterValues.length; i++) {
            context.state.Parameters[defaultParameterValues[i].Id] = new ParameterValueResponse(defaultParameterValues[i].Value);
        }
    }
}