/**
 * @class Page_correlation
 * @classdesc Static class for Reportal Page Impact Analysis components
 */
class Page_correlation{

    /**
     * @memberof Page_correlation
     * @function Render
     * @description function to render the page
     * @param {Object} context - {component: page, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Render(context){
        Config.SetTALibrary(context);
        TAPageRenderer.InitiateParameters(context);
        TAPageRenderer.InitiateFilters(context);
        TAPageRenderer.SetLastVisitedPage(context, "correlation");
        TAPageRenderer.ClearCategoriesParameters(context);

        TAPageRenderer.ProcessSelectedCategoryParameter(context);
    }

    /**
     * @memberof Page_correlation
     * @function txtCorrelationQuestion_Render
     * @description function to render the correlation variable selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCorrelationQuestion_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Correlation variable"];
        context.component.Output.Append(label);
        context.component.Output.Append(TAParameterValues.getCorrelationQuestionParameterValue(context));
    }

    /**
     * @memberof Page_correlation
     * @function tblCorrelation_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: table, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function tblCorrelation_Render(context){
        context.component.Caching.Enabled = false;
        var selectedQuestion = context.state.Parameters.GetString("TA_CORRELATION_QUESTION");

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var selectedCategory = context.state.Parameters.GetString('TA_ALL_CATEGORIES');
        var correlationTable = new TACorrelationTable({context: context, folder: folder, category: selectedCategory, question: selectedQuestion});

        correlationTable.GetTATableUtils().AddClasses(["reportal-table","reportal-categories", "correlation-table"]);
        correlationTable.GetTATableUtils().SetupDrilldown("TA_ALL_CATEGORIES", "correlation");
        correlationTable.GetTATableUtils().SetupHideEmptyRows(true);
    }

    /**
     * @memberof Page_correlation
     * @function txtHelp_Render
     * @description function to render helping text
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtHelp_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var text = '<div id="quadrant-table">'+
            currentDictionary["quadrant-table-text"]+
            '</div>'+
            '<div id="quadrant-chart">'+
            currentDictionary["quadrant-chart-text"]+
            '</div>';
        context.component.Output.Append(text);
    }

    /**
     * @memberof Page_correlation
     * @function txtPriorityIssues_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtPriorityIssues_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Priority Issues"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_correlation
     * @function txtStrength_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtStrength_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Strength"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_correlation
     * @function txtMonitor_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMonitor_Render(context) {
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Monitor and Improve"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_correlation
     * @function txtMaintain_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtMaintain_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var label = currentDictionary["Maintain"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof Page_correlation
     * @function txtCorrelationScript_Render
     * @description function to render the sentiment selector label
     * @param {Object} context - {component: text, pageContext: this.pageContext,report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCorrelationScript_Render(context){
        var chartColors = Config.Colors.ChartPalette;
        var areasColors = Config.Colors.AreasPalette;

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var correlationVariableId = context.state.Parameters.GetString("TA_CORRELATION_QUESTION");
        var correlationVariableName = folder.GetCorrelationVariableShownName();
        var dataSource =  Config.GetTALibrary().GetFolderById(selectedFolder).GetDatasourceId();
        var project  = context.report.DataSource.GetProject(dataSource);
        var correlationQuestion = project.GetQuestion(correlationVariableId);

        var palette = {
            chartColors: chartColors,
            areasColors: areasColors
        };

        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var chartInit = "<script>"+
            "new Reportal.CorrelationView({" +
            "   chartContainer: 'correlation-chart'," +
            "   tableContainer: 'correlation-tables-view'," +
            "   buttonsContainer: 'chart-tables-switcher'," +
            "   table: document.querySelector('.correlation-table')," +
            "   palette: palette," +
            "   questionName: '" + (correlationVariableName || correlationQuestion.Title || correlationVariableId) + "'," +
            "   translations: translations" +
            "});"+
            "</script>";

        context.component.Output.Append(JSON.print(currentDictionary,"translations"));
        context.component.Output.Append(JSON.print(palette,"palette"));
        context.component.Output.Append(chartInit);
    }

    /**
     * @memberof Page_correlation_dev
     * @function txtInfoIconScript_Render
     * @description function to render Page Info text
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtInfoIconScript_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);
        var infoText = currentDictionary['correlation info text'];

        var infoInit = "<script>" +
            "var title = document.querySelector('.dashboard__widget.dashboard__widget--large.r2i-widget');" +
            "title.style.position = 'relative';" +
            "var correlationIcon = new Reportal.InfoIcon({" +
            "container: title," +
            "infoText: '" + infoText + "'});" +
            "correlationIcon.infoIcon.style.right = '16px';" +
            "correlationIcon.infoIcon.style.top = '16px';" +
            "</script>";

        context.component.Output.Append(infoInit);
    }
}