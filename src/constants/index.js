import { initFields } from '../utils';

const defaultSideLength = 35
export const defaultInterval = 100;
export const defaultDifficulty = 3
export const initialPosition = { x: 17, y: 17 }
export const initialValues = initFields(defaultSideLength, initialPosition)
export const Difficulty = [1000, 500, 100, 50, 10]

export const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover',
})

export const Direction = Object.freeze({
  switch: 'switch',
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down',
})

// 真逆方向進行をNGとするマッピング
export const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up',
})

// 移動時の座標の増減
export const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
})

export const DirectionKeyCodeMap = Object.freeze({
    32: Direction.switch,
    37: Direction.left,
    38: Direction.up,
    39: Direction.right,
    40: Direction.down,
})
