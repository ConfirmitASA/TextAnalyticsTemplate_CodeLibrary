class TAArrayUtils {
    static function indexOf(arr, item) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === item) {
                return i;
            }
        }

        return -1;
    }

    static function find(arr, func) {
        for(var i = 0; i < arr.length; i++) {
            if(func(arr[i], i, arr)) {
                return arr[i];
            }
        }

        return null;
    }

    static function map(arr, func) {
        var newArr = [];

        for(var i = 0; i < arr.length; i++) {
            newArr.push(func(arr[i], i, arr));
        }

        return newArr;
    }

    static function filter(arr, func) {
        var newArr = [];

        for(var i = 0; i < arr.length; i++) {
            if(func(arr[i], i, arr)) {
                newArr.push(arr[i]);
            }
        }

        return newArr;
    }

    static function reduce(arr, func, initialValue) {
        var result = initialValue || arr.unshift();

        for(var i = 0; i < arr.length; i++) {
            result = func(result, arr[i], i, arr);
        }

        return result;
    }

    static function memberOf(arr, func) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === func(arr[i], i, arr)) {
                return true;
            }
        }

        return false;
    }
}