class JSON
{
    static function stringify(obj) { // implement JSON.stringify serialization
    function escapeEntities(str) {
        var entitiesMap = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '\"': '\\&quot;',
            '\'':'&amp;apos;'
        };
        return str.replace(/[&<>\"\']/g, function(key) {
            return entitiesMap[key];
        });
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+ escapeEntities(obj) +'"';
        else if(t=="number") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string"){
                v = '"'+ escapeEntities(v) +'"';
            }
            else if (t == "object" && v !== null) v = stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

    static function print(config, configName){ // JSON.print prints JSON `config` to page as JavaScript variable with a specified `configName`
    var varName = configName || 'config';
    return '<script type="text/javascript">var '+ varName + '=' + stringify(config) +'</script>';
};
}