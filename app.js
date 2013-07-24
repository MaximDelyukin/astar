(function () {
	var
		ELEMS_LENGTH = 144,
		ELEMS_IN_ROW = 18;
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

	var initController = function () {
		document.getElementById("area").addEventListener('click', handleClick, false);//TODO: add wrapper for crossbrowser event attachment

	};

	var handleClick = function () {
		var route = {
			from: null,
			to: null,
			isFull: function () {
				return this.from !== null && this.to !== null;
			}
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
		}

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

		var findRoute = function (routeObj) {
			alert(1);
		};

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

	generateMap();
	buildWalls();
	initController();
}());
