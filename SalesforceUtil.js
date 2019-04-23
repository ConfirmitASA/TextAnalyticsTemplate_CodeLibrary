class SalesforceUtil{
    static function GetCorrelationData(context, returnIds){
        var report = context.report;

        var sentValues = report.TableUtils.GetColumnValues('tblCorrelation', 1);
        var corrValues = report.TableUtils.GetColumnValues('tblCorrelation', 2);
        var labels = returnIds ? report.TableUtils.GetRowHeaderCategoryIds('tblCorrelation') : report.TableUtils.GetRowHeaderCategoryTitles('tblCorrelation');

        var improvementsArr = [];
        var strengthArr = [];

        if(corrValues.length > 0) {
            var overallSent = sentValues[0].Value;
            for (var i = 1; i < corrValues.length; i++) {
                var corrValue = corrValues[i].Value;
                var sentimentValue = sentValues[i].Value;
                var label : String = labels[i];
                if (corrValue > 0 && sentimentValue < overallSent) {
                    improvementsArr.push(label);
                }
                if (corrValue > 0 && sentimentValue > overallSent)
                    strengthArr.push(label);
            }
        }

        return {improvementsArr: improvementsArr, strengthArr: strengthArr};
    }

    static function GetOSATData(context){
        var report = context.report;

        var previousSentiment = report.TableUtils.GetCellValue('tblOverallSentimentChange', 1, 1).Value;
        var currentSentiment = report.TableUtils.GetCellValue('tblOverallSentimentChange', 1, 2).Value;

        return {previousSentiment: previousSentiment, currentSentiment: currentSentiment};
    }

    static function GetSignificantChangesData(context, returnIds){
        var report = context.report;

        var currentCountValues = report.TableUtils.GetColumnValues('tblSignificantChangeAlerts', 5);
        var previousCountValues = report.TableUtils.GetColumnValues('tblSignificantChangeAlerts', 1);
        var currentStDevValues = report.TableUtils.GetColumnValues('tblSignificantChangeAlerts', 8);
        var previousStDevValues = report.TableUtils.GetColumnValues('tblSignificantChangeAlerts', 4);
        var currentAvgValues = report.TableUtils.GetColumnValues('tblSignificantChangeAlerts', 6);
        var previousAvgValues = report.TableUtils.GetColumnValues('tblSignificantChangeAlerts', 2);
        var currentTotal = report.TableUtils.GetCellValue('tblSignificantChangeAlerts', 1, 5).Value;
        var previousTotal = report.TableUtils.GetCellValue('tblSignificantChangeAlerts', 1, 1).Value;
        var labels = returnIds ? report.TableUtils.GetRowHeaderCategoryIds('tblSignificantChangeAlerts') : report.TableUtils.GetRowHeaderCategoryTitles('tblSignificantChangeAlerts');

        var sentimentChangesNegArr = [];
        var sentimentChangesPosArr = [];
        var volumeChangesNegArr = [];
        var volumeChangesPosArr = [];

        for(var i = 0; i < currentCountValues.length; i++) {
            var label : String = labels[i];
            if (currentCountValues[i].Value >= 10 && previousCountValues[i].Value >=10)  {
                var result = (currentAvgValues[i].Value -  previousAvgValues[i].Value) /
                    Math.sqrt(
                        (1/previousCountValues[i].Value + 1/currentCountValues[i].Value) *
                        ((previousCountValues[i].Value - 1)*Math.pow(previousStDevValues[i].Value, 2) + (currentCountValues[i].Value - 1)*Math.pow(currentStDevValues[i].Value, 2)) /
                        (previousCountValues[i].Value + currentCountValues[i].Value - 2)
                    );
                if (result < -1.96)
                    sentimentChangesNegArr.push(label);
                else if (result > 1.96)
                    sentimentChangesPosArr.push(label);
            }

            if (currentCountValues[i].Value >= 5 && previousCountValues[i].Value >=5)  {
                result = (currentCountValues[i].Value / currentTotal  - previousCountValues[i].Value / previousTotal ) /
                    Math.sqrt(
                        ( previousCountValues[i].Value  + currentCountValues[i].Value )/( previousTotal + currentTotal )*
                        (1 - ( previousCountValues[i].Value + currentCountValues[i].Value )/(previousTotal + currentTotal ))*
                        (1/currentTotal + 1/previousTotal )
                    );

                if (result < -1.96)
                    volumeChangesNegArr.push(label);
                else if (result > 1.96)
                    volumeChangesPosArr.push(label);
            }
        }

        return {
            sentimentChangesNegArr: sentimentChangesNegArr,
            sentimentChangesPosArr: sentimentChangesPosArr,
            volumeChangesNegArr: volumeChangesNegArr,
            volumeChangesPosArr: volumeChangesPosArr
        };
    }
}