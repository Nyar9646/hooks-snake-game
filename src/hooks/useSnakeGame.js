import { useCallback, useEffect, useState } from 'react';
import {
    defaultInterval,
    defaultDifficulty,
    Delta,
    Difficulty,
    Direction,
    DirectionKeyCodeMap,
    GameStatus,
    OppositeDirection,
    initialPosition,
    initialValues,
} from '../constants';
import {
    initFields,
    isCollision,
    isEatingMyself,
    getFoodPosition,
} from '../utils';

// let timer = undefined
let timer = null

const unsubscribe = () => {
    if (!timer) return
    clearInterval(timer)
}

const useSnakeGame = () => {
    const [fields, setFields] = useState(initialValues)
    const [body, setBody] = useState([])
    const [status, setStatus] = useState(GameStatus.init)
    const [direction, setDirection] = useState(Direction.up)
    const [difficulty, setDifficulty] = useState(defaultDifficulty)
    const [tick, setTick] = useState(0)

      /* ゲームの中の時間を管理 */
    useEffect(() => {
        setBody([initialPosition])
        //test code
        // setBody(
        //   new Array(15).fill('').map((_item, index) => ({x: 17, y: 17 + index }))
        // )

        const interval = Difficulty[difficulty - 1]

        timer = setInterval(() => {
            setTick(tick => tick + 1)
        }, interval)

        return unsubscribe
    }, [difficulty])

    /* tickが更新されている限りスネークを動かす */
    useEffect(() => {
        if (body.length === 0 || status !== GameStatus.playing) {
            return
        }

        const canContinue = handleMoving()

        if(!canContinue) {
            unsubscribe()
            setStatus(GameStatus.gameover)
        }
    }, [tick])

    const start = () => setStatus(GameStatus.playing)

    const stop = () => setStatus(GameStatus.suspended)

    const reload = () => {
        timer = setInterval(() => {
            setTick(tick => tick + 1)
        }, defaultInterval)

        setDirection(Direction.up)
        setStatus(GameStatus.init)
        setBody([initialPosition])
        setDifficulty(defaultDifficulty)
        setFields(initFields(fields.length, initialPosition))
    }

    const updateDirection = useCallback((newDirection) => {
        if (status !== GameStatus.playing) {
            if (newDirection === Direction.switch) {
                status === GameStatus.gameover && reload()
                status === GameStatus.init && start()
                status === GameStatus.suspended && start()
            }

            return direction
        }

        if (OppositeDirection[direction] === newDirection
            || direction === newDirection
        ) {
            return
        }

        if (newDirection === Direction.switch) {
            stop()
        } else {
            setDirection(newDirection)
        }
    }, [direction, status])

    const updateDifficulty = useCallback((difficulty) => {
        if (status !== GameStatus.init) {
            return
        }

        if (difficulty < 1 || difficulty > Difficulty.length) {
            return
        }

        setDifficulty(difficulty)
    }, [status, difficulty])

    /* キー押下に対応させる */
    useEffect(() => {
        const handleKeyDown = e => {
            const newDirection = DirectionKeyCodeMap[e.keyCode]

            if (!newDirection) {
            return
            }

            updateDirection(newDirection)
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [updateDirection])

    const handleMoving = () => {
        const {x, y} = body[0]
        const delta = Delta[direction]

        const newPosition = {
            x: x + delta.x,
            y: y + delta.y,
        }

        if (isCollision(fields.length, newPosition)
            || isEatingMyself(fields, newPosition)
        ) {
            return false
        }

        const newBody = [...body]

        if(fields[newPosition.y][newPosition.x] !== 'food') {
            const removingTrack = newBody.pop()
            fields[removingTrack.y][removingTrack.x] = ''
        } else {
            const food = getFoodPosition(fields.length, [...newBody, newPosition])
            fields[food.y][food.x] = 'food'
        }

        fields[newPosition.y][newPosition.x] = 'snake'
        newBody.unshift(newPosition)
        setBody(newBody)
        setFields(fields)
        return true
    }

    return {
        body,
        difficulty,
        fields,
        status,
        start,
        stop,
        reload,
        updateDirection,
        updateDifficulty,
    }
}

export default useSnakeGame
