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
        context.component.TargetPage = "filters";
        context.component.Label = new Label(context.report.CurrentLanguage,Translations.dictionary(context.report.CurrentLanguage)["filter page button"]);
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

        summarySegments.push(("<div style=\"padding: 8px;\">"+curDictionary['Selected question']+" = "+(!selectedFolder ? '' : Config.GetTALibrary().GetFolderById(selectedFolder).GetName()) + "</div>"));

        var category = !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage') &&
            TAParameterValues.getCategoryParameterValue(context, curDictionary, "TA_TOP_CATEGORIES_SINGLE");
        category = category && category.replace(/<span.*>: /, '');
        category = category && category.replace(/<\/span>/, '');

        if(category && category != curDictionary['-select-']) {
            summarySegments.push(("<div><span>"+curDictionary['Category']+" = " + category + "</span>" +
                CreateFilterBarDeleteButton("TA_TOP_CATEGORIES_SINGLE") +
                "</div>"));
        }

        var subCategory = !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage') &&
            TAParameterValues.getCategoryParameterValue(context, curDictionary, "TA_SUB_CATEGORIES_SINGLE");
        subCategory = subCategory && subCategory.replace(/<span.*>: /, '');
        subCategory = subCategory && subCategory.replace(/<\/span>/, '');

        if(subCategory && subCategory != curDictionary['-select-']) {
            summarySegments.push(("<div><span>"+curDictionary['Sub category']+" = " + subCategory + "</span>" +
                CreateFilterBarDeleteButton("TA_SUB_CATEGORIES_SINGLE") +
                "</div>"));
        }

        var attribute = !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage') &&
            TAParameterValues.getCategoryParameterValue(context, curDictionary, "TA_ATTRIBUTES_SINGLE");
        attribute = attribute && attribute.replace(/<span.*>: /, '');
        attribute = attribute && attribute.replace(/<\/span>/, '');

        if(attribute && attribute != curDictionary['-select-']) {
            summarySegments.push(("<div><span>"+curDictionary['Attribute']+" = " + attribute + "</span>" +
                CreateFilterBarDeleteButton("TA_ATTRIBUTES_SINGLE") +
                "</div>"));
        }

        var sentiment = !context.state.Parameters.IsNull("TA_COMMENTS_SENTIMENT") &&
            !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage'
                || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'comments_alert') &&
            context.state.Parameters.GetString("TA_COMMENTS_SENTIMENT") !== 'emptyv' &&
            context.state.Parameters.GetString("TA_COMMENTS_SENTIMENT");

        if(sentiment){
            summarySegments.push(("<div><span>"+curDictionary['Sentiment']+" = " + (ParameterValueResponse)(context.state.Parameters['TA_COMMENTS_SENTIMENT']).DisplayValue + "</span>" +
                CreateFilterBarDeleteButton("TA_COMMENTS_SENTIMENT") +
                "</div>"));
        }

        var startDate = !context.state.Parameters.IsNull("TA_DATE_FROM") &&
            !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage') &&
            context.state.Parameters.GetDate("TA_DATE_FROM").ToShortDateString();

        if(startDate){
            summarySegments.push(("<div><span>"+curDictionary['Start date']+" = " + startDate + "</span>" +
                CreateFilterBarDeleteButton("TA_DATE_FROM") +
                "</div>"));
        }

        var endDate = !context.state.Parameters.IsNull("TA_DATE_TO") &&
            !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage') &&
            context.state.Parameters.GetDate("TA_DATE_TO").ToShortDateString();

        if(endDate){
            summarySegments.push(("<div><span>"+curDictionary['End date']+" = " + endDate + "</span>" +
                CreateFilterBarDeleteButton("TA_DATE_TO") +
                "</div>"));
        }

        var commentsOnlyParameter = !context.state.Parameters.IsNull("pCommentsOnly") &&
            context.state.Parameters.GetString("pCommentsOnly") !== 'emptyv' &&
            context.state.Parameters.GetString("pCommentsOnly");

        if(commentsOnlyParameter){
            summarySegments.push(("<div><span>"+ "With comments only = " + commentsOnlyParameter + "</span>" +
                "</div>"));
        }

        var cj_parameter = !context.state.Parameters.IsNull("TA_CJ_CARDS") &&
            !(context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'customer_journey'
                || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage') &&
            context.state.Parameters.GetString("TA_CJ_CARDS") !== 'emptyv' &&
            context.state.Parameters.GetString("TA_CJ_CARDS");

        if(cj_parameter){
            var indexOfAsterisk = cj_parameter.indexOf('*');
            summarySegments.push(("<div><span>" + (
                    indexOfAsterisk >= 0 ?
                        (cj_parameter.substr(0, indexOfAsterisk) + ' = ' +   (ParameterValueResponse)(context.state.Parameters['TA_CJ_CARDS']).DisplayValue) :
                        (cj_parameter + ' is answered')
                ) + "</span>" + CreateFilterBarDeleteButton("TA_CJ_CARDS") +
                "</div>"));
        }

        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var filterQuestions = folder.GetFilterQuestions();

        for (var i = 0; i < filterQuestions.length; i++){
            var codes = filterComponents.GetFilterInformation({
                context: context,
                filterNumber: i
            });

            if(codes && codes.values.length > 0){
                summarySegments.push(("<div><span>" + codes.questionTitle + " = " + codes.texts.join(" | ") + "</span>" +
                    CreateFilterBarDeleteButton("FILTER" + (i + 1)) +
                    "</div>"));
            }
        }

        filterSummary = summarySegments.join("<span>AND</span>");

        context.component.Output.Append(filterSummary);
    }

    static private function CreateFilterBarDeleteButton(filterId) {
        return "<span class=\"comd-button___studio comd-button--icon___studio filter-bar__delete-btn\" data-filter-id='" + filterId + "'" +
            "onclick='javascript:document.querySelector(\"#filter-clear-input input\").value = this.getAttribute(\"data-filter-id\"); document.querySelector(\"#filter-clear-btn input\").click()'>" +
            "<svg class=\"comd-icon___studio comd-icon-close___studio comd-icon--size-12px___studio\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-labelledby=\"filterHeaderClearIcon\" fill=\"#FFFFFF\">" +
            "Clear filter icon<polygon points=\"24 2.42 21.58 0 12 9.58 2.42 0 0 2.42 9.58 12 0 21.58 2.42 24 12 14.42 21.58 24 24 21.58 14.42 12 24 2.42\"></polygon>" +
            "</svg>" +
            "</span>";
    }


    /**
     * @memberof TAPageMaster
     * @function btnSaveClearedFilter_Render
     * @param {Object} context - {component: button, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function btnSaveClearedFilter_Render(context){
        TAFilterPanel.btnSave_Render(context);
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
        hideButton = !filterComponents.GetAllAnsweredFilterCodes(context).length > 0
            && context.state.Parameters.IsNull("TA_DATE_FROM")
            && context.state.Parameters.IsNull("TA_DATE_TO")
            && context.state.Parameters.IsNull("TA_CJ_CARDS")
            && context.state.Parameters.IsNull("TA_TOP_CATEGORIES_SINGLE")
            && context.state.Parameters.IsNull("TA_SUB_CATEGORIES_SINGLE")
            && context.state.Parameters.IsNull("TA_ATTRIBUTES_SINGLE")
            && context.state.Parameters.IsNull("TA_COMMENTS_SENTIMENT");

        return hideButton;
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
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
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
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
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
     * @function cldDateFrom_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function cldDateFrom_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function cldDateTo_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function cldDateTo_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
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
        var pageId = context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') ? '' : context.state.Parameters.GetString('TA_LAST_VISITED_PAGE');
        var label = '';
        switch(pageId) {
            case 'customer_journey':
                label = Translations.dictionary(context.report.CurrentLanguage)['customer_journey page title'];
                break;

            case 'correlation':
                var cj_parameter = !context.state.Parameters.IsNull("TA_CJ_CARDS") &&
                    context.state.Parameters.GetString("TA_CJ_CARDS") !== 'emptyv' &&
                    context.state.Parameters.GetString("TA_CJ_CARDS");

                if(cj_parameter){
                    label = (ParameterValueResponse)(context.state.Parameters['TA_CJ_CARDS']).DisplayValue + ": " + Translations.dictionary(context.report.CurrentLanguage)['correlation page title'];
                }
                break;

            case 'dashboard':
                var timePeriod = context.state.Parameters.GetString("TA_PERIOD") == 'm' ? 'Months' :  (ParameterValueResponse)(context.state.Parameters["TA_PERIOD"]).DisplayValue;
                label = Translations.dictionary(context.report.CurrentLanguage)['dashboard page title'];
                break;

            case 'detailed_analysis':
                label = Translations.dictionary(context.report.CurrentLanguage)['detailed_analysis page title'];
                break;

            case 'comments':
                label = Translations.dictionary(context.report.CurrentLanguage)['comments page title'];
                break;
        }

        context.component.Output.Append(label ? '<div class="r2i-row r2i-row--max-width">' +
            '<div class="r2-title-widget">' +
            '<div class="r2-title-view">' +
            '<div class="r2-title-view__name">' +
            label +
            '</div></div></div></div>' : '');
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
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'customer_journey'
            || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
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
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'customer_journey'
            || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function txtSentiment_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSentiment_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'comments_alert'
            || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function lstSentiment_Hide
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstSentiment_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'comments_alert'
            || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function txtCategory_Hide
     * @description function to hide the Category selector label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtCategory_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function txtSubCategory_Hide
     * @description function to hide the the sub category list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtSubCategory_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
            || context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function txtAttribute_Hide
     * @description function to hide the the attributes list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function txtAttribute_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
            || context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function lstCategory_Hide
     * @description function to hide the Category selector label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstCategory_Hide(context){
        return context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function lstSubCategory_Hide
     * @description function to hide the the sub category list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstSubCategory_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_TOP_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
            || context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function lstAttribute_Hide
     * @description function to hide the the attributes list label
     * @param {Object} context - {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     * @returns {Boolean}
     */
    static function lstAttribute_Hide(context){
        var selectedFolder = TALibrary.GetTAFoldersParameterValue(context);
        var folder = Config.GetTALibrary().GetFolderById(selectedFolder);
        var parameterValue = context.state.Parameters.GetString("TA_SUB_CATEGORIES_SINGLE");
        return ((! parameterValue) || parameterValue === "emptyv" || folder.GetHierarchy().GetObjectById(parameterValue).subcells.length === 0)
            || context.state.Parameters.IsNull('TA_LAST_VISITED_PAGE') || context.state.Parameters.GetString('TA_LAST_VISITED_PAGE') == 'frontpage';
    }

    /**
     * @memberof TAPageMaster
     * @function txtParametersExplanation_Render
     * @description function to render explanation of Filter Panel auto applying parameters
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtParametersExplanation_Render(context){
        var currentLanguage = context.report.CurrentLanguage;
        var currentDictionary = Translations.dictionary(currentLanguage);

        var text = currentDictionary["Filter Panel auto applying parameters explanation"];
        context.component.Output.Append(text);
    }

    /**
     * @memberof TAPageMaster
     * @function txtClearButton_Render
     * @param {Object} context - {component: text, pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
     */
    static function txtClearButton_Render(context){
        context.component.Output.Append("<button type='button' title='Clear filters'  onclick='javascript:document.querySelector(\".filters-clear-button input\").click()' class='btn btn-primary'>"+
            "Clear Filters"+
            "</button>");
    }
}