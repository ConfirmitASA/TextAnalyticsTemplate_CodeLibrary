/**
 * @class PageRenderer
 * @classdesc Class helping building all pages
 */
class PageRenderer{
    /**
     * @memberof PageRenderer
     * @function InitiateParameters
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description Setting default values for parameters in the first run
     */
    static function InitiateParameters(context){
        if(context.component.SubmitSource === "lstQuestion") {
            /*var folderId = TALibrary.GetTAFoldersParameterValue(context);
            var folder = Config.GetTALibrary().GetFolderById(folderId);
            var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');

            if(!folder.GetHierarchy().DoesObjectExist(selectedCategory)) {
                context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse('emptyv');
                context.state.Parameters['TA_TOP_CATEGORIES_SINGLE'] = new ParameterValueResponse('emptyv');
                context.state.Parameters['TA_SUB_CATEGORIES_SINGLE'] = new ParameterValueResponse('emptyv');
                context.state.Parameters['TA_ATTRIBUTES_SINGLE'] = new ParameterValueResponse('emptyv');
            }*/

            ParameterUtilities.SetDefaultParameterValues(
                {
                    context: context,
                    parameterValues: DefaultParameters.values
                }
            )
        }

        ParameterUtilities.SetDefaultParameterValuesForEmpty({
            context: context,
            parameterValues: DefaultParameters.values.concat(
                {
                    Id: "TA_FOLDERS",
                    Value: (Config.TAQuestions[0].DatasourceId + Config.TAQuestions[0].TAQuestionName + Config.TAQuestions[0].TAModelNo)
                }
            )
        });
    }

    /**
     * @memberof PageRenderer
     * @function InitiateFilters
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description clearing filters when necessary
     */
    static function InitiateFilters(context){
        if(context.component.SubmitSource === "ClearFilters" || context.component.SubmitSource === "btnClearFilters" || context.component.SubmitSource === "lstQuestion"){
            FilterComponents.ClearFilters(context);
            var dateParameters = DefaultParameters.dateParameters;

            for(var i = 0; i < dateParameters.length; ++i)
                context.state.Parameters[dateParameters[i]] = null;
        }
    }

    /**
     * @memberof PageRenderer
     * @function ProcessSelectedCategoryParameter
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description synchronizing parameters for top, sub categories and attributes and parameter containing all categories
     */
    static function ProcessSelectedCategoryParameter(context){
        var folderId = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(folderId);

        var submitSource = context.component.SubmitSource;
        var selectedCategory;
        if(submitSource === "lstCategory" || submitSource === "lstSubCategory" || submitSource === "lstAttribute"){
            selectedCategory = TAParameters.GetSelectedCategory({
                context: context,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });

            context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse(selectedCategory);
        }else {
            selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
            TAParameters.SetSelectedCategory({
                context: context,
                hierarchy: folder.GetHierarchy(),
                allCategoriesParameterValue: selectedCategory,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });
        }
    }

    /**
     * @memberof PageRenderer
     * @function SetLastVisitedPage
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} pageId
     * @description setting last visited page for the filter page
     */
    static function SetLastVisitedPage(context, pageId){
        context.state.Parameters["TA_LAST_VISITED_PAGE"] = new ParameterValueResponse(pageId);
    }

    /**
     * @memberof PageRenderer
     * @function ClearCategoriesParameters
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description clearing sub categories and attributes when another parent is selected
     */
    static function ClearCategoriesParameters(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        TAParameters.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_TOP_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            attributesParameter: "TA_ATTRIBUTES_SINGLE"

        });

        TAParameters.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_ATTRIBUTES_SINGLE"
        });
    }
}