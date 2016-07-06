# TextAnalyticsTemplate_CodeLibrary

public class Config {
  static var DS_Main = "ds0";
  static var CustomerLogo = null;
  static var CustomDateFormat = 'dd-MMM-yyyy';
  static var DateVariableId = 'interview_start';
  static var VariablesToPutAtEndOfList = [];
  static var Colors = {
    DefaultColor : "#ffff00",
    NegNeuPosPalette: {
      Negative: "#fd9900",
      Neutral: "#cdd1d9",
      Positive: "#7cc700"
    }
                      };

  static var TAQuestions=[

        // ***** Change these variables to include the correct information

        //Question 1
    	{
          	TADatasourceId: "ds0",  // the Reportal Data Source ID of the dataset
          	DatabaseSchemaId: 4909, //Schema containig TA model
            DatabaseTableName: "Retail 785", //Table containing TA model
            TAQuestionId: "why785", //unique id for question+model
            TAQuestionName: "why", // the question ID of the Text Analytics verbatim quesiton
            TAModelNo : "785",	// the Genius Model ID
            RelationshipColumnName: "parent",
          	TACategoryListParameter: "pCategoryList",
          	TADetailedChartShowParameter: "pDetailedChartShow",
          	TADetailedChartTypeParameter: "pDetailedChartType",
          	TAHitlistFields: ["respid","interview_start","verbatim","overallsentiment","categories"]
        },

    //Question2
        {
          	TADatasourceId: "ds0",  // the Reportal Data Source ID of the dataset
          	DatabaseSchemaId: 4909, //Schema containig TA model
            DatabaseTableName: "Retail 785", //Table containing TA model
            TAQuestionId: "wcomment2785", //unique id for question+model
            TAQuestionName: "whcomment2", // the question ID of the Text Analytics verbatim quesiton
            TAModelNo : "785",	// the Genius Model ID
            RelationshipColumnName: "parent",
          	TACategoryListParameter: "pCategoryList",
          	TADetailedChartShowParameter: "pDetailedChartShow",
          	TADetailedChartTypeParameter: "pDetailedChartType",
          	TAHitlistFields: ["respid","interview_start","verbatim","overallsentiment","categories"]
        }




    ];
}