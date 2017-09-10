/**
 * @class Page_filters
 * @classdesc Static class for Reportal Page filters components
 */
class Page_filters{
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
        Config.SetTALibrary(context);

        PageRenderer.InitiateParameters(context);
        PageRenderer.InitiateFilters(context)
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
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new FilterComponents({
            context: context,
            filterQuestions: folder.GetFilterQuestions(),
            dataSource: folder.GetDatasourceId()
        });

        return FilterPanel.lstFilterList_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof Page_filters
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new FilterComponents(context);

        FilterPanel.txtFilterTitle_Render({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        })
    }

    /**
     * @memberof Page_filters
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new FilterComponents(context);

        return FilterPanel.lstFilterList_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof Page_filters
     * @function txtQuestion_Hide
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtQuestion_Hide(context){
        return false

    }

    /**
     * @memberof Page_filters
     * @function txtQuestion_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtQuestion_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary['Question'];
        context.component.Output.Append(label);

    }

    /**
     * @memberof Page_filters
     * @function txtDateFrom_Hide
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtDateFrom_Hide(context){
        return false

    }

    /**
     * @memberof Page_filters
     * @function txtDateFrom_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtDateFrom_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary['From'];
        context.component.Output.Append(label);

    }

    /**
     * @memberof Page_filters
     * @function txtDateTo_Hide
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtDateTo_Hide(context){
        return false

    }

    /**
     * @memberof Page_filters
     * @function txtDateTo_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtDateTo_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary['To'];
        context.component.Output.Append(label);

    }
}