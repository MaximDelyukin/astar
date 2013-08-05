(function () {
	var
		ELEMS_LENGTH = 144,
		ELEMS_IN_ROW = 18,
		MAP_WIDTH = ELEMS_IN_ROW - 1,
		MAP_HEIGHT = (ELEMS_LENGTH/ELEMS_IN_ROW) - 1,
		container = document.getElementById("area")
	;

	var getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var generateMap = function () {
		var
			units = document.createDocumentFragment(),
			unit = null,
			classNameIndex = 0,
			classNames = ["unit plain", "unit wall"],
			coords = null
		;

		for (var i = 0; i < ELEMS_LENGTH; i += 1) {
			unit = document.createElement("div");
			unit.className = "unit plain";

			coords = {
				x: i%ELEMS_IN_ROW,
				y: Math.floor(i/ELEMS_IN_ROW),
			}

			unit.dataset.coordinats = JSON.stringify(coords);

			unit.innerHTML = coords.x + ' ' + coords.y;
			units.appendChild(unit);
		}

		container.appendChild(units);
	};

	var buildWalls = function () {
		var
			walls = [20, 21, 22, 23, 26, 27, 28, 29, 30, 31, 56, 57, 58, 59, 60, 61, 66, 79, 82, 83, 84, 91, 97, 100, 102, 103, 104, 117, 118, 122],
			renderedUnits = document.querySelectorAll(".unit")
		;

		for (var j = 0; j < walls.length; j += 1) {
			renderedUnits[walls[j]].className = "unit wall";
		}
	};

	var point = function (x ,y) {
		return {x: x, y: y};
	};

	var addPoints = function (a, b) {
		return point(a.x + b.x, a.y + b.y);
	};

	var samePoint = function (a, b) {
		return a.x === b.x && a.y === b.y;
	};

	var insideMap = function (point) {
		return point.x >= 0 && point.x <= MAP_WIDTH && point.y >= 0 && point.y <= MAP_HEIGHT;
	};

	var paintTarget = function (elem) {
		elem.className += " selected";
	};

	var clearSelection = function () {
		var
			selectedElems = document.querySelectorAll(".selected"),
			max = selectedElems.length
		;

		for (var i = 0; i < max; i += 1) {
			selectedElems[i].className = "unit plain";
		}
	};

	var highlightPoints = function (points) {
		forEach(function (i) {
			var queryString = '{"x":' + i.x + ',' + '"y":' + i.y + '}';
			document.querySelector("[data-coordinats='" + queryString + "']").className += ' selected';
		}, points);
	};

	var getNeighbours = function (point) {
		var points = [
			{x: -1, y: 0},
			{x: -1, y: -1},
			{x: 0, y: -1},
			{x: 1, y: -1},
			{x: 1, y: 0},
			{x: 1, y: 1},
			{x: 0, y: 1},
			{x: -1, y: 1}
		];

		return filter(insideMap, map(partial(addPoints, point), points));
	};

	//TODO: use id generation for querying in order to increase performance
	//TODO: use data-X instead of className for storing state
	var isPassable = function (point) {
		var
			queryString = '{"x":' + point.x + ',' + '"y":' + point.y + '}',
			elem = document.querySelector("[data-coordinats='" + queryString + "']")
		;

		return elem.className.indexOf("wall") === -1;
	}

	var getPassableNeighbours = function (point) {
		return filter(isPassable, getNeighbours(point));
	};

	var calculateOptimisticDistance = function (from, to) {
		var UNIT_SIZE = 10;
		return (Math.abs(to.x - from.x) + Math.abs(to.y - from.y)) * UNIT_SIZE;
	};

	var calculateDistanceBetweenNeighbours = function (parentPoint, childPoint) {
		return parentPoint.x === childPoint.x || parentPoint.y === childPoint.y ? 10 : 14;
	};

	var calculateG = function (point) {
		var
			parentPoint = point.parentPoint,
			distanceToParent = calculateDistanceBetweenNeighbours(parentPoint, point)
		;

		if (parentPoint) {
			return distanceToParent + parentPoint.g;
		}
		else {
			return distanceToParent;
		}
	};

	var findRoute = function (start, end) {
		var
			from = start,
			to = end,
			openList = new BinaryHeap(function (point) {
				point.f = calculateOptimisticDistance(point, to) + point.g;
				return point.f;
			}),
			closedList = []
		;

		var isInOpenList = function (point) {
			return any(function (el) {
				return point.x === el.x && point.y === el.y;
			}, openList.content);
		};

		var isInClosedList = function (point) {
			return any(function (el) {
				return point.x === el.x && point.y === el.y;
			}, closedList);
		};

		var buildRoute = function() {
			var resultRoute = [];

			return function getParentPoint(point) {
				resultRoute.push(point);
				if (point.parentPoint) {
					getParentPoint(point.parentPoint);
				}
				
				return resultRoute;
			}
		}();

		from.g = 0;
		openList.push(from);

		var find = function find() {
			

			var currentStart = openList.pop();
			closedList.push(currentStart);

			forEach(function (el) {
				if ( !(isInClosedList(el)) ) {
					if ( !(isInOpenList(el)) ) {
						el.parentPoint = currentStart;
						el.g = calculateG(el);
						openList.push(el);
						if (el.x === to.x && el.y === to.y) {
							window.pointReached = true; //TODO: change this temporary stub
						}
					}
					else {
						var newG = calculateDistanceBetweenNeighbours(currentStart, el) + currentStart.g;
						if (newG < el.g) {
							

							openList.remove(el);

							el.parentPoint = compare;
							el.g = calculateG(el);

							openList.push(el);
						}
					}
				}
				return el;
			}, getPassableNeighbours(currentStart));

			if (!window.pointReached) {
				find();
			}
			else {
				
			}
		};

		find();
		
		

		highlightPoints(buildRoute(openList.pop()));
	};

	var route = {
		from: null,
		to: null,
		isFull: function () {
			return this.from !== null && this.to !== null;
		}
	};

	var reset = function () {
		delete window.pointReached;
		route.from = route.to = null;
	};


	var handleClick = function (e) {
		var target = e.target;
		if (target.className === "unit plain" && !route.isFull()) {
			if (route.from === null) {
				route.from = JSON.parse(target.dataset["coordinats"]);
				paintTarget(target);
				
				return;
			}
			if (route.to === null) {
				route.to = JSON.parse(target.dataset["coordinats"]);
				paintTarget(target);
				

				var showRoute = function () {
					return findRoute(route.from, route.to);
				};

				document.getElementById("get-route").onclick = showRoute;
				return;
			}
		}

		document.getElementById("get-route").onclick = null;
		reset();
		clearSelection();
	};

	generateMap();
	buildWalls();
	document.getElementById("area").addEventListener('click', handleClick, false);//TODO: add wrapper for crossbrowser event attachment
}());