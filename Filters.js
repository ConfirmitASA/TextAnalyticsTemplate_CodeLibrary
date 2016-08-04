class Filters {
    static function NegNeuPosFilter(context){
        TAFilterUtils.NegNeuPosFilter(context.component, context.state.Parameters.GetString("TA_VIEW_SENTIMENT"))
    }

    static function FilterPageFilter(context) {
    if(!context.State.Parameters.IsNull("FILTERS_SELECTED_EXPRESSION")) {
        context.Component.Expression = context.State.Parameters.GetString("FILTERS_SELECTED_EXPRESSION");
    }
    else {
        context.Component.Expression = "";
    }
}

    static function TACurrentThemeFilter(context){
        TAFilterUtils.currentThemeFilter(context.component)
    }
}