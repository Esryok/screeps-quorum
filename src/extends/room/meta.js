'use strict'

const unicodeModifier = 200
const quadrantMap = {
  0: {
    x: 'E',
    y: 'N'
  },
  1: {
    x: 'E',
    y: 'S'
  },
  2: {
    x: 'W',
    y: 'S'
  },
  3: {
    x: 'W',
    y: 'N'
  }
}

Room.serializeName = function (name) {
  const coords = Room.getCoordinates(name)
  let quad
  if (coords.x_dir === 'E') {
    quad = coords.y === 'N' ? '0' : '1'
  } else {
    quad = coords.y === 'S' ? '2' : '3'
  }
  const x = String.fromCodePoint(+coords.x + +unicodeModifier)
  const y = String.fromCodePoint(+coords.y + +unicodeModifier)
  return `${quad}${x}${y}`
}

Room.deserializeName = function (sName) {
  const xDir = quadrantMap[sName[0]].x
  const yDir = quadrantMap[sName[0]].y
  const x = sName.codePointAt(1) - unicodeModifier
  const y = sName.codePointAt(2) - unicodeModifier
  return `${xDir}${x}${yDir}${y}`
}

Room.getCoordinates = function (name) {
  const coordinateRegex = /(E|W)(\d+)(N|S)(\d+)/g
  const match = coordinateRegex.exec(name)
  return {
    'x': match[2],
    'y': match[4],
    'x_dir': match[1],
    'y_dir': match[3]
  }
}

Room.getRoomsInRange = function (name, range) {
  const coords = Room.getCoordinates(name)
  const startXdir = coords.x_dir
  const startYdir = coords.y_dir
  const left = coords.x - range
  const right = +coords.x + +range
  const top = coords.y - range
  const bottom = +coords.y + +range
  const lowerX = Math.min(left, right)
  const upperX = Math.max(left, right)
  const lowerY = Math.min(top, bottom)
  const upperY = Math.max(top, bottom)

  let rooms = []
  for (var x = lowerX; x <= upperX; x++) {
    for (var y = lowerY; y <= upperY; y++) {
      let xNorm, xdir
      if (x < 0) {
        xNorm = Math.abs(x) - 1
        xdir = startXdir === 'E' ? 'W' : 'E'
      } else {
        xNorm = x
        xdir = startXdir
      }
      let yNorm, ydir
      if (y < 0) {
        yNorm = Math.abs(y) - 1
        ydir = startYdir === 'N' ? 'S' : 'N'
      } else {
        yNorm = y
        ydir = startYdir
      }
      rooms.push(xdir + xNorm + ydir + yNorm)
    }
  }
  return rooms
}

Room.isSourcekeeper = function (name) {
  const coords = Room.getCoordinates(name)
  let xMod = coords.x % 10
  let yMod = coords.y % 10
  return xMod >= 4 && xMod <= 6 && yMod >= 4 && yMod <= 6
}
