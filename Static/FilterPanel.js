/**
 * @class FilterPanel
 * @classdesc static class to work with the filterpanel and filterpage
 */
class FilterPanel{

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
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["Save and return"]);
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
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["Save"]);
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
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["Clear filters"]);
        context.component.TargetPage = "filters";
    }

    /**
     * @memberof FilterPanel
     * @function txtFilterTitle_Hide
     * @param {Object} params - {
     *                              context: {context: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *                              filterComponents: {FilterComponents}
     *                              filterNumber: {Number}
     *                           }
     * @returns {Boolean}
     */
    static function txtFilterTitle_Hide(params){
        var context = params.context;
        var filterComponents = params.filterComponents;
        var filterNumber = params.filterNumber;
        var filterQuestion = filterComponents.GetFilterQuestion(filterNumber-1);
        return !filterQuestion
    }

    /**
     * @memberof FilterPanel
     * @function txtFilterTitle_Render
     * @param {Object} params - {
     *                              context: {context: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *                              filterComponents: {FilterComponents}
     *                              filterNumber: {Number}
     *                           }
     */
    static function txtFilterTitle_Render(params){
        var context = params.context;
        var filterComponents = params.filterComponents;
        var filterNumber = params.filterNumber;

        var filterTitle = filterComponents.GetFilterTitle(filterNumber-1);
        if(filterTitle)
            context.component.Output.Append(filterTitle);
    }

    /**
     * @memberof FilterPanel
     * @function lstFilterList_Hide
     * @param {Object} params - {
     *                              context: {context: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *                              filterComponents: {FilterComponents}
     *                              filterNumber: {Number}
     *                           }
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(params){
        var context = params.context;
        var filterComponents = params.filterComponents;
        var filterNumber = params.filterNumber;

        var filterQuestion = filterComponents.GetFilterQuestion(filterNumber-1);
        return !filterQuestion
    }
}