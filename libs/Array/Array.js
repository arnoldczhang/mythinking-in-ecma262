'use strict'
;(function () {

	var 
		OBJ = {}
		, ARR = []
		, STR = ''

		, $toString = OBJ.toString

		, MAX_ARRAY_LEN = Math.pow(2, 53) -1
		;

	var _ = {};

	$each('Object String Symbol Null Undefined Array Function '.split(/\s/), function (el) {
		_['is' + el] = function (obj) {
			return $toString.call(obj) === '[object ' + el + ']';
		};
	});

	var logger = function () {
		var keySet = {};
		return {
			count: function count (key) {

				var count = keySet[key];

				if (_.isUndefined(count)) {
					keySet[key] = count = 1;
				}

				else {
					keySet[key] = count += 1;
				}

				console.log((key + ' call for ' + count + ' times').magenta);
			}
		};
	}();

	function isCallable (func) {
		return func.call;
	};

	function isPropertyKey (arg) {

		if (_.isString(arg)) {
			return true;
		}

		if (_.isSymbol(arg)) {
			return true;
		}

		return false;
	};

	function isConstructor (func) {

		if (!_.isObject(func)) {
			return false;
		}

		if (func.constructor) {
			return true;
		}

		return false;
	};

	function toObject (o) {

		if (_.isNull(o) || _.isUndefined(o)) {
			throw new TypeError('');
		}

		return Object(o);
	};

	function getV (v, p) {

		if (isPropertyKey(p)) {
			var o = toObject(v);
			return o[p];
		}
	};

	function getMethod (v, p) {

		if (isPropertyKey(p)) {
			var func = getV(v, p);
		}
	};

	function $each (arr, cb, thisArg) {
		var 
			i = 0
			, len
			;

		if (isCallable(cb)) {
			if (len = arr.length) {
				for ( ; i < len; ++i) {
					cb.call(thisArg, arr[i], i, arr);
				}
			}			
		}
	};

	function $def (obj, prop, value) {
		Object.defineProperty(obj, prop, {
			enumerable: false,
			configurable: false,
			value: value
		});
	};

	/**
	 * Array.from
	 */
	$def(Array, '$from', function from (items, mapFn, thisArg) {
		logger.count('`Array.from`');
		var 
			_this = this
			, hasMapFn = mapFn && isCallable(mapFn)
			, T = thisArg || undefined
			, index
			, length
			, arr
			;

		if (_.isArray(items)) {

			if (items.length >= MAX_ARRAY_LEN) {
				throw new TypeError('');
			}

			arr = Array(0);
			$each(items, hasMapFn ? function (item, index, _a) {
				arr[index] = mapFn.call(T, item, index, _a);
			} : function (item, index) {
				arr[index] = item;
			});
		}

		else {
			length = toObject(items).length;
			arr = Array(length);
			index = -1;

			while (++index < length) {
				arr[index] = hasMapFn 
					? mapFn.call(T, items[index], index, items)			
					: items[index];
			}
		}

		return arr;
	});

	/**
	 * Array.of
	 */
	$def(Array, '$of', function of () {
		logger.count('`Array.of`');
		var
			args = arguments
			, length = args.length
			, _this = this
			, index = -1
			, arr
			;

		arr = Array(length);

		while (++index < length) {
			arr[index] = args[index];
		}

		return arr;
	});

	/**
	 * Array.prototype.concat
	 */
	$def(Array.prototype, '$concat', function concat () {
		logger.count('`Array.prototype.concat`');
		var 
			args = arguments
			, _this = this
			, length = args.length
			, list = Array(length + 1)
			, arr = []
			, n = 0
			, index = 0
			;
		
		list[0] = _this;
		$each(args, function (arg, i) {
			list[i + 1] = arg;
		});

		$each(list, function (item) {

			if (_.isArray(item)) {

				if (n + item.length > MAX_ARRAY_LEN) {
					throw new TypeError('');
				}

				$each(item, function (it) {
					arr[arr.length] = it;
					n++;
				});
			}

			else {

				if (n + 1 > MAX_ARRAY_LEN) {
					throw new TypeError('');
				}

				arr[arr.length] = item;
				n++;
			}
		});
		return arr;
	});

	/**
	 * Array.prototype.copyWithin
	 */
	$def(Array.prototype, '$copyWithin', function copyWithin (target, start, end) {
		logger.count('`Array.prototype.copyWithin`');
		var 
			args = arguments
			, _this = Object(this)
			, length = _this.length
			, list = []
			, index = 0
			, to
			, from
			, count
			, final
			, direction
			, relativeTarget = target >> 0
			, relativeStart = start >> 0
			, relativeEnd
			;

		if (relativeTarget < 0) {
			to = Math.max(length + relativeTarget, 0);
		}

		else {
			to = Math.min(relativeTarget, length);
		}

		if (relativeStart < 0) {
			from = Math.max(length + relativeStart, 0);
		}

		else {
			from = Math.min(relativeStart, length);
		}

		if (_.isUndefined(end)) {
			relativeEnd = length;
		}

		else {
			relativeEnd = end >> 0;
		}

		if (relativeEnd < 0) {
			final = Math.max(length + relativeEnd, 0);
		}

		else {
			final = Math.min(relativeEnd, length);
		}

		count = Math.min(final - from, length - to);

		if (from < to && to < (from + count)) {
			direction = -1;
			from += count - 1;
			to += count - 1;
		}

		else {
			direction = 1;
		}

		while (count > 0) {

			if (from in _this) {
				_this[to] = _this[from];
			}

			else {
				delete O[to];
			}

			from += direction;
			to += direction;
			count--;
		}

		return _this;
	});

	/**
	 * Array.prototype.every
	 */
	$def(Array.prototype, '$every', function every (cb, thisArg) {
		logger.count('`Array.prototype.every`');
		thisArg = thisArg || void 0;
		var 
			args = arguments
			, _this = Object(this)
			, length = _this.length
			, list = []
			, index = length
			, returnValue = true
			;

		if (!isCallable(cb)) {
			throw new TypeError('');
		}

		while (--index >= 0) {
			
			if (!cb.call(thisArg, _this[index], index, _this)) {
				returnValue = false;
				break;
			}
		}
		return returnValue;
	});
} ());








