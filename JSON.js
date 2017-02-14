/**
* @class JSON
* @classdesc Class with functions Helping working with reportal objects like JSON objects
*/
class JSON
{
    /**
     * @memberof JSON
     * @function stringify
     * @description implement JSON.stringify serialization
     * @param {Object} obj
     * @returns {String}
     */
    static function stringify(obj) {

        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+ _escapeEntities(obj) +'"';
            else if(t=="number") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string"){
                    v = '"'+ _escapeEntities(v) +'"';
                }
                else if (t == "object" && v !== null) v = stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    /**
     * @memberof JSON
     * @private
     * @function _escapeEntities
     * @description function to replace some chars
     * @param {String} str
     * @returns {String}
     */
    private static function _escapeEntities(str) {
        var entitiesMap = {

            '\"': '\\&quot;',
            '\'':'&amp;apos;'
        };
        return str.replace(/[\"\']/g, function(key) {
            return entitiesMap[key];
        });
    }

    /**
     * @memberof JSON
     * @function print
     * @description function to create js variable from reportal object
     * @param {Object} config - reportal object
     * @param {String} configName - name for the js variable ('config' by degault)
     * @returns {String}
     */
    static function print(config, configName){ // JSON.print prints JSON `config` to page as JavaScript variable with a specified `configName`
        var varName = configName || 'config';
        return '<script type="text/javascript">var '+ varName + '=' + stringify(config) +'</script>';
    }
}