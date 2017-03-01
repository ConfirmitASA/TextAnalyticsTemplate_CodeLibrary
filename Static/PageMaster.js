/**
 * @class PageMaster
 * @classdesc Static class for Reportal Page master components
 */
class PageMaster{
    private static var _filterComponents;


    /**
     * @memberof PageMaster
     * @function FiltersButtonHtml_Hide
     * @description function to hide the Filters button html
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function FiltersButtonHtml_Hide(context){
        var filterQuestions = Config.GetTALibrary().GetFilterQuestions()
        return filterQuestions.length == 0
    }

    /**
     * @memberof PageMaster
     * @function FiltersButtonHtml_Render
     * @description function to render the filters button
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
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
     * @memberof PageMaster
     * @function Filters_Hide
     * @description function to hide the Ffilters button
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function Filters_Hide(context){
        return false
    }

    /**
     * @memberof PageMaster
     * @function Filters_Render
     * @description function to render the filters button
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function Filters_Render(context){
        context.component.TargetPage = "filters"
    }

    /**
     * @memberof PageMaster
     * @function FilterSummary_Render
     * @description function to render the filterSummary
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function FilterSummary_Render(context){
        var filterSummary ;
        var summarySegments = [];
        Config.SetTALibrary();
        _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(), Config.DS_Main);
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var currentLaguage = context.report.CurrentLanguage;
        var curDictionary = Translations.dictionary(currentLaguage);
        summarySegments.push(("<div>"+curDictionary['Selected question']+" = "+(selectedFolder ? selectedFolder : Config.GetTALibrary().GetFolderById(selectedFolder).GetId()) +"</div>"));

        var startDate = !context.state.Parameters.IsNull("TA_DATE_FROM") && context.state.Parameters.GetDate("TA_DATE_FROM").ToShortDateString();

        if(startDate){
            summarySegments.push(("<div>"+curDictionary['Start date']+" = " + startDate + "</div>"));
        }
        var endDate = !context.state.Parameters.IsNull("TA_DATE_TO") && context.state.Parameters.GetDate("TA_DATE_TO").ToShortDateString();

        if(endDate){
            summarySegments.push(("<div>"+curDictionary['End date']+" = " + endDate + "</div>"));
        }

        var codes = _filterComponents.GetAllAnsweredFilterCodes();
        for( var i = 0 ; i < codes.length; i++){
            summarySegments.push(( "<div>" + codes[i].questionTitle + " = "+ codes[i].texts.join(" | ")+"</div>"));
        }

        filterSummary = summarySegments.join("<span>AND</span>");
        context.component.Output.Append(filterSummary);
        if( codes.length > 0 || startDate || endDate)
            context.component.Output.Append("<button title='Clear filters' onclick='javascript:document.querySelector(\".filters-clear-button input\").click()' style = 'padding: 1px'><svg width='10' height='10' class='icon-circle-x'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='/discoveryanalytics/svg-icons/stack/svg/sprite.stack.svg#circle-x'></use></svg></button>");
    }

    /**
     * @memberof PageMaster
     * @function ClearFilters_Hide
     * @description function to render the Clear filters button
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function ClearFilters_Hide(context){
        var hideButton = true;
        _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary().GetFilterQuestions(), Config.DS_Main);

        hideButton = !_filterComponents.GetAllAnsweredFilterCodes().length > 0 && context.state.Parameters.IsNull("TA_DATE_FROM") && context.state.Parameters.IsNull("TA_DATE_TO");

        return hideButton
    }

    /**
     * @memberof PageMaster
     * @function ClearFilters_Render
     * @description function to render the clear filters button
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function ClearFilters_Render(context){

    }

    static function txtQuestion_Hide(context){
    return false

}
    static function txtQuestion_Render(context){
        var label = Translations.dictionary(context.report.CurrentLanguage)['Question'];
        context.component.Output.Append(label);

}

    static function txtDateFrom_Hide(context){
    return false

}
    static function txtDateFrom_Render(context){
    var label = Translations.dictionary(context.report.CurrentLanguage)['From'];
    context.component.Output.Append(label);

}

    static function txtDateTo_Hide(context){
    return false

}
    static function txtDateTo_Render(context){
    var label = Translations.dictionary(context.report.CurrentLanguage)['To'];
    context.component.Output.Append(label);

}

    static function btnApplyFilters_Hide(context){
    return false
}
    static function btnApplyFilters_Render(context){
    FilterPanel.btnSave_Render(context);
}

    static function hierarchyComponent_Hide(context) {
    return !context.report.PersonalizedQuestion
}

    static function txtHierarchyLabel_Hide(context) {
    return !context.report.PersonalizedQuestion
}

    static function txtHierarchyLabel_Render(context) {
    var label = Translations.dictionary(context.report.CurrentLanguage)["Hierarchy"];
    context.component.Output.Append(label);
}

}