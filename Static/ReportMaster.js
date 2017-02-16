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

    var darkPrimaryColor = Config.Design.darkPrimaryColor;
    var defaultPrimaryColor = Config.Design.defaultPrimaryColor;
    var lightPrimaryColor = Config.Design.lightPrimaryColor;
    var textPrimaryColor = Config.Design.textPrimaryColor;
    var darkAccentColor = Config.Design.darkAccentColor;
    var defaultAccentColor = Config.Design.defaultAccentColor;
    var lightAccentColor = Config.Design.lightAccentColor;
    var primaryBackgroundColor = Config.Design.primaryBackgroundColor;
    var primaryTextColor = Config.Design.primaryTextColor;
    var secondaryTextColor = Config.Design.secondaryTextColor;
    var disabledTextColor = Config.Design.disabledTextColor;
    var dividerColor = Config.Design.dividerColor;
    var lightDividerColor = Config.Design.lightDividerColor;
    var positiveColor = Config.Design.positiveColor;
    var neutralColor = Config.Design.neutralColor;
    var negativeColor = Config.Design.negativeColor;

    var str = "<style>";

    str += "* {outline-color: " + darkAccentColor +
        "\n;}a:hover, .link:hover {color: " + darkAccentColor +
        "\n;}.btn.btn-primary:hover,      .btn.btn-primary:active,      .btn.btn-primary:focus,      button.btn-primary:hover,      button.btn-primary:active,      button.btn-primary:focus,.dd-wrapper .dd-button-menu button:hover {background-color: " + darkAccentColor +
        "\n;}body, body.reportal-viewmode,.reportal-table .cf_positive,  .reportal-table .cf_neutral,  .reportal-table .cf_negative {color: " + primaryTextColor +
        "\n;}[class^=icon-],.yui3-menu-horizontal ul > li > a {fill: " + primaryTextColor +
        "\n;}body, body.reportal-viewmode,.yui3-menu-horizontal ul > li > a {background-color: " + defaultPrimaryColor +
        "\n;}.report-filters-horizontal,.yui3-menu-horizontal ul > li.css-menu-selected > a,      .yui3-menu-horizontal ul > li.css-menu-child-selected > a,      .yui3-menu-horizontal ul > li.css-menu-topitem > a:hover,      .yui3-menu-horizontal ul > li > a.yui3-menu-label-menuvisible:not(.css-menu-sublabel),.yui3-menu-horizontal ul ul > li.yui3-menuitem-active > a,        .yui3-menu-horizontal ul ul > li > a.yui3-menu-label-active,        .yui3-menu-horizontal ul ul > li > a.yui3-menu-label-menuvisible,.reportal-table>thead>tr>td,  .reportal-table>thead>tr>th,.reportal-table.reportal-barchart>thead>tr,.reportal-table .btn.hierarchy-search.visible {background-color: " + lightPrimaryColor +
        "\n;}.kpi-tile,.reportal-hierarchy-table tr.firstInBlock>td:first-child {background: " + lightPrimaryColor +
        "\n;}a, .link {color: " + defaultAccentColor +
        "\n !important;}.yui-ac-bd>ul>li.yui-ac-highlight {background-color: " + defaultAccentColor +
        "\n !important;}.hitlist-filter {border-color: " + defaultAccentColor +
        "\n !important;}.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-filter-apply,.hitlist-nav-button,.hitlist-nav-page,.yui-calcontainer>table td.calcell.selected>a,.yui-calcontainer>table .calnav:hover,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn.yui-default {background: " + defaultAccentColor +
        "\n !important;}.dd-wrapper .dd-header .dd-search-input:focus,.dd-wrapper .dd-header .dd-item-text:focus {outline-color: " + defaultAccentColor +
        "\n !important;}a:active,  a:visited,  .link:active,  .link:visited {color: " + defaultAccentColor +
        "\n;}.btn.btn-primary, button.btn-primary,.dd-wrapper .dd-button-menu button {background-color: " + defaultAccentColor +
        "\n;}.dd-wrapper .dd-button-menu button:focus {outline-color: " + defaultAccentColor +
        "\n;}.btn.btn-primary, button.btn-primary,.btn.btn-primary:hover,      .btn.btn-primary:active,      .btn.btn-primary:focus,      button.btn-primary:hover,      button.btn-primary:active,      button.btn-primary:focus,.filter-bar .well-filter-summary,.toggle input:checked + label {color: " + textPrimaryColor +
        "\n;}.filter-bar .filter-button {background-color: " + textPrimaryColor +
        "\n;}.filter-bar .filter-button:hover,    .filter-bar .filter-button:active,    .filter-bar .filter-button:focus {fill: " + textPrimaryColor +
        "\n;}.icon-face-positive,.cf_positive {fill: " + positiveColor +
        "\n;}.cf_positive {color: " + positiveColor +
        "\n;}.icon-face-neutral,.cf_neutral {fill: " + neutralColor +
        "\n;}.cf_neutral {color: " + neutralColor +
        "\n;}.icon-face-negative,.cf_negative {fill: " + negativeColor +
        "\n;}.cf_negative {color: " + negativeColor +
        "\n;}.filter-bar .filter-button {fill: " + darkPrimaryColor +
        "\n;}.filter-bar .filter-button:hover,    .filter-bar .filter-button:active,    .filter-bar .filter-button:focus,.filter-bar .well-filter-summary:hover {background-color: " + darkPrimaryColor +
        "\n;}.toggle input:checked + label {background: " + darkPrimaryColor +
        "\n;}.toggle input:checked + label {border-color: " + darkPrimaryColor +
        "\n;}.toggle input:not(checked) + label {color: " + darkPrimaryColor +
        "\n;}.filter-bar .well-filter-summary {background: " + secondaryTextColor +
        "\n;}.reportal-checkbox > label, .reportal-radio > label, .reportal-select > label, .reportal-input > label, .reportal-datepicker > label, .reportal-hierarchy > label,[type=radio]:disabled:checked + label:after, [type=checkbox]:disabled:checked + label:after,[type=\"checkbox\"] + label:after,.dd-target-button .dd-target-button-arrow, .dd-target-button .dd-target-button-text {color: " + secondaryTextColor +
        "\n;}[type=radio] + label:after {background-color: " + secondaryTextColor +
        "\n;}.legend .cf_positive:before,.reportal-table>tbody>tr>td.cf_positive:after {background: " + positiveColor +
        "\n;}.legend .cf_neutral:before,.reportal-table>tbody>tr>td.cf_neutral:after {background: " + neutralColor +
        "\n;}.legend .cf_negative:before,.reportal-table>tbody>tr>td.cf_negative:after {background: " + negativeColor +
        "\n;}.yui3-menu-horizontal ul > li > *:nth-last-child(2):after {border-left: 1px solid " + secondaryTextColor +
        "\n;}[type=radio]:checked:focus + label:before,[type=radio]:not(:checked):focus + label:before,[type=checkbox]:checked:focus + label:before,[type=checkbox]:not(:checked):focus + label:before {border: 1px solid " + secondaryTextColor +
        "\n;}.yui3-menu-horizontal ul > li > *:nth-last-child(2):before,.reportal-select.reportal-dropdown>span:after,.reportal-collapsed-row .reportal-collapse-button:before,.reportal-uncollapsed-row .reportal-collapse-button:before,.hitlist-dropdown-button:after,.dd-target-button.dd-button-selected .dd-target-button-arrow {border-color: " + secondaryTextColor +
        "\n transparent transparent;}.yui3-menu-horizontal ul > li > a,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-cancel {color: " + primaryTextColor +
        "\n !important;}.yui3-menu-horizontal ul ul > li > *:nth-last-child(2):before {border-color: transparent transparent transparent " + defaultPrimaryColor +
        "\n;}.reportal-select select,.hitlist-dropdown-panel .hitlist-filter-item>input.hitlist-opentext-field,    .hitlist-dropdown-panel .hitlist-filter-item>input.ac,    .hitlist-dropdown-panel .hitlist-filter-item>.hitlist-toggle-field>input.hitlist-filter-text-field,    .hitlist-dropdown-panel .hitlist-filter-item>select,.reportal-datepicker>span>span> input,.yui-calcontainer select.yui-cal-nav-mc,  .yui-calcontainer input.yui-cal-nav-yc {border: 1px solid " + dividerColor +
        "\n;}.reportal-table .btn.hierarchy-search.visible {border-bottom: 1px solid " + dividerColor +
        "\n;}[type=radio]:disabled:not(:checked) + label:before,[type=radio]:disabled:checked + label:before,[type=checkbox]:disabled:not(:checked) + label:before,[type=checkbox]:disabled:checked + label:before {border-color: " + dividerColor +
        "\n;}[type=radio]:disabled:not(:checked) + label:before,[type=radio]:disabled:checked + label:before,[type=checkbox]:disabled:not(:checked) + label:before,[type=checkbox]:disabled:checked + label:before {background-color: " + lightDividerColor +
        "\n;}[type=radio]:disabled + label, [type=checkbox]:disabled + label {color: " + disabledTextColor +
        "\n;}[type=\"checkbox\"] + label:before,[type=radio] + label:before,.reportal-no-children .reportal-collapse-button:before {border: 1px solid " + disabledTextColor +
        "\n;}.toggle label,.reportal-hitlist-container .hitlist-tags-container .hitlist-tag {border: solid 1px " + dividerColor +
        "\n;}table>thead td.sortable:not(.hierarchy-search-visible):after {color: " + primaryTextColor +
        "\n;}.reportal-table>tbody>tr>td {border-bottom: 1px solid " + lightDividerColor +
        "\n;}.reportal-hierarchy-table>tbody>tr>td[class*=_dc]:nth-last-child(even) {background: " + primaryBackgroundColor +
        "\n;}.reportal-hitlist-container .hitlist-tags-container .hitlist-tag {background-color: " + primaryBackgroundColor +
        "\n;}.reportal-hierarchy-table tr.firstInBlock:not(:first-child)>td {border-top: 3px " + dividerColor +
        "\n double !important;}.hitlist-dropdown-button,.yui-calcontainer>table .calnav,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn {background: " + lightPrimaryColor +
        "\n !important;}.hitlist-dropdown-button:after {border-color: " + darkPrimaryColor +
        "\n transparent transparent;}.hitlist-dropdown-button:hover,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-cancel:hover,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn:hover {background: " + defaultPrimaryColor +
        "\n !important;}.yui-ac-bd>ul>li.yui-ac-highlight,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-filter-apply,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear:hover,.hitlist-nav-button,.hitlist-nav-page,.yui-calcontainer>table td.calcell.selected>a,.yui-calcontainer>table .calnav:hover {color: " + textPrimaryColor +
        "\n !important;}.hitlist-filter,.yui-calcontainer>table td.calcell.today>a {background: " + lightAccentColor +
        "\n !important;}.hitlist-dropdown-panel,.yui-calcontainer .yui-cal-nav {border-color: " + dividerColor +
        "\n !important;}.hitlist-dropdown-panel {box-shadow: 0 2px 8px " + lightDividerColor +
        "\n !important;}.hitlist-dropdown-panel {background-color: " + primaryBackgroundColor +
        "\n !important;}.hitlist-dropdown-panel .hitlist-filter-item>label,.yui-calcontainer>table .calweekdaycell,.yui-calcontainer>table .calnav {color: " + secondaryTextColor +
        "\n !important;}.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear:hover {background: " + secondaryTextColor +
        "\n !important;}.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-filter-apply:hover,.hitlist-nav-button:hover, .hitlist-nav-page:hover,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn.yui-default:hover {background: " + darkAccentColor +
        "\n !important;}.reportal-hitlist-container .yui3-datatable-columns,.reportal-hitlist-container .yui3-datatable-header {border-top: 1px solid " + dividerColor +
        "\n !important;}.yui-calcontainer {border: 1px solid " + dividerColor +
        "\n !important;}.reportal-hitlist-container .hitlist-date-info {color: " + secondaryTextColor +
        "\n;}.reportal-hitlist-container .hitlist-nav-prev.disabled,.reportal-hitlist-container .hitlist-nav-next.disabled {color: " + disabledTextColor +
        "\n !important;}.dd-target-button .dd-target-button-arrow {border-color: transparent transparent transparent " + secondaryTextColor +
        "\n;}.dd-wrapper,.dd-wrapper .dd-header,.dd-wrapper .dd-header .dd-search-input,.dd-wrapper .dd-header .dd-items a,.dd-wrapper .dd-button-menu {border-color: " + lightDividerColor +
        "\n !important;}.dd-wrapper .dd-header {background-color: " + lightDividerColor +
        "\n !important;}.yui-calcontainer>table .calnavleft:before, .yui-calcontainer>table .calnavright:before {border: 1px solid " + defaultAccentColor +
        "\n;}.yui-calcontainer>table td.calcell.calcellhover>a {background: " + darkPrimaryColor +
        "\n !important;}table>thead td.sortable:not(.hierarchy-search-visible):after {color: " + primaryTextColor +
        "\n;}";

    str += "</style>";

    context.component.Output.Append(str);

}


}