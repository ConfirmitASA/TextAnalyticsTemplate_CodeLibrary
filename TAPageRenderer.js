/**
 * @class TAPageRenderer
 * @classdesc Class helping building all pages
 */
class TAPageRenderer{
    /**
     * @memberof TAPageRenderer
     * @function InitiateParameters
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description Setting default values for parameters in the first run
     */
    static function InitiateParameters(context){
        if(context.component.SubmitSource === "lstQuestion") {
            var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
            var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
            context.state.Parameters["TA_INCLUDE_WORDS"] = null;
            context.state.Parameters["TA_EXCLUDE_WORDS"] = null;

            TAParameterUtilities.SetDefaultParameterValues(
                {
                    context: context,
                    parameterValues: TADefaultParameters.values.concat(
                        {
                            Id: "TA_CORRELATION_QUESTION",
                            Value: folder.GetCorrelationVariables()[0]
                        }
                    )
                }
            )
        }

        TAParameterUtilities.SetDefaultParameterValuesForEmpty({
            context: context,
            parameterValues: TADefaultParameters.values.concat(
                {
                    Id: "TA_FOLDERS",
                    Value: (Config.TAQuestions[0].DatasourceId + Config.TAQuestions[0].TAQuestionName + Config.TAQuestions[0].TAModelNo)
                }
            ).concat(
                {
                    Id: "TA_CORRELATION_QUESTION",
                    Value: Config.TAQuestions[0].CorrelationVariableId[0]
                }
            )
        });
    }

    /**
     * @memberof TAPageRenderer
     * @function InitiateFilters
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description clearing filters when necessary
     */
    static function InitiateFilters(context){
        if(context.component.SubmitSource === "ClearFilters" || context.component.SubmitSource === "btnClearFilters" || context.component.SubmitSource === "lstQuestion"){
            TAFilterComponents.ClearFilters(context);

            var cjParameterInfo = TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === "TA_CJ_CARDS"});
            var sentimentParameterInfo = TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === "TA_COMMENTS_SENTIMENT"});
            var allCategoriesParameterInfo = TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === "TA_ALL_CATEGORIES"});
            var categoryParameterInfo = TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === "TA_TOP_CATEGORIES_SINGLE"});
            var subCategoryParameterInfo = TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === "TA_SUB_CATEGORIES_SINGLE"});
            var attributeParameterInfo = TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === "TA_ATTRIBUTES_SINGLE"});
            TAParameterUtilities.SetDefaultParameterValues({
                context: context,
                parameterValues: [cjParameterInfo, sentimentParameterInfo, allCategoriesParameterInfo, categoryParameterInfo, subCategoryParameterInfo, attributeParameterInfo]
            });

            var dateParameters = TADefaultParameters.dateParameters;

            for(var i = 0; i < dateParameters.length; ++i)
                context.state.Parameters[dateParameters[i]] = null;
        }
    }

    /**
     * @memberof TAPageRenderer
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
            selectedCategory = TAParametersBuilder.GetSelectedCategory({
                context: context,
                categoriesParameterName: "TA_TOP_CATEGORIES_SINGLE",
                subCategoriesParameterName: "TA_SUB_CATEGORIES_SINGLE",
                attributesParameterName: "TA_ATTRIBUTES_SINGLE"
            });

            context.state.Parameters['TA_ALL_CATEGORIES'] = new ParameterValueResponse(selectedCategory);
        }else {
            selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
            TAParametersBuilder.SetSelectedCategory({
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
     * @memberof TAPageRenderer
     * @function SetLastVisitedPage
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {String} pageId
     * @description setting last visited page for the filter page
     */
    static function SetLastVisitedPage(context, pageId){
        context.state.Parameters["TA_LAST_VISITED_PAGE"] = new ParameterValueResponse(pageId);
    }

    /**
     * @memberof TAPageRenderer
     * @function ClearCategoriesParameters
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @description clearing sub categories and attributes when another parent is selected
     */
    static function ClearCategoriesParameters(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        TAParametersBuilder.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_TOP_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            attributesParameter: "TA_ATTRIBUTES_SINGLE"

        });

        TAParametersBuilder.ClearSubcategoriesParameters({
            context: context,
            folderId: selectedFolder,
            value: "emptyv",
            categoriesParameter: "TA_SUB_CATEGORIES_SINGLE",
            subcategoriesParameter: "TA_ATTRIBUTES_SINGLE"
        });
    }
}