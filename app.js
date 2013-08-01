//(function () {
	var
		ELEMS_LENGTH = 144,
		ELEMS_IN_ROW = 18,
		MAP_WIDTH = ELEMS_IN_ROW,
		MAP_HEIGHT = ELEMS_LENGTH/ELEMS_IN_ROW,
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

	//TODO: implement via map generator
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
		var
			//currentPoint = JSON.parse(point.dataset.coordinats),
			currentPoint = point,//remove later
			points = [
				{x: -1, y: 0},
				{x: -1, y: -1},
				{x: 0, y: -1},
				{x: 1, y: -1},
				{x: 1, y: 0},
				{x: 1, y: 1},
				{x: 0, y: 1},
				{x: -1, y: 1}
			]
		;

		return filter(insideMap, map(partial(addPoints, currentPoint), points));
	};

	var isPassable = function (point) {
		var
			queryString = '{"x":' + point.x + ',' + '"y":' + point.y + '}',
			elem = document.querySelector("[data-coordinats='" + queryString + "']")
		;

		return elem.className.indexOf("wall") === -1;//TODO: use data-X instead of className
	}

	var getPassableNeighbours = function (point) {
		return filter(isPassable, getNeighbours(point));
	};

	var route = {
		from: null,
		to: null,
		isFull: function () {
			return this.from !== null && this.to !== null;
		}
	};

	var findRoute = function (routeObj) {
		var
			openList = [],
			closedList = [],
			from = routeObj.from,
			to = routeObj.to
		;

		openList.push(from);

		var currentPointsToCheck = map(function (el) {
			el.parentPoint = from;
			return el;
		}, getPassableNeighbours(from));

		closedList.push(openList[0]);//HM
		//delete openList[0];//HM
		console.log("passableNeighbours", getPassableNeighbours(from));
		console.log("currentPointsToCheck", currentPointsToCheck);
		console.log("openList", openList);
		//openList.concat(currentPointsToCheck);
	};

	var resetRoute = function () {
		route.from = route.to = null;
	};

	var showRoute = function (route) {
		var
			currentRoute = findRoute(route),
			routeUnits = currentRoute.elems,
			max = routeUnits.length
			;

		for (var i = 0; i < max; i += 1) {
			routeUnits[i].className = "selected";
		}
	};

	var handleClick = function () {
		return function (e) {
			var target = e.target;
			if (target.className === "unit plain" && !route.isFull()) {
				if (route.from === null) {
					route.from = target.dataset["coordinats"];
					paintTarget(target);
					console.log(route);
					return;
				}
				if (route.to === null) {
					route.to = target.dataset["coordinats"];
					paintTarget(target);
					console.log(route);
					document.getElementById("get-route").onclick = showRoute;
					return;
				}
			}

			document.getElementById("get-route").onclick = null;
			resetRoute();
			clearSelection();
		};
	}();

	var initController = function () {
		document.getElementById("area").addEventListener('click', handleClick, false);//TODO: add wrapper for crossbrowser event attachment
	};

	generateMap();
	buildWalls();
	initController();
//}());

var calculateOptimisticDistance = function (from, to) {
	//var UNIT_SIZE = 10;
	return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
};

var calculateDistanceBetweenNeighbours = function (parentPoint, childPoint) {
	return parentPoint.x === childPoint.x || parentPoint.y === childPoint.y ? 10 : 14;
}