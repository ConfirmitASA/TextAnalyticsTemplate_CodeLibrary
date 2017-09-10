/**
 * @class Hierarchy
 * @classdesc Class to create Hierarchical structure from database table
 *
 * @constructs Hierarchy
 * @param {Object} globals - object of global report variables {pageContext: this.pageContext, report: report, user: user, state: state, confirmit: confirmit, log: log}
 * @param {Object} settings - object containing idColumnName, textColumnName, relationshipColumnName, textSeparator
 *
 */
class Hierarchy {
    private var _globals;
    private var _settings;

    private var _hierarchy = [];
    private var _levels = [];
    private var _flat = [];
    private var _flatObject = {};

    private var _defaultSettings = {
            idColumnName: "id",
            textColumnName: "__l9",
            relationshipColumnName: "parent",
            textSeparator: "|"
        };

    function Hierarchy(globals, settings) {
        _globals = globals;
        _settings = _mergeOptions(_defaultSettings, settings);
        var dataTable = _getDataTable();
        if (!dataTable.Columns.Contains(_settings.textColumnName))
            _settings.textColumnName = "__l9"

        _generateFlatList(dataTable.Rows)
        _setupHierarchy(0, null);
    }

    /**
     * @memberof Hierarchy
     * @private
     * @instance
     * @function _mergeOptions
     * @description function to merge two sets of settings
     * @param {Object} obj1
     * @param {Object} obj2
     * @returns {Object}
     */
    private function _mergeOptions(obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }

    /**
     * @memberof Hierarchy
     * @private
     * @instance
     * @function _getDataTable
     * @description function to get DataTable from DatabaseDesigner
     * @returns {DataTable}
     */
    private function _getDataTable() {
        var schema = _globals.confirmit.GetDBDesignerSchema(_settings.schemaId);
        var table = schema.GetDBDesignerTable(_settings.tableName);
        var dataTable = table.GetDataTable();
        return dataTable;
    }

    /**
     * @memberof Hierarchy
     * @private
     * @instance
     * @function _generateFlatList
     * @description creating list of rows for variable _flat
     * @param {Object[]} rows - list of rows from db table
     */
    private function _generateFlatList(rows) {
        for (var i = 0; i < rows.Count; ++i) {
            var flatEntry = _createFlatEntry(rows[i]);
            _flat.push(flatEntry);
        }
    }

    /**
     * @memberof Hierarchy
     * @private
     * @instance
     * @function _createFlatEntry
     * @description creating object from db table row
     * @param {Object} row - db table row
     * @returns {Object}
     */
    private function _createFlatEntry(row) {
        var name = GetSelfName(row[_settings.textColumnName], _settings.textSeparator, _globals.log);
        var flatEntry = {
            id: row[_settings.idColumnName].toLowerCase(),
            text: row[_settings.textColumnName],
            name: name,
            parent: row[_settings.relationshipColumnName] ? row[_settings.relationshipColumnName].toLowerCase() : null
        };
        return flatEntry;
    }

    /**
     * @memberof Hierarchy
     * @instance
     * @function GetSelfName
     * @description return self name of subcategory from the full name
     * @param {String} name - full name
     * @param {String} separator - separation char
     * @returns {String}
     */
    static function GetSelfName(name, separator){
        var index = name.lastIndexOf(separator);
        return name.slice((index+1)).Trim();
    }

    /**
     * @memberof Hierarchy
     * @instance
     * @function GetHierarchyArray
     * @description function to get Array of hierarchical objects
     * @returns {Object[]}
     */
    function GetHierarchyArray() {
        return _hierarchy;
    }


    /**
     * @memberof Hierarchy
     * @instance
     * @function GetLevelArray
     * @description function to get Array of hierarchical objects of particular level
     * @param {Number} level
     * @returns {Object[]}
     */
    function GetLevelArray(level) {
        if (_levels.length > level) {
            return _levels[level];
        } else {
            throw new Error(201, "Hierarchy level index is out of range");
        }
    }

    /**
     * @memberof Hierarchy
     * @instance
     * @function GetLevelsCount
     * @description function to get Count of levels in the hierarchy
     * @returns {Number}
     */
    function GetLevelsCount() {
        return _levels.length
    }

    /**
     * @memberof Hierarchy
     * @instance
     * @function GetFlatArray
     * @description function to get Array of rows from db table
     * @returns {Number}
     */
    function GetFlatArray() {
        return _flat;
    }

    /**
     * @memberof Hierarchy
     * @instance
     * @function GetObjectById
     * @description function to get particular row from db table
     * @param {String} id
     * @returns {Object}
     */
    function GetObjectById(id) {
        if (_flatObject[id]) {
            return _flatObject[id];
        } else {
            throw new Error(201, "Hierarchy object id doesn't exist");
        }
    }

    /**
     * @memberof Hierarchy
     * @instance
     * @function GetTextSeparator
     * @description function to get text separartor for categories
     * @returns {String}
     */
    function GetTextSeparator() {
        return _settings.textSeparator;
    }

    /**
     * @memberof Hierarchy
     * @private
     * @instance
     * @function _setupHierarchy
     * @description recursive function to parse db table to hierarchical view
     * @param {Number} level
     * @param {Number} parentObj
     */
    private function _setupHierarchy(level, parentObj) {
        var parentObjId = parentObj ? parentObj.id : "";

        for (var i = 0; i < _flat.length; ++i) {
            if (( !parentObj && !_flat[i].parent ) || parentObjId.CompareTo(_flat[i].parent ? _flat[i].parent : "") == 0) {
                var newObj = {
                    id: _flat[i].id,
                    text: _flat[i].text,
                    name: _flat[i].name,
                    parent: parentObjId,
                    subcells: [],
                    level: level
                };
                if (_levels.length <= level) {
                    _levels.push([]);
                }
                _setupHierarchy((level + 1), newObj);
                if (!parentObj) {
                    _hierarchy.push(newObj);
                }
                else {
                    parentObj.subcells.push(newObj);
                }
                _levels[level].push(newObj);
                _flatObject[newObj.id] = newObj;
            }
        }
    }
}