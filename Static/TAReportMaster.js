/**
 * @class TAReportMaster
 * @classdesc Static class for Report Master components
 */
class TAReportMaster {
    /**
     * @memberof TAReportMaster
     * @function CustomerLogo_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function CustomerLogo_Hide(context) {
        return false;
    }

    /**
     * @memberof TAReportMaster
     * @function CustomerLogo_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function CustomerLogo_Render(context) {
        if(Config.CustomerLogo !== null) {
            context.component.Output.Append('<img class="customer-logo" src="' + Config.CustomerLogo + '" height="60px" >');
        }
    }

    /**
     * @memberof TAReportMaster
     * @function txtRewriteStyles_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtRewriteStyles_Render(context){
        if(Config.Design) {
            var backgroundColor = Config.Design.backgroundColor;
            var headerBackgroundColor = Config.Design.headerBackgroundColor;
            var widgetBackgroundColor = Config.Design.widgetBackgroundColor;
            var headerTextColor = Config.Design.headerTextColor;
            var lightPrimaryColor = Config.Design.lightPrimaryColor;
            var lightPrimaryHoverColor = Config.Design.lightPrimaryHoverColor;
            var buttonTextColor = Config.Design.buttonTextColor;
            var buttonHoverColor = Config.Design.buttonHoverColor;
            var buttonMainColor = Config.Design.buttonMainColor;
            var tableColumnColor = Config.Design.tableColumnColor;
            var primaryTextColor = Config.Design.primaryTextColor;
            var secondaryTextColor = Config.Design.secondaryTextColor;
            var disabledTextColor = Config.Design.disabledTextColor;
            var dividerColor = Config.Design.dividerColor;
            var lightDividerColor = Config.Design.lightDividerColor;
            var increasing = Config.Design.increasing;
            var decreasing = Config.Design.decreasing;
            var positiveColor = Config.Design.positiveColor;
            var neutralColor = Config.Design.neutralColor;
            var negativeColor = Config.Design.negativeColor;
            var issues = Config.Design.areasPalette["Priority Issues"];
            var strength = Config.Design.areasPalette["Strength"];
            var monitor = Config.Design.areasPalette["Monitor and Improve"];
            var maintain = Config.Design.areasPalette["Maintain"];

            var str = "<style>";

            str += ".co-st-r-widget-kpi .target__text,.co-st-r-widget-kpi .gap-to-target__number, .co-st-r-widget-kpi .gap-to-target__text,.r2i-widget .small__text .r2i-inline-block,.r2i-widget .small__text .r2i-inline-block div,.r2i-widget .small__text .r2i-inline-block table,.r2i-widget .small__text .r2i-inline-block table tbody,.r2i-widget .small__text .r2i-inline-block table tbody tr,.r2i-widget .small__text .r2i-inline-block table tbody tr td,.r2i-widget .small__text {fill: " + secondaryTextColor +
                "\n;}.co-st-r-widget-kpi .sec-metric__text,.reportal-checkbox > label, .reportal-radio > label, .reportal-select > label, .reportal-input > label, .reportal-datepicker > label, .reportal-hierarchy > label,[type=radio] + label, [type=checkbox] + label,[type=radio]:disabled:checked + label:after, [type=checkbox]:disabled:checked + label:after,[type=\"checkbox\"] + label:after,.dd-target-button .dd-target-button-arrow, .dd-target-button .dd-target-button-text,.no-data-label {color: " + secondaryTextColor +
                "\n;}.filter-bar div,.toggle input:checked + label {background: " + secondaryTextColor +
                "\n;}[type=radio] + label:after {background-color: " + secondaryTextColor +
                "\n;}.toggle input:checked + label,.toggle input:not(checked) + label {border-color: " + secondaryTextColor +
                "\n;}.co-st-r-widget-kpi .target__number,.co-st-r-widget-kpi .target__marker,[class^=icon-],.filter-bar .filter-button,.yui3-menu-horizontal ul > li > a {fill: " + primaryTextColor +
                "\n;}.co-st-r-widget-kpi .sec-metric__number,.dashboard__sidebar,.reportal-horizontal-menu > .yui3-menu .css-menu-toplabel,.r2-title-view__name,body, body.reportal-viewmode,.reportal-select select,.reportal-table .cf_positive,  .reportal-table .cf_neutral,  .reportal-table .cf_negative,.hitlist-dropdown-panel .hitlist-filter-item>input.hitlist-opentext-field,    .hitlist-dropdown-panel .hitlist-filter-item>input.ac,    .hitlist-dropdown-panel .hitlist-filter-item>.hitlist-toggle-field>input.hitlist-filter-text-field,    .hitlist-dropdown-panel .hitlist-filter-item>select,.reportal-datepicker>span>span> input,.yui-calcontainer select.yui-cal-nav-mc,  .yui-calcontainer input.yui-cal-nav-yc {color: " + primaryTextColor +
                "\n;}.filter-bar .filter-button:hover,    .filter-bar .filter-button:active,    .filter-bar .filter-button:focus {background-color: " + primaryTextColor +
                "\n;}.co-st-r-widget-kpi .arc__basis,.icon-face-neutral,.cf_neutral {fill: " + neutralColor +
                "\n;}.cf_neutral,.ta-osat-widget__neutral {color: " + neutralColor +
                "\n;}.co-st-r-widget-kpi .sec-metric--first {border-right: 1px solid " + dividerColor +
                "\n;}.reportal-select select,[type=\"checkbox\"] + label:before,[type=radio] + label:before,.hitlist-dropdown-panel .hitlist-filter-item>input.hitlist-opentext-field,    .hitlist-dropdown-panel .hitlist-filter-item>input.ac,    .hitlist-dropdown-panel .hitlist-filter-item>.hitlist-toggle-field>input.hitlist-filter-text-field,    .hitlist-dropdown-panel .hitlist-filter-item>select,.reportal-datepicker>span>span> input,.yui-calcontainer select.yui-cal-nav-mc,  .yui-calcontainer input.yui-cal-nav-yc {border: 1px solid " + dividerColor +
                "\n;}@media print {.dashboard__main-wrapper.view-mode .dashboard__widget {border: 1px solid " + dividerColor +
                "\n;}}.vp-item-rename .vp-input > .vp-input-text, .vp-add-item .vp-input > .vp-input-text,.reportal-table .btn.hierarchy-search.visible {border-bottom: 1px solid " + dividerColor +
                "\n;}.co-st-r-widget-kpi .sec-metric-bar,.dashboard,.r2i-scroll::-webkit-scrollbar-thumb,body, body.reportal-viewmode,.yui3-menu-horizontal ul > li > a {background-color: " + backgroundColor +
                "\n;}.co-st-r-widget-kpi .sec-metric-bar__indicator {background-color: " + dividerColor +
                "\n;}.r2i-scroll::-webkit-scrollbar-track {background: " + dividerColor +
                "\n;}[type=radio]:disabled:not(:checked) + label:before,[type=radio]:disabled:checked + label:before,[type=checkbox]:disabled:not(:checked) + label:before,[type=checkbox]:disabled:checked + label:before {border-color: " + dividerColor +
                "\n;}.dashboard__widget {background-color: " + widgetBackgroundColor +
                "\n;}.dashboard__widget {-webkit-box-shadow: 0 0 6px 0 " + dividerColor +
                "\n;}.dashboard__widget {box-shadow: 0 0 6px 0 " + dividerColor +
                "\n;}.widget__header--shadow {-webkit-box-shadow: 0 .286rem .571rem 0 " + lightPrimaryHoverColor +
                "\n;}.widget__header--shadow {box-shadow: 0 .286rem .571rem 0 " + lightPrimaryHoverColor +
                "\n;}.comd-button___studio:disabled,[type=radio]:disabled + label, [type=checkbox]:disabled + label,.toggle input:not(checked) + label {color: " + disabledTextColor +
                "\n;}.dashboard__sidebar,.filter__header,.filter-options-panel {background-color: " + headerBackgroundColor +
                "\n;} {border-right: .071rem solid " + dividerColor +
                "\n;}@media screen and (min-width: 600px) {.dashboard__sidebar {border-right: .071rem solid " + dividerColor +
                "\n;}}.filter__header,.filter-options-panel__item--hierarchy,.filter-search-navigation__wrapper {border-bottom: .071rem solid " + dividerColor +
                "\n;}.toolbar__icon,.vp-item-menu li > a:hover,.report-filters-horizontal,.filter-bar .filter-button,.yui3-menu-horizontal ul > li.css-menu-selected > a,      .yui3-menu-horizontal ul > li.css-menu-child-selected > a,      .yui3-menu-horizontal ul > li.css-menu-topitem > a:hover,      .yui3-menu-horizontal ul > li > a.yui3-menu-label-menuvisible:not(.css-menu-sublabel),.yui3-menu-horizontal ul ul > li.yui3-menuitem-active > a,        .yui3-menu-horizontal ul ul > li > a.yui3-menu-label-active,        .yui3-menu-horizontal ul ul > li > a.yui3-menu-label-menuvisible,.reportal-table>thead>tr>td,  .reportal-table>thead>tr>th,.reportal-table.reportal-barchart>thead>tr,.reportal-table .btn.hierarchy-search.visible {background-color: " + lightPrimaryColor +
                "\n;}.filter-bar .filter-button:hover,    .filter-bar .filter-button:active,    .filter-bar .filter-button:focus {fill: " + lightPrimaryColor +
                "\n;}.kpi-tile,.reportal-hierarchy-table tr.firstInBlock>td:first-child {background: " + lightPrimaryColor +
                "\n;}.toolbar__icon:hover {background-color: " + lightPrimaryHoverColor +
                "\n;}.dd-button-select,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-filter-apply,.hitlist-nav-button,.hitlist-nav-page,.yui-calcontainer>table td.calcell.today>a,.yui-calcontainer>table td.calcell.selected>a,.yui-calcontainer>table .calnav:hover,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn.yui-default {background: " + buttonMainColor +
                "\n !important;}.vp-item-rename .vp-input .vp-input-save, .vp-add-item .vp-input .vp-input-save,.yui-ac-bd>ul>li.yui-ac-highlight {background-color: " + buttonMainColor +
                "\n !important;}a, .link {color: " + buttonMainColor +
                "\n !important;}.hitlist-filter {border-color: " + buttonMainColor +
                "\n !important;}.dd-wrapper .dd-header .dd-search-input:focus,.dd-wrapper .dd-header .dd-item-text:focus {outline-color: " + buttonMainColor +
                "\n !important;}.dd-button-select,.yui-ac-bd>ul>li.yui-ac-highlight,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-filter-apply,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear:hover,.hitlist-nav-button,.hitlist-nav-page,.yui-calcontainer>table td.calcell.selected>a,.yui-calcontainer>table .calnav:hover {color: " + buttonTextColor +
                "\n !important;}.dd-button-select:active,.dd-button-select:hover,.vp-item-rename .vp-input .vp-input-save:hover, .vp-item-rename .vp-input .vp-input-save:active, .vp-item-rename .vp-input .vp-input-save:focus, .vp-add-item .vp-input .vp-input-save:hover, .vp-add-item .vp-input .vp-input-save:active, .vp-add-item .vp-input .vp-input-save:focus,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-filter-apply:hover,.hitlist-nav-button:hover, .hitlist-nav-page:hover,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn.yui-default:hover {background: " + buttonHoverColor +
                "\n !important;}a.dd-cancel,.yui3-menu-horizontal ul > li > a,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-cancel,.reportal-hitlist-container .yui3-datatable-cell,.reportal-hitlist-container .yui3-datatable-cell:hover,.reportal-hitlist-container .hitlist-tags-container .hitlist-tag {color: " + primaryTextColor +
                "\n !important;}.yui-calcontainer>table td.calcell.calcellhover>a {background: " + primaryTextColor +
                "\n !important;}.dd-selected a .dd-item-text,.btn.btn-primary, button.btn-primary,.dd-wrapper .dd-button-menu button {background-color: " + buttonMainColor +
                "\n;}.comd-button___studio, .comd-button__content___studio,a:active,  a:visited,  .link:active,  .link:visited,.r2i-light-blue-color {color: " + buttonMainColor +
                "\n;}.dd-wrapper .dd-button-menu button:focus {outline-color: " + buttonMainColor +
                "\n;}.reportal-horizontal-menu > .yui3-menu .css-menu-topitem:hover,.reportal-horizontal-menu > .yui3-menu .css-menu-topitem.css-menu-selected,.vp-inner-item:hover, .vp-item-rename,.yui-calcontainer>table .calnav,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn {background: " + lightPrimaryColor +
                "\n !important;}.vp-container,.vp-item-menu {background: " + headerBackgroundColor +
                "\n !important;}.vp-item-rename .vp-input .vp-input-cancel, .vp-add-item .vp-input .vp-input-cancel,.hitlist-dropdown-panel .hitlist-filter-item>label,.yui-calcontainer>table .calweekdaycell,.yui-calcontainer>table .calnav {color: " + secondaryTextColor +
                "\n !important;}.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear:hover {background: " + secondaryTextColor +
                "\n !important;}.vp-item-rename .vp-input .vp-input-cancel:hover, .vp-item-rename .vp-input .vp-input-cancel:active, .vp-item-rename .vp-input .vp-input-cancel:focus, .vp-add-item .vp-input .vp-input-cancel:hover, .vp-add-item .vp-input .vp-input-cancel:active, .vp-add-item .vp-input .vp-input-cancel:focus {background: " + lightPrimaryColor +
                "\n;}.comd-button___studio:hover,.comd-button___studio:hover .comd-button__content___studio,.comd-button___studio:active,.comd-button___studio:active .comd-button__content___studio,a:hover, .link:hover,.r2i-blue-color {color: " + buttonHoverColor +
                "\n;}* {outline-color: " + buttonHoverColor +
                "\n;}.btn.btn-primary:hover,      .btn.btn-primary:active,      .btn.btn-primary:focus,      button.btn-primary:hover,      button.btn-primary:active,      button.btn-primary:focus,.dd-wrapper .dd-button-menu button:hover {background-color: " + buttonHoverColor +
                "\n;}.btn.btn-primary, button.btn-primary,.btn.btn-primary:hover,      .btn.btn-primary:active,      .btn.btn-primary:focus,      button.btn-primary:hover,      button.btn-primary:active,      button.btn-primary:focus,.filter-bar div,.toggle input:checked + label {color: " + buttonTextColor +
                "\n;}.toggle input:not(checked) + label {background: " + buttonTextColor +
                "\n;}.icon-face-positive,.cf_positive {fill: " + positiveColor +
                "\n;}.cf_positive,.ta-osat-widget__positive {color: " + positiveColor +
                "\n;}.icon-face-negative,.cf_negative {fill: " + negativeColor +
                "\n;}.cf_negative,.ta-osat-widget__negative {color: " + negativeColor +
                "\n;}.legend .increasing,.reportal-table>tbody>tr>td.increasing {background: " + increasing +
                "\n;}.legend .decreasing,.reportal-table>tbody>tr>td.decreasing {background: " + decreasing +
                "\n;}.legend .cf_positive:before,.reportal-table>tbody>tr>td.cf_positive:after {background: " + positiveColor +
                "\n;}.legend .cf_neutral:before,.reportal-table>tbody>tr>td.cf_neutral:after {background: " + neutralColor +
                "\n;}.legend .cf_negative:before,.reportal-table>tbody>tr>td.cf_negative:after {background: " + negativeColor +
                "\n;}.reportal-branding-panel,.reportal-branding-panel .page-title {background: " + headerBackgroundColor +
                "\n;}.reportal-branding-panel .page-title {color: " + headerTextColor +
                "\n;}.vp-collapsible .vp-header:hover {background: " + lightPrimaryHoverColor +
                "\n !important;}.yui3-menu-horizontal {background-color: " + headerBackgroundColor +
                "\n;}.yui3-menu-horizontal ul > li > *:nth-last-child(2):after {border-left: 1px solid " + secondaryTextColor +
                "\n;}[type=radio]:checked:focus + label:before,[type=radio]:not(:checked):focus + label:before,[type=checkbox]:checked:focus + label:before,[type=checkbox]:not(:checked):focus + label:before,.alert-card:hover {border: 1px solid " + secondaryTextColor +
                "\n;}.yui3-menu-horizontal ul > li > *:nth-last-child(2):before,.reportal-select.reportal-dropdown>span:after,.hitlist-dropdown-button:after {border-color: " + primaryTextColor +
                "\n transparent transparent;}.yui3-menu-horizontal ul ul > li > *:nth-last-child(2):before {border-color: transparent transparent transparent " + backgroundColor +
                "\n;}[type=radio]:disabled:not(:checked) + label:before,[type=radio]:disabled:checked + label:before,[type=checkbox]:disabled:not(:checked) + label:before,[type=checkbox]:disabled:checked + label:before {background-color: " + lightDividerColor +
                "\n;}.toggle label,.reportal-hitlist-container .hitlist-tags-container .hitlist-tag {border: solid 1px " + dividerColor +
                "\n;}table>thead td.sortable:not(.hierarchy-search-visible):after {color: " + primaryTextColor +
                "\n;}.reportal-table>tbody>tr>td,.cj-card__card-row:not(:last-child),.alert-card__title {border-bottom: 1px solid " + lightDividerColor +
                "\n;}.alert-card {border: 1px solid " + lightDividerColor +
                "\n;}.striped-columns>tbody>tr>td[class*=_dc]:nth-last-child(even) {background: " + tableColumnColor +
                "\n;}.reportal-hitlist-container .hitlist-tags-container .hitlist-tag {background-color: " + tableColumnColor +
                "\n;}.reportal-hierarchy-table tr.firstInBlock:not(:first-child)>td {border-top: 3px " + dividerColor +
                "\n double !important;}.reportal-collapsed-row .reportal-collapse-button:before,.reportal-uncollapsed-row .reportal-collapse-button:before,.hitlist-dropdown-button:after,.dd-target-button.dd-button-selected .dd-target-button-arrow {border-color: " + secondaryTextColor +
                "\n transparent transparent;}.reportal-no-children .reportal-collapse-button:before {border: 1px solid " + disabledTextColor +
                "\n;}.hitlist-dropdown-button,.hitlist-export-button.hitlist-btn,.hitlist-filter,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-clear,.hitlist-dropdown-panel .hitlist-dropdown-panel-buttons>.hitlist-dropdown-cancel:hover,.yui-calcontainer .yui-cal-nav-b>.yui-cal-nav-btn:hover {background: " + backgroundColor +
                "\n !important;}.hitlist-dropdown-button:hover,.hitlist-export-button.hitlist-btn:hover {background: " + dividerColor +
                "\n !important;}.hitlist-dropdown-panel,.yui-calcontainer .yui-cal-nav {border-color: " + dividerColor +
                "\n !important;}.hitlist-dropdown-panel {-webkit-box-shadow: 0 2px 8px " + lightDividerColor +
                "\n !important;}.hitlist-dropdown-panel {box-shadow: 0 2px 8px " + lightDividerColor +
                "\n !important;}.hitlist-dropdown-panel {background-color: " + tableColumnColor +
                "\n !important;}.reportal-hitlist-container .yui3-datatable-columns,.reportal-hitlist-container .yui3-datatable-header,.reportal-hitlist-container .yui3-datatable-cell {border-bottom: 1px solid " + lightDividerColor +
                "\n !important;}.reportal-hitlist-container .hitlist-date-info {color: " + secondaryTextColor +
                "\n;}.reportal-hitlist-container .hitlist-nav-prev.disabled,.reportal-hitlist-container .hitlist-nav-next.disabled {color: " + disabledTextColor +
                "\n !important;}.dd-target-button .dd-target-button-arrow {border-color: transparent transparent transparent " + secondaryTextColor +
                "\n;}.dd-wrapper,.dd-wrapper .dd-header,.dd-wrapper .dd-header .dd-search-input,.dd-wrapper .dd-header .dd-items a,.dd-wrapper .dd-button-menu {border-color: " + lightDividerColor +
                "\n !important;}.dd-wrapper .dd-header {background-color: " + lightDividerColor +
                "\n !important;}.yui-calcontainer,.select2-container--default .select2-selection--multiple,.select2-container--default .select2-selection--single {border: 1px solid " + dividerColor +
                "\n !important;}.yui-calcontainer>table .calnavleft:before, .yui-calcontainer>table .calnavright:before {border: 1px solid " + buttonMainColor +
                "\n;}.correlation-header--issues {background-color: " + issues +
                "\n;}.correlation-list--issues>tr>td:first-child {color: " + issues +
                "\n;}.correlation-header--strength {background-color: " + strength +
                "\n;}.correlation-list--strength>tr>td:first-child {color: " + strength +
                "\n;}.correlation-header--monitor {background-color: " + monitor +
                "\n;}.correlation-list--monitor>tr>td:first-child {color: " + monitor +
                "\n;}.correlation-header--maintain {background-color: " + maintain +
                "\n;}.correlation-list--maintain>tr>td:first-child {color: " + maintain +
                "\n;}#chart-tables-switcher svg {fill: " + primaryTextColor +
                "\n;}#chart-tables-switcher .selected svg,#correlation-help:hover>svg {fill: " + buttonMainColor +
                "\n;}#correlation-help-text {border: 1px solid " + dividerColor +
                "\n;}.alert-card__decreasing,.ta-sig-change-widget__decreasing,.ta-impact-analysis-widget__item--issues {color: " + issues +
                "\n;}.alert-card__increasing,.ta-sig-change-widget__increasing,.ta-impact-analysis-widget__item--strength {color: " + strength +
                "\n;}.reportal-filterpanel .reportal-select:nth-child(5) {border-top: 2px solid " + buttonMainColor +
                "\n;}";

            str += "</style>";

            context.component.Output.Append(str);
        }
    }
}