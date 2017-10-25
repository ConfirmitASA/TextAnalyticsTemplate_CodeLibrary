/**
 * @class TAFilterPanel
 * @classdesc static class to work with the filterpanel and filterpage
 */
class TAFilterPanel{

    /**
     * @memberof TAFilterPanel
     * @function btnSaveReturn_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnSaveReturn_Hide(context){
        return false
    }

    /**
     * @memberof TAFilterPanel
     * @function btnSaveReturn_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSaveReturn_Render(context){
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["Save and return"]);
        context.component.TargetPage = context.state.Parameters.GetString("TA_LAST_VISITED_PAGE");
    }

    /**
     * @memberof TAFilterPanel
     * @function btnSave_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnSave_Hide(context){
        return false
    }

    /**
     * @memberof TAFilterPanel
     * @function btnSave_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSave_Render(context){
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["Save"]);
    }

    /**
     * @memberof TAFilterPanel
     * @function btnClearFilters_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnClearFilters_Hide(context){
        return false
    }

    /**
     * @memberof TAFilterPanel
     * @function btnClearFilters_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnClearFilters_Render(context){
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["Clear filters"]);
        context.component.TargetPage = "filters";
    }

    /**
     * @memberof TAFilterPanel
     * @function txtFilterTitle_Hide
     * @param {Object} params - {
     *                              context: {context: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *                              filterComponents: {TAFilterComponents}
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
     * @memberof TAFilterPanel
     * @function txtFilterTitle_Render
     * @param {Object} params - {
     *                              context: {context: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *                              filterComponents: {TAFilterComponents}
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
     * @memberof TAFilterPanel
     * @function lstFilterList_Hide
     * @param {Object} params - {
     *                              context: {context: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log},
     *                              filterComponents: {TAFilterComponents}
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