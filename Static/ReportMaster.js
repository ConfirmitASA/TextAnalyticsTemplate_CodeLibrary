/**
 * @class ReportMaster
 * @classdesc Static class for Report Master components
 */
class ReportMaster {

    /**
     * @memberof ReportMaster
     * @function CustomerLogo_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function CustomerLogo_Hide(context) {
        return false;
    }

    /**
     * @memberof ReportMaster
     * @function CustomerLogo_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function CustomerLogo_Render(context) {
        if(Config.CustomerLogo !== null) {
            context.component.Output.Append('<img class="customer-logo" src="' + Config.CustomerLogo + '" height="60px" >');
        }
    }

    /**
     * @memberof ReportMaster
     * @function btnApplyDateFilter_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnApplyDateFilter_Hide(context){
        return false
    }

    /**
     * @memberof ReportMaster
     * @function btnApplyDateFilter_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnApplyDateFilter_Render(context){
        context.component.Label = new Label(9, "Apply");
    }

    /**
     * @memberof ReportMaster
     * @function btnClearDateFilter_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function btnClearDateFilter_Hide(context){
        return (context.state.Parameters.IsNull("TA_DATE_FROM") && context.state.Parameters.IsNull("TA_DATE_TO"))
    }

    /**
     * @memberof ReportMaster
     * @function btnClearDateFilter_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnClearDateFilter_Render(context){
        context.component.Label = new Label(9, "Clear Date Filters");
    }
    static function txtFilterPanelScript_Render(context){
    var script = "<script type = \"text/javascript\">" +
        "(function(){"+
        "var filterpanel = new Reportal.Filterpanel({source: document, target: document.querySelector(\".reportal-filterpanel\")});"+
        "})()"+
        "</script>";
    context.component.Output.Append(script)

}

    static function hierarchyComponent_Render(context) {
    return !context.report.PersonalizedQuestion
}
}