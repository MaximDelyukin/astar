/*	var roads = {
		"Point KiuKiu": [
			{"to": "Hanaiapa", distance: 19},
			{"to": "Mt Feani", distance: 15},
			{"to": "Taaoa", distance: 15}
		],
		"Taaoa": []
	};*/

function partial(fn) {
	var
		slice = Array.prototype.slice,
		args = slice.call(arguments, 1)
	;

	return function () {
		return fn.apply( null, args.concat( slice.call(arguments) ) );
	};
}

function forEach(func, array) {
	for (var i = 0; i < array.length; i += 1) {
		func(array[i]);
	}
}

function map(func, array) {
	var result = [];
	forEach(function (el) {
		result.push( func(el) );
	}, array);
	return result;
}

function filter(func, array) {
	var resultArray = [];

	for (var i = 0; i < array.length; i += 1) {
		if (func(array[i])) {
			resultArray.push(array[i]);
		}
	}

	return resultArray;
}

function every(func, array) {

	for (var i = 0; i < array.length; i += 1) {
		if ( !( func(array[i]) ) ) {
			return false;
		}
	}

	return true;
}

function any(func, array) {

	for (var i = 0; i < array.length; i += 1) {
		if ( func(array[i]) ) {
			return true;
		}
	}

	return false;
}

function flatten(arrays) {
	var result = [];

	forEach(function (el) {
		forEach( function (el) {
			result.push(el);
		}, el );
	}, arrays);

	return result;
}

function show(smth) {
	console.log(smth);
}

var roads = {};

function makeRoad(from, to, length) {
	function addRoad(from, to) {
		if (!(from in roads)) {
			roads[from] = [];
		}
		roads[from].push({
			to: to,
			distance: length
		});
	}

	addRoad(from, to);
	addRoad(to, from);
}

function makeRoads() {
	if (arguments.length%2 === 0) {
		throw new Error("Wrong amount of arguments");
	}
	else {
		if (arguments.length === 1) {
			throw new Error("Wrong arguments");
		}
		else {
			if (typeof arguments[0] !== "string") {
				throw new Error("Wrong value provided for 'from'");
			}

			var
				from = arguments[0],
				args = [].slice.call(arguments, 1),
				i,
				max = args.length
			;

			for (i = 0; i < max; i += 2) {
				makeRoad(from, args[i], args[ i+1 ]);
			}
		}
	}
}

function roadsFrom(place) {
	var found = roads[place];
	if (found === undefined) {
		throw new Error("No place named '" + place + "' found.");
	}
	else {
		return found;
	}
}

makeRoads("Sasha Grey", "Pamela Anderson", 10, "Sunny Leone", 7, "Angel Dark", 18, "Jessy Jane", 9, "Tera Patrick", 14);
makeRoads("Jenna Jameson", "Sunny Leone", 5, "Angel Dark", 13, "Kayden Kross", 17);
makeRoads("Pamela Anderson", "Sunny Leone", 21, "Kayden Kross", 12, "Asa Akira", 10);

function gamblerPath(from, to) {
	function getRandomInt(below) {
		return Math.floor(Math.random() * below);
	}

	function getRandomDirection(from) {
		var options = roads[from];
		return options[getRandomInt(options.length)].to;
	}

	var path = [];
	while (true) {
		path.push(from);
		if (from === to) {
			break;
		}
		from = getRandomDirection(from);
	}
	return path;
}

function member(array, what) {
	for (var i = 0; i < array.length; i += 1) {
		if (what === array[i]) {
			return true;
		}
	}
	return false;
}

function possibleRoutes(from, to) {

	function findRoutes(route) {
		function notVisited(road) {
			return !member(route.places, road.to);
		}

		function continueRoute(road) {
			return findRoutes({
				places: route.places.concat([road.to]),
				length: route.length + road.distance
			});
		}

		var end = route.places[route.places.length - 1];
		if (end === to) {
			return [route];
		}
		else {
			return flatten(  map( continueRoute, filter(notVisited, roadsFrom(end)) )  );
		}
	}

	return findRoutes({places: [from], length: 0});
}

function shortestRoute(from, to) {
	var
		currentShortest = null,
		allPossibleRoutes = possibleRoutes(from, to)
	;

	forEach(function (route) {
		if (!currentShortest || route.length < currentShortest.length) {
			currentShortest = route;
		}
	}, allPossibleRoutes);

	return currentShortest;
}

function weightedDistance(pointA, pointB) {
	var
		heightDifference = heightAt(pointA) - heightAt(pointB),
		climbFactor = (heightDifference < 0 ? 1 : 2),
		flatDistance = (pointA.x == pointB.x || pointA.y == pointB.y ? 100 : 141)
	;

	return flatDistance + climbFactor * Math.abs(heightDifference);
}

function point(x, y) {
	return {
		x: x,
		y: y
	}
}

function addPoints(a, b) {
	return point(a.x + b.x, a.y + b.y);
}

function samePoint() {
	return a.x === b.x && a.y === b.y;
}

function possibleDirections(from) {
	var mapSize = 20;

	function insideMap(point) {
		return point.x >= 0 && point.x < mapSize && point.y >= 0 && point.y < mapSize;
	}

	var directions = [
		point(-1, 0),
		point(1, 0),
		point(0, -1),
		point(0, 1),
		point(-1, -1),
		point(-1, 1),
		point(1, 1),
		point(1, -1)
	];

	return filter(insideMap, map(partial(addPoints, from), directions));
}