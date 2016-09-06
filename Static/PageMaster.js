/**
 * @class PageMaster
 * @classdesc Static class for Reportal Page master components
 */
class PageMaster{
    private static var _filterComponents;

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
        _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary());

        var codes = _filterComponents.GetAllAnsweredFilterCodes();
        for( var i = 0 ; i < codes.length; i++){
            summarySegments.push(( "<div>" + codes[i].questionTitle + " = "+ codes[i].texts.join(" | ")+"</div>"));
        }

        filterSummary = summarySegments.join("<span>AND</span>");
        context.component.Output.Append(filterSummary);
        if( codes.length > 0 )
            context.component.Output.Append('<button title="Clear filters" onclick="javascript:document.querySelector(\'.filters-clear-button input\').click()" style = "padding: 1px"><svg width="10" height="10" class="icon-circle-x"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""/discoveryanalytics/svg-icons/stack/svg/sprite.stack.svg#circle-x"></use></svg></button>');
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
        _filterComponents = new FilterComponents(TAHelper.GetGlobals(context), Config.GetTALibrary());

        hideButton = !_filterComponents.GetAllAnsweredFilterCodes().length > 0;

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
}