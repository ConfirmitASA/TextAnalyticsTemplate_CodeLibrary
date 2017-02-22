class Translations{
    static function dictionary(language) {
        switch(language) {
            case 25 :
                return {
                    'Dashboard': 'Главная страница',
                    'Selected question': 'Выбранный вопрос',
                    'View by': 'Уровень иерархии',
                    'Top 5 most positive themes': '5 хороших тем',
                    'Top 5 most negative themes': '5 плохих тем',
                    'Start date': 'Дата начала',
                    'End date': 'Дата окончания',
                    'Compare': 'Сравнить',
                    'Top 5 most improved themes': '5 тем ставших лучше',
                    'Top 5 most declined themes': '5 тем ставших хуже',
                    'Theme distribution': 'Изменение тем',
                    'View': 'Показывать',
                    'Positive': "Положительные",
                    'Neutral': 'Нейтральные',
                    'Negative': 'Отрицательные',
                    'Categories': 'Категории',
                    'Count': 'Количество',
                    'Change in avg. score': 'Изменение средней оценки',
                    '1st level (category)': '1-й уровень (категории)',
                    '2nd level (sub-category)': '2-й уровень (подкатегории)',
                    '3rd level (attributes)': '3-й уровень (аттрибуты)'

                };
                break;
            case 9 :
            default:
                return {
                    'Dashboard': 'Dashboard',
                    'Selected question': 'Selected question',
                    'View by': 'View by',
                    'Top 5 most positive themes': 'Top 5 most positive themes',
                    'Top 5 most negative themes': 'Top 5 most negative themes',
                    'Start date': 'Start date',
                    'End date': 'End date',
                    'Compare': 'Compare',
                    'Top 5 most improved themes': 'Top 5 most improved themes',
                    'Top 5 most declined themes': 'Top 5 most declined themes',
                    'Theme distribution': 'Theme distribution',
                    'View': 'View',
                    'Positive': 'Positive',
                    'Neutral': 'Neutral',
                    'Negative': 'Negative',
                    'Categories': 'Categories',
                    'Count': 'Count',
                    'Change in avg. score': 'Change in avg. score',
                    '1st level (category)': '1st level (category)',
                    '2nd level (sub-category)': '2nd level (sub-category)',
                    '3rd level (attributes)': '3rd level (attributes)'
                };
                break;
        }
    }
}
