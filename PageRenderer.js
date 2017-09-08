class PageRenderer{
    static function initiateParameters(context){
        if(context.component.SubmitSource === "lstQuestions") {
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
                    Value: (Config.TAQuestions[0].TAQuestionName+Config.TAQuestions[0].TAModelNo)
                }
            )
        });
    }

    static function initiateFilters(context){
        if(context.component.SubmitSource === "ClearFilters" || context.component.SubmitSource === "btnClearFilters" || context.component.SubmitSource === "lstQuestions"){
            FilterComponents.ClearFilters(context);
            var dateParameters = DefaultParameters.dateParameters;

            for(var i = 0; i < dateParameters.length; ++i)
                context.state.Parameters[dateParameters[i]] = null;
        }
    }

    static function processSelectedCategoryParameter(params){
        var context = params.context;
        var folder = params.folder;
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

    static function SetLastVisitedPage(context, pageId){
        context.state.Parameters["TA_LAST_VISITED_PAGE"] = new ParameterValueResponse(pageId);
    }
}