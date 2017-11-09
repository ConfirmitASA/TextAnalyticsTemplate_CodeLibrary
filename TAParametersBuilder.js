/**
 * @class TAParametersBuilder
 * @classdesc Class to work with parameters using Text analytics variables
 */
class TAParametersBuilder{
    /**
     * @memberof TAParametersBuilder
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
     * @memberof TAParametersBuilder
     * @function RenderFoldersParameter
     * @description render parameter with list of TAFoders using in the report
     * @param {Object} params - {
     *          context: {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     *      }
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

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParametersBuilder
     * @function RenderAllCategoriesParameter
     * @description render parameter with list of all categories, sub categories and attributes
     * @param {Object} params - {
     *          context: {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     *          emptyValueLabel: {String}
     *      }
     */
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

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParametersBuilder
     * @function RenderLevelCategoriesParameter
     * @description render parameter with list of categories on the specified level
     * @param {Object} params -{
     *          context: {component: parameter, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          folderId: {String},
     *          level: {String},
     *          emptyValueLabel: {String}
     *      }
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

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParametersBuilder
     * @function MaskSelectedCategoryChildren
     * @description masking children for the specified category
     * @param {Object} params - {
     *          context: {component: mask, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          category: {String},
     *          addEmpty: {Boolean}
     * }
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
     * @memberof TAParametersBuilder
     * @function RenderLevelsParameter
     * @description render parameter with list of levels in the hierarchy
     * @param {Object} params - {
     *          context: {component: mask, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * }
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

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParametersBuilder
     * @function RenderViewByParameter
     * @description render parameter with list of questions for the detailed analysis table
     * @param {Object} params - {
     *          context: {component: mask, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          emptyValueLabel: {String}
     * }
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

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParametersBuilder
     * @function RenderCorrelationQuestionParameter
     * @description render parameter with list of questions for the detailed analysis table
     * @param {Object} params - {
     *          context: {component: mask, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * }
     */
    static function RenderCorrelationQuestionParameter(params){
        var context = params.context;
        var parameter = context.component;
        var folderId = TALibrary.GetTAFoldersParameterValue(context);

        var parameterValues = [];
        var folder = Config.GetTALibrary().GetFolderById(folderId);
        var variables = folder.GetCorrelationVariables();
        var project = context.report.DataSource.GetProject(folder.GetDatasourceId());
        var question: Question;

        for( var i = 0; i < variables.length; i++){
            question = project.GetQuestion( variables[i] );
            parameterValues.push({
                Code: variables[i],
                Label: question.Title ? question.Title : variables[i]
            });
        }

        TAParameterUtilities.LoadParameterValues({
            context: context,
            parameter: parameter,
            parameterValues: parameterValues
        });
    }

    /**
     * @memberof TAParametersBuilder
     * @function ClearSubcategoriesParameters
     * @description clear subcategories andattributes parameters when another parent selected
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          value: {String} - empty value for that parameter "emptyv",
     *          categoriesParameter: {String},
     *          subcategoriesParameter: {String},
     *          attributesParameter: {String}
     * }
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
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          categoriesParameterName: {String},
     *          subcategoriesParameterName: {String},
     *          attributesParameterName: {String}
     * }
     * @returns {String}
     */
    static function GetSelectedCategory(params){
        var context = params.context;
        var categoriesParameterName = params.categoriesParameterName;
        var subCategoriesParameterName = params.subCategoriesParameterName;
        var attributesParameterName = params.attributesParameterName;

        var categoriesParameter;

        if(categoriesParameterName)
            categoriesParameter = context.state.Parameters.GetString(categoriesParameterName);


        var subCategoriesParameter;
        if(subCategoriesParameterName)
            subCategoriesParameter= context.state.Parameters.GetString(subCategoriesParameterName);


        var attributesParameter;
        if(attributesParameterName)
            attributesParameter = context.state.Parameters.GetString(attributesParameterName);

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

    /**
     * @memberof TAHelper
     * @function SetSelectedCategory
     * @description function to get set selected category, subcategory or attribute to their parameters based on AllCategoriesParameter and in other direction
     * @param {Object} params - {
     *          context: {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *          allCategoriesParameterValue: {String},
     *          categoriesParameterName: {String},
     *          subcategoriesParameterName: {String},
     *          attributesParameterName: {String}
     * }
     * @returns {String}
     */
    static function SetSelectedCategory(params){
        var context = params.context;
        var hierarchy = params.hierarchy;
        var allCategoriesParameterValue = params.allCategoriesParameterValue;
        var categoriesParameterName = params.categoriesParameterName;
        var subCategoriesParameterName = params.subCategoriesParameterName;
        var attributesParameterName = params.attributesParameterName;

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
                Id: attributesParameterName,
                Value: "emptyv"
            }
        ];

        if( allCategoriesParameterValue !== "emptyv"){
            var selectedCategory = hierarchy.GetObjectById(allCategoriesParameterValue);
            defaultParameterValues[selectedCategory.level].Value = selectedCategory.id;
            if(selectedCategory.level > 0){
                defaultParameterValues[selectedCategory.level-1].Value = selectedCategory.parent
            }

            if(selectedCategory.level === 2){
                defaultParameterValues[0].Value = hierarchy.GetObjectById(selectedCategory.parent).parent
            }

        }

        for(var i = 0; i < defaultParameterValues.length; i++) {
            context.state.Parameters[defaultParameterValues[i].Id] = new ParameterValueResponse(defaultParameterValues[i].Value);
        }
    }
}