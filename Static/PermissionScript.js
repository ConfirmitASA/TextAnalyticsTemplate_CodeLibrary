class PermissionScript{
    static function Render(context){
    if (!context.state.Parameters.GetString('LANGUAGE'))
        context.report.CurrentLanguage = 9;
        else if(parseInt(context.state.Parameters.GetString('LANGUAGE')) != context.report.CurrentLanguage)
            context.report.CurrentLanguage = parseInt(context.state.Parameters.GetString('LANGUAGE'));
}
}
