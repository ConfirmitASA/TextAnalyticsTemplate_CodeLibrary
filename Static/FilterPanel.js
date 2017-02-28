/**
 * Created by MariaSo on 20/01/2017.
 */
class FilterPanel{
    private var _filterComponents;
    private var _current_dictionary;

    function FilterPanel(filterComponents, currentDictionary){
        _filterComponents = filterComponents;
        _current_dictionary = currentDictionary;
    }

    /**
     * @memberof FilterPanel
     * @function btnSaveReturn_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnSaveReturn_Hide(context){
    return false
}

    /**
     * @memberof FilterPanel
     * @function btnSaveReturn_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSaveReturn_Render(context){
    context.component.Label = new Label(9,"Save and Return");
    context.component.TargetPage = context.state.Parameters.GetString("TA_LAST_VISITED_PAGE");
}

    /**
     * @memberof FilterPanel
     * @function btnSave_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnSave_Hide(context){
    return false
}

    /**
     * @memberof FilterPanel
     * @function btnSave_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSave_Render(context){
    context.component.Label = new Label(9,"Save");
}

    /**
     * @memberof FilterPanel
     * @function btnClearFilters_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnClearFilters_Hide(context){
    return false
}

    /**
     * @memberof FilterPanel
     * @function btnClearFilters_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnClearFilters_Render(context){
    context.component.Label = new Label(9,"Clear Filters");
    context.component.TargetPage = "filters";
}

    /**
     * @memberof FilterPanel
     * @function txtFilterTitle_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    function txtFilterTitle_Hide(context, filterNumber){
    var filterQuestion = _filterComponents.GetFilterQuestion(filterNumber-1);
    return !filterQuestion
}

    /**
     * @memberof FilterPanel
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    function txtFilterTitle_Render(context, filterNumber){
    var filterTitle = _filterComponents.GetFilterTitle(filterNumber-1);
    if(filterTitle)
        context.component.Output.Append(filterTitle);
}

    /**
     * @memberof FilterPanel
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    function lstFilterList_Hide(context, filterNumber){
    var filterQuestion = _filterComponents.GetFilterQuestion(filterNumber-1);
    return !filterQuestion
}

    function txtLanguage_Render(context){
    var LanguageTitle = _current_dictionary['Language'];
    context.component.Output.Append(LanguageTitle);
}

    function txtLanguage_Hide(context){
    return !context.report.Languages.length > 1
}

    function lstLanguage_Hide(context){
    return !context.report.Languages.length > 1
}
}