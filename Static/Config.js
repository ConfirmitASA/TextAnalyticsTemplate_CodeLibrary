/**
 * Config class that doesn't have a constructor.
 * @class Config
 * @classdesc Contains configuration for the report.
 *
 * @prop {Object[]} TAQuestions - array of Text Analytics configurations for each verbatim question
 * @prop {String} TAQuestions.TAFolderId - Name for TA set of variables shown in Question parameter
 * @prop {String} TAQuestions.DatasourceId - override DS_Main from config
 * @prop {Number} TAQuestions.DatabaseSchemaId - id of the schema containing Text Analytics model
 * @prop {String} TAQuestions.DatabaseTableName - name of the table containing Text Analytics model
 * @prop {String} TAQuestions.IdColumnName - name of the column containing category id. "id" by default
 * @prop {String} TAQuestions.TextColumnName - name of the column containing category name. "__l9" by default
 * @prop {String} TAQuestions.RelationshipColumnName - name of the column containing parent id for subcategories and attributes. "parent" by default
 * @prop {String} TAQuestions.TextSeparator - symbol which separate Parent and children names in the flat category name

 * @prop {String} TAQuestions.TAQuestionName - verbatim variable id
 * @prop {String}  TAQuestions.TAModelNo - model number used for Text Analytics
 * @prop {String} TAQuestions.TimeVariableId - date variable Id to use for trending tables and time variables. Overrides Config value
 * @prop {String[]} TAQuestions.VariablesToViewBy -variables to break the detailed analysis table by. If not "null" will override values from survey tags. If not "null" will override values from Config
 * @prop {String[]} TAQuestions.HitlistColumns - variables to add to the end of the hitlist. If not "null" will override values from survey tags. If not "null" will override values from Config
 * @prop {String} CustomerLogo - link to the logo
 *
 * @prop {String} CustomDateFormat - string that represents Date format which will be used in the report
 * @prop {String} TimeVariableId - date variable Id to use for trending tables and time variables. "interview_start" by default
 *
 * @prop {String[]} VariablesToViewBy -variables to break the detailed analysis table by. If not "null" will override values from survey tags
 * @prop {String[]} HitlistColumns - variables to add to the end of the hitlist. If not "null" will override values from survey tags
 * @prop {String[]} FiltersQuestion - variables for Filters page. If not "null" will override values from survey tags
 *
 * @prop {Object} Colors - color palettes using in the report
 * @prop {String} Colors.DefaultColor - color for header
 * @prop {Object} Colors.NegNeuPosPalette - palette for negative - neutral - positive breaking
 * @prop {String} Colors.NegNeuPosPalette.Negative - Negative color
 * @prop {String} Colors.NegNeuPosPalette.Neutral - Neutral color
 * @prop {String} Colors.NegNeuPosPalette.Positive - Positive color
 *
 * @prop {Object} SentimentRange - negative - neutral - positive breaking by sentiment
 * @prop {Number[]} SentimentRange.Positive - array of positive sentiment's values
 * @prop {Number[]} SentimentRange.Neutral - array of neutral sentiment's values
 * @prop {Number[]} SentimentRange.Negative - array of negative sentiment's values
 *

 *
 * @example
 *     static var DS_Main = "ds0";
 *     static var CustomerLogo = null;
 *     static var CustomDateFormat = 'dd-MMM-yyyy';
 *     static var TimeVariableId = 'interview_start';
 *     static var  VariablesToViewBy = ["type", "source"];
 *     static var  HitlistColumns = ["membership_level"];
 *     static var FiltersQuestions = null;
 *
 *     static var Colors = {
 *            DefaultColor: "#ffff00",
 *            NegNeuPosPalette: {
 *                Negative: "#fd9900",
 *                Neutral: "#cdd1d9",
 *                Positive: "#7cc700"
 *            }
 *        };
 *
 *     static var SentimentRange = {
 *            Positive: [8,9,10,11],
 *            Neutral: [5,6,7],
 *            Negative: [1,2,3,4]
 *        }
 *
 *     static var TAQuestions = [
 *     {
 *         DatasourceId: "ds0",
 *
 *         DatabaseSchemaId: 4909,
 *         DatabaseTableName: "Retail 785",
 *         RelationshipColumnName: "parent",
 *         TextSeparator: "|",
 *
 *         TAFolderId: "why785",
 *         TAQuestionName: "why",
 *         TAModelNo: "785",
 *
 *         TimeVariableId: 'interview_start'
 *     }
 *     ];
 */
public class Config {

    static var TAQuestions = [

        // ***** Change these variables to include the correct information about Text analytics questions

        //Question 1
        {
            DatasourceId: "ds0",

            DatabaseSchemaId: 4923, //Schema containig TA model
            DatabaseTableName: "Confirmit VoC 944", //Table containing TA model
            RelationshipColumnName: "parent",
            TextSeparator: "|",

            TAFolderId: "Q2", //unique id shown in parameters
            TAQuestionName: "Q2", // the question ID of the Text Analytics verbatim quesiton
            TAModelNo: "944",	// the Genius Model ID

            TimeVariableId: 'interview_start',
            CorrelationVariableId: 'Q1',
            VariablesToViewBy: ["ClientType"],
            FilterQuestions: ["status", "ClientType", "MailingCountry","Industry" ],
            HitlistColumns:  ["status", "ClientType", "MailingCountry","Industry" ]
        }
    ];

    static var CustomerLogo = "https://reportal.euro.confirmit.com/cf_clientutil/themes/flattheme/images/logo-gigantic.png"; // link to the company logo

    static var ShowOnlySelectedCategoryTagInHitlist = false; //set to false if you want to see all categories captured for comment in the hitlist everytime

    static var Design = null; //for default color scheme

    /* Use this variable to chage color scheme */

    /*static var Design = {
     positiveColor: "#7cc700", //positive color
     neutralColor: "#cdd1d9", //neutral color
     negativeColor: "#fd9900", //negatine color


     backgroundColor: "#e1e4e9", // Background, inactive navigation tabs
     headerBackgroundColor: "#000", //background for navigation panel, pagetitle and logo
     headerTextColor: "#fff", //text color for pagetitle
     lightPrimaryColor: "#f0f2f5", //active navigation tabs, tiles background, table headers background, filter-page button
     buttonTextColor: "#FFFFFF", //text color for buttons
     buttonHoverColor: "#0087c4", //color of hovered button
     buttonMainColor: "#30b8f1", //buttons and links color
     tableColumnColor: "#f6f6f6", // Color of even columns in the table, background for reportal filters and tabs in hitlist
     primaryTextColor: "#3F454C", //Text color
     secondaryTextColor: "#737B8E", //labels color
     dividerColor: "#ccc", //color for inputs borders
     lightDividerColor: "#e1e4e9", //separation line between table rows
     disabledTextColor: "#ccc", //disabled text color

     chartPalette: ["#fd9900", "#cdd1d9", "#7cc700"], //correlation chart points colors
     areasPalette: {                                 //colors for correlation chart areas
     "Priority Issues": "#ee627d",
     "Strength": "#7cc700",
     "Monitor and Improve": "#ffb944",
     "Maintain": "#82b8ec"
     }

     }   */



    /* Negative-neutral-positive breaking on 1-11 scale)*/
    static const SentimentRange = {
        Positive: [7,8,9,10,11],
        Neutral: [6],
        Negative: [1,2,3,4,5]
    }


    /* Please do not change anything below this point*/

    static var Colors = {
        NegNeuPosPalette: {
            Negative: Design ? Design.negativeColor : "#fd9900",
            Neutral: Design ? Design.neutralColor : "#cdd1d9",
            Positive: Design ? Design.positiveColor : "#7cc700"
        },

        ChartPalette: Design ? Design.chartPalette : ["rgba(244,67,54,0.5)",
            "#9C27B0",
            "#3F51B5",
            "#03A9F4",
            "#009688",
            "#8BC34A",
            "#FFEB3B",
            "#FF5722",
            "#9E9E9E",
            "#607D8B"],
        AreasPalette: Design ? Design.areasPalette : {
            "Priority Issues": "#ee627d",
            "Strength": "#7cc700",
            "Monitor and Improve": "#ffb944",
            "Maintain": "#82b8ec"
        }
    };


    private static var _TALibrary: TALibrary;
    private static var _haveTALibrary;

    static function SetTALibrary(globals){
        if(!_haveTALibrary){
            _TALibrary = new TALibrary(globals, Config);
            _haveTALibrary = true;
        }
    }

    static function GetTALibrary(){
        return _TALibrary;
    }

}