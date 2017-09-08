/**
 * @class TAHelper
 * @classdesc Class cntaining additional static functions to work with text analytics
 */
class TAHelper{

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

}