class PermissionScript{
    static function Render(context){
    if (!context.state.Parameters.GetString('LANGUAGE'))
        context.report.CurrentLanguage = 9;
        else if(context.state.Parameters.GetString('LANGUAGE') != parseInt(context.report.CurrentLanguage))
            context.report.CurrentLanguage = parseInt(context.state.Parameters.GetString('LANGUAGE'));
}
}
