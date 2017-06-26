/**
 * @class TAHelper
 * @classdesc Class cntaining additional static functions to work with text analytics
 */
class TAHelper{
    /**
     * @memberof TAHelper
     * @function GetGlobals
     * @description function to retrieve global parameters from given context
     * @param {Object} context
     * @returns {Object}
     */
    static function GetGlobals(context){
        return {
            pageContext: context.pageContext,
            report: context.report,
            user: context.user,
            state: context.state,
            confirmit: context.confirmit,
            log: context.log
        };
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
    static function GetSelectedCategory(state, categoriesParameterName, subCategoriesParameterName, attribtesPararmeterName){
        var categoriesParameter;
        if(categoriesParameterName)
            categoriesParameter = state.Parameters.GetString(categoriesParameterName);


        var subCategoriesParameter;
        if(subCategoriesParameterName)
            subCategoriesParameter= state.Parameters.GetString(subCategoriesParameterName);


        var attributesParameter;
        if(attribtesPararmeterName)
            attributesParameter = state.Parameters.GetString(attribtesPararmeterName);

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

    static function SetSelectedCategory(state, hierarchy, allCategoriesParameterValue, categoriesParameterName, subCategoriesParameterName, attribtesPararmeterName,log){
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
            log.LogDebug('not empty');
            var selectedCategory = hierarchy.GetObjectById(allCategoriesParameterValue);
            defaultParameterValues[selectedCategory.level].Value = selectedCategory.id;
            log.LogDebug('level: '+selectedCategory.level+' value: '+selectedCategory.id);
            if(selectedCategory.level > 0){
                defaultParameterValues[selectedCategory.level-1].Value = selectedCategory.parent
            }

            if(selectedCategory.level == 2){
                defaultParameterValues[0].Value = hierarchy.GetObjectById(selectedCategory.parent).parent
            }

        }

        for(var i = 0; i < defaultParameterValues.length; i++) {
            state.Parameters[defaultParameterValues[i].Id] = new ParameterValueResponse(defaultParameterValues[i].Value);
        }

}

    /**
     * @memberof TAHelper
     * @function GetSelfName
     * @description function to trim out parents cateories from the category name
     * @param {String} name
     * @param {String} separator
     * @returns {String}
     */
    static function GetSelfName(name, separator){
        var index = name.lastIndexOf(separator);
        return name.slice((index+1)).Trim();
    }

    /**
     * @memberof TAHelper
     * @function GetConfiguredVariables
     * @description function to get configured value from TAConfig or survey tags
     * @param {Object} globals
     * @param {Object} questionConfig
     * @param {Object} config
     * @param {Object} tag
     * @param {Object} defaultValue
     * @returns {Object}
     */
    static function GetConfiguredVariables(globals,questionConfig, config, tag, defaultValue){
        var result = [];
        if(!questionConfig || questionConfig.length == 0 || !questionConfig[0]){
            if( !config || config.length == 0 || !config[0]){
                if(!tag || tag.length == 0 || !tag[0]){
                    result = defaultValue;
                }else{
                    result = tag
                }
            }else{
                result = config;
            }
        }else{
            result = questionConfig
        }
        return result;
    }

    static function GetTagsFromSurvey(globals, datasourceId, tags){
        var result = false;
        var project = globals.report.DataSource.GetProject(datasourceId);
        var questions = project.GetQuestionsWithAnswers(false, tags);
        if(questions.length > 0)
            result = [];
        for (var i = 0; i < questions.length; i++){
            result.push(questions[i].QuestionId);
        }
        return result;
    }

    /**
     * @memberof TAHelper
     * @function SetLastVisitedPage
     * @description function to set the last visited page to the parameter
     * @param {Object} globals
     * @param {String} pageId
     */
    static function SetLastVisitedPage(globals, pageId){
        globals.state.Parameters["TA_LAST_VISITED_PAGE"] = new ParameterValueResponse(pageId);
    }
}