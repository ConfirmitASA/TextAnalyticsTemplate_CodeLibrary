/**
 * @class TAPageMaster
 * @classdesc Static class for Reportal Page master components
 */
class TAPageMaster{
    /**
     * @memberof TAPageMaster
     * @function FiltersButtonHtml_Hid
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function FiltersButtonHtml_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterQuestions = folder.GetFilterQuestions()
        return filterQuestions.length < 4
    }

    /**
     * @memberof TAPageMaster
     * @function FiltersButtonHtml_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function FiltersButtonHtml_Render(context){
        var htmlText = '<button type="button" class="filter-button" onclick="javascript:document.querySelector(\'.goToFiltersPage input\').click()" title="Filters">'+
                '<svg width="16" height="12" viewBox="0 0 16 12">'+
                    '<path xmlns="http://www.w3.org/2000/svg" d="M 0 0 l 6 6 v 6 l 4 -1 V 6 l 6 -6 Z"></path>'+
                '</svg>'+
                '<svg width="10" height="10" viewBox="0 0 10 10">'+
                    '<path xmlns="http://www.w3.org/2000/svg" clip-rule="evenodd" fill-rule="evenodd" d="M 10 4 H 6 V 0 H 4 v 4 H 0 v 2 h 4 v 4 h 2 V 6 h 4 Z"></path>'+
                '</svg>'+
            '</button>';
        context.component.Output.Append(htmlText);
    }

    /**
     * @memberof TAPageMaster
     * @function Filters_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Filters_Hide(context){
        return false
    }

    /**
     * @memberof TAPageMaster
     * @function Filters_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Filters_Render(context){
        context.component.TargetPage = "filters"
    }

    /**
     * @memberof TAPageMaster
     * @function FilterSummary_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function FilterSummary_Render(context){
        var filterSummary ;
        var summarySegments = [];

        Config.SetTALibrary(context);

        var filterComponents = new TAFilterComponents(context);

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);

        var currentLaguage = context.report.CurrentLanguage;
        var curDictionary = Translations.dictionary(currentLaguage);

        summarySegments.push(("<div>"+curDictionary['Selected question']+" = "+(selectedFolder ? selectedFolder : Config.GetTALibrary().GetFolderById(selectedFolder).GetName()) +"</div>"));

        var startDate = !context.state.Parameters.IsNull("TA_DATE_FROM") && context.state.Parameters.GetDate("TA_DATE_FROM").ToShortDateString();

        if(startDate){
            summarySegments.push(("<div>"+curDictionary['Start date']+" = " + startDate + "</div>"));
        }

        var endDate = !context.state.Parameters.IsNull("TA_DATE_TO") && context.state.Parameters.GetDate("TA_DATE_TO").ToShortDateString();

        if(endDate){
            summarySegments.push(("<div>"+curDictionary['End date']+" = " + endDate + "</div>"));
        }

        var cj_parameter = !context.state.Parameters.IsNull("TA_CJ_CARDS") &&
            !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'customer_journey') &&
            context.state.Parameters.GetString("TA_CJ_CARDS") !== 'emptyv' &&
            context.state.Parameters.GetString("TA_CJ_CARDS");

        if(cj_parameter){
            var indexOfAsterisk = cj_parameter.indexOf('*');
            summarySegments.push(("<div>" + (
                indexOfAsterisk >= 0 ?
                    (cj_parameter.substr(0, indexOfAsterisk) + ' = ' +   (ParameterValueResponse)(context.state.Parameters['TA_CJ_CARDS']).DisplayValue) :
                    (cj_parameter + ' is answered')
            ) + "</div>"));
        }

        var codes = filterComponents.GetAllAnsweredFilterCodes(context);

        for( var i = 0 ; i < codes.length; i++){
            summarySegments.push(( "<div>" + codes[i].questionTitle + " = "+ codes[i].texts.join(" | ")+"</div>"));
        }

        filterSummary = summarySegments.join("<span>AND</span>");

        context.component.Output.Append(filterSummary);


        /*        if( codes.length > 0 || startDate || endDate || cj_parameter)
                    context.component.Output.Append("<button title='Clear filters' onclick='javascript:document.querySelector(\".filters-clear-button input\").click()' style = 'padding: 1px'>"+
                        "   <svg width='10' height='10' class='icon-circle-x'>" +
                        "       <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 153.5 122'>"+
                        "           <style>:root&gt;svg{display:none}:root&gt;svg:target{display:block}</style>"+
                        "           <svg id='circle-x' viewBox='0 0 12 12' data-name='Layer 1'>" +
                        "               <title>!svg-icons</title>" +
                        "               <path d='M 6 0 a 6 6 0 1 0 6 6 a 6 6 0 0 0 -6 -6 Z m 3 4.06 L 7.06 6 L 9 7.94 V 9 H 7.94 L 6 7.06 L 4.06 9 H 3 V 7.94 L 4.94 6 L 3 4.06 V 3 h 1.06 L 6 4.94 L 7.94 3 H 9 v 1.06 Z' />" +
                        "           </svg>" +
                        "       </svg>" +
                        "   </svg>"+
                        "</button>");
        */

        if( codes.length > 0 || startDate || endDate || cj_parameter)
            context.component.Output.Append("<button title='Clear filters'  onclick='javascript:document.querySelector(\".filters-clear-button input\").click()' class='btn btn-primary'>"+
                "Clear Filters"+
                "</button>");

    }

    /**
     * @memberof TAPageMaster
     * @function ClearFilters_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function ClearFilters_Hide(context){
        var hideButton = true;
        var filterComponents = new TAFilterComponents(context);
        hideButton = !filterComponents.GetAllAnsweredFilterCodes(context).length > 0 && context.state.Parameters.IsNull("TA_DATE_FROM") && context.state.Parameters.IsNull("TA_DATE_TO") && context.state.Parameters.IsNull("TA_CJ_CARDS");

        return hideButton
    }

    /**
     * @memberof TAPageMaster
     * @function ClearFilters_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function ClearFilters_Render(context){

    }

    /**
     * @memberof TAPageMaster
     * @function txtQuestion_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtQuestion_Hide(context){
        return false
    }

    /**
     * @memberof TAPageMaster
     * @function txtQuestion_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtQuestion_Render(context){
        var label = Translations.dictionary(context.report.CurrentLanguage)['Question'];
        context.component.Output.Append(label);
    }

    /**
     * @memberof TAPageMaster
     * @function txtDateFrom_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtDateFrom_Hide(context){
        return false
    }


    /**
     * @memberof TAPageMaster
     * @function txtDateFrom_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtDateFrom_Render(context){
        var label = Translations.dictionary(context.report.CurrentLanguage)['From'];
        context.component.Output.Append(label);

    }

    /**
     * @memberof TAPageMaster
     * @function txtDateTo_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtDateTo_Hide(context){
        return false

    }

    /**
     * @memberof TAPageMaster
     * @function txtDateTo_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtDateTo_Render(context){
        var label = Translations.dictionary(context.report.CurrentLanguage)['To'];
        context.component.Output.Append(label);

    }

    /**
     * @memberof TAPageMaster
     * @function btnApplyFilters_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnApplyFilters_Hide(context){
        return false
    }

    /**
     * @memberof TAPageMaster
     * @function btnApplyFilters_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnApplyFilters_Render(context){
        TAFilterPanel.btnSave_Render(context);
    }

    /**
     * @memberof TAPageMaster
     * @function hierarchyComponent_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function hierarchyComponent_Hide(context) {
        return !context.report.PersonalizedQuestion
    }

    /**
     * @memberof TAPageMaster
     * @function txtHierarchyLabel_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtHierarchyLabel_Hide(context) {
        return !context.report.PersonalizedQuestion
    }

    /**
     * @memberof TAPageMaster
     * @function txtHierarchyLabel_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtHierarchyLabel_Render(context) {
        var label = Translations.dictionary(context.report.CurrentLanguage)["Hierarchy"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof TAPageMaster
     * @function txtPageTitle_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtPageTitle_Hide(context){
        return false
    }

    /**
     * @memberof TAPageMaster
     * @function txtPageTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtPageTitle_Render(context){
        var label = Translations.dictionary(context.report.CurrentLanguage)["What people are talking about"];
        context.component.Output.Append(label);
    }

    /**
     * @memberof TAPageMaster
     * @function txtFilterTitle_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtFilterTitle_Hide(context, filterNumber){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new TAFilterComponents(context);

        return TAFilterPanel.txtFilterTitle_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof TAPageMaster
     * @function txtFilterTitle_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     */
    static function txtFilterTitle_Render(context, filterNumber){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new TAFilterComponents(context);

        TAFilterPanel.txtFilterTitle_Render({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof TAPageMaster
     * @function lstFilterList_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @param {Number} filterNumber
     * @returns {Boolean}
     */
    static function lstFilterList_Hide(context, filterNumber){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);

        var filterComponents = new TAFilterComponents(context);

        return TAFilterPanel.lstFilterList_Hide({
            context: context,
            filterComponents: filterComponents,
            filterNumber: filterNumber
        });
    }

    /**
     * @memberof TAPageMaster
     * @function rbDistributionToggle_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function rbDistributionToggle_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') !== 'detailed_analysis';
    }

    /**
     * @memberof TAPageMaster
     * @function txtCustomerJourney_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCustomerJourney_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'customer_journey';
    }

    /**
     * @memberof TAPageMaster
     * @function txtCustomerJourney_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtCustomerJourney_Render(context){
        var label = Translations.dictionary(context.report.CurrentLanguage)['Customer Journey Point'];
        context.component.Output.Append(label);
    }


    /**
     * @memberof TAPageMaster
     * @function lstCustomerJourney_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstCustomerJourney_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'customer_journey';
    }
}