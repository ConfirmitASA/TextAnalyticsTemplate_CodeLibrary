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
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        //set current month values to date filters
        if (context.state.Parameters.IsNull("TA_LAST_VISITED_PAGE")) {
            var currentDate = DateTime.Today;
            var dateFromParameter: ParameterValueResponse = new ParameterValueResponse();
            var dateToParameter: ParameterValueResponse = new ParameterValueResponse();
            dateFromParameter.DateValue = new DateTime(currentDate.Year, currentDate.Month, 1);
            dateToParameter.DateValue = currentDate;
            context.state.Parameters["TA_DATE_FROM"] = dateFromParameter;
            context.state.Parameters["TA_DATE_TO"] = dateToParameter;
        }


        if(context.component.SubmitSource === "lstQuestion") {
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
            );
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

        var filterToClear = context.state.Parameters.GetString("TA_FILTER_TO_CLEAR");
        if(filterToClear) {
            if(filterToClear !== "TA_DATE_FROM" && filterToClear !== "TA_DATE_TO" && !filterToClear.Contains("FILTER")) {
                var filtersToClear = [];

                if(filterToClear === "TA_SUB_CATEGORIES_SINGLE" || filterToClear === "TA_TOP_CATEGORIES_SINGLE") {
                    filtersToClear.push("TA_ATTRIBUTES_SINGLE");
                }
                if(filterToClear === "TA_TOP_CATEGORIES_SINGLE") {
                    filtersToClear.push("TA_SUB_CATEGORIES_SINGLE");
                }
                filtersToClear.push(filterToClear);

                var filtersToClearInfo = [];
                for(var i = 0; i < filtersToClear.length; i++) {
                    filtersToClearInfo.push(TAArrayUtils.find(TADefaultParameters.values, function(item) {return item.Id === filtersToClear[i]}));
                }
                TAParameterUtilities.SetDefaultParameterValues({
                    context: context,
                    parameterValues: filtersToClearInfo
                });
            } else {
                context.state.Parameters[filterToClear] = null;
            }
        }
        context.state.Parameters["TA_FILTER_TO_CLEAR"] = null;
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
        if(submitSource === "lstCategory" || submitSource === "lstSubCategory" || submitSource === "lstAttribute"
            || submitSource === "btnSaveClearedFilter"){
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