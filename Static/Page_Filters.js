/**
 * @class Page_filters
 * @classdesc Static class for Reportal Page filters components
 */
class Page_filters{
    private static var _filterComponents;
    private static var _folder;
    private static const _defaultParameters = [];
    private static var _currentLanguage;
    private static var _curDictionary;
    private static var _filter_panel;
    /**
     * @memberof Page_filters
     * @function Hide
     * @description function to hide the page
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Hide(context){
        return false;
    }

    /**
     * @memberof Page_filters
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
    _currentLanguage = context.report.CurrentLanguage;
    _curDictionary = Translations.dictionary(_currentLanguage);
        Config.SetTALibrary(TAHelper.GetGlobals(context));
        _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(), Config.DS_Main);
        _filter_panel = new FilterPanel(_filterComponents);
        if(context.component.SubmitSource == "btnClearFilters"){
                _filterComponents.ClearFilters();
            context.state.Parameters["TA_DATE_FROM"] = null;
            context.state.Parameters["TA_DATE_TO"] = null;
            }
        if(context.component.SubmitSource == "btnClearDateFilter"){
            context.state.Parameters["TA_DATE_FROM"] = null;
            context.state.Parameters["TA_DATE_TO"] = null;
        }
        if(context.component.SubmitSource == "lstQuestion") {
            context.state.Parameters["TA_ALL_CATEGORIES"] = null;
            context.state.Parameters["TA_ATTRIBUTES_SINGLE"] = null;
            context.state.Parameters["TA_LEVEL"] = null;
            context.state.Parameters["TA_SUB_CATEGORIES_SINGLE"] = null;
            context.state.Parameters["TA_TOP_CATEGORIES_SINGLE"] = null;
            context.state.Parameters["TA_VIEW_BY"] = null;
        }

        var paramUtils = new ParameterUtilities(TAHelper.GetGlobals(context));
        paramUtils.SetDefaultParameterValues(_defaultParameters);
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        /*try {
            selectedFolder = !context.state.Parameters.IsNull("TA_FOLDERS") ? context.state.Parameters.GetString("TA_FOLDERS") : null;
        }catch(e){
            selectedFolder = null;
        }*/
        _folder = Config.GetTALibrary().GetFolderById(selectedFolder);
    }

    /**
     * @memberof Page_filters
     * @function btnSaveReturn_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnSaveReturn_Hide(context){
        return FilterPanel.btnSaveReturn_Hide(context);
    }

    /**
     * @memberof Page_filters
     * @function btnSaveReturn_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSaveReturn_Render(context){
        FilterPanel.btnSaveReturn_Render(context)
    }

    /**
     * @memberof Page_filters
     * @function btnSave_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnSave_Hide(context){
        return FilterPanel.btnSave_Hide(context);
    }

    /**
     * @memberof Page_filters
     * @function btnSave_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSave_Render(context){
        FilterPanel.btnSave_Render(context);
    }

    /**
     * @memberof Page_filters
     * @function btnClearFilters_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnClearFilters_Hide(context){
        return FilterPanel.btnClearFilters_Hide(context);
    }

    /**
     * @memberof Page_filters
     * @function btnClearFilters_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnClearFilters_Render(context){
        FilterPanel.btnClearFilters_Render(context);
    }

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function txtFilterTitle_Hide(context, filterNumber){
        return _filter_panel.txtFilterTitle_Hide(context, filterNumber);
    }

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
        _filter_panel.txtFilterTitle_Render(context, filterNumber)
    }

    /**
     * @memberof Page_filters
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
        return _filter_panel.lstFilterList_Hide(context, filterNumber);
    }

    static function txtQuestion_Hide(context){
    return false

}
    static function txtQuestion_Render(context){
    var label = _curDictionary['Question'];
    context.component.Output.Append(label);

}

    static function txtDateFrom_Hide(context){
    return false

}
    static function txtDateFrom_Render(context){
    var label = _curDictionary['From'];
    context.component.Output.Append(label);

}

    static function txtDateTo_Hide(context){
    return false

}
    static function txtDateTo_Render(context){
    var label = _curDictionary['To'];
    context.component.Output.Append(label);

}
}