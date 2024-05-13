import { Box } from "../../tour/domain/box.domain";
import { Plane } from "../domain/plane.domain";


export class GenerateWayfindingUseCase {

    constructor() { }

    run(originBox: Box, destinyBox: Box, plane: Plane) {
        return this.astart(originBox, destinyBox, plane.rows, plane.columns);
    }

    private astart(start: Box, goal: Box, rows: number, columns: number): Box[] | null {
        const openSet = [start];
        const cameFrom = new Map<Box, Box>(); // closedSet
        const gScore = new Map<Box, number>();
        const fScore = new Map<Box, number>(); // f(n) = g(n) + h(n)

        const middleRow = Math.floor(rows / 2);
        const realGoal = goal;

        if (goal.y > middleRow) { // Up
            goal = goal.neighbors.filter(n => n.x === goal.x && n.y < goal.y).pop() || goal;
        }

        if (goal.y < middleRow) { // Down
            if (goal.neighbors.filter(n => n.type === 'block' && n.y > goal.y).length > 0) {
                let possible = goal.neighbors.filter(n => n.x === goal.x && n.y < goal.y).pop() || goal;
                goal = possible;
            } else {
                let possible = goal.neighbors.filter(n => n.x === goal.x && n.y > goal.y).pop() || goal;
                goal = possible;
            }
        }

        // Left 
        if ((goal.y === start.y && goal.x > start.x) || (goal.x === columns - 1)) {
            goal = goal.neighbors.filter(n => n.y === goal.y && n.x < goal.x).pop() || goal;
        }

        // Right 
        if ((goal.x === 0) || goal.y === start.y && goal.x < start.x) {
            goal = goal.neighbors.filter(n => n.y === goal.y && n.x > goal.x).pop() || goal;
        }

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (openSet.length > 0) { // while open set its not empty
            const current = this.getBoxWithLowestFScore(openSet, fScore);

            if (current === goal) {
                return this.reconstructPath(cameFrom, current, realGoal);
            }

            openSet.splice(openSet.indexOf(current), 1); // remove one element, the current box

            for (let neighbor of current.neighbors) {
                if (
                    !neighbor.isIgnored && // It does not include the boxes, these are to be ignored (type obstacle)
                    !neighbor.neighbors.some(n => n.isIgnored) // if neighboring boxes have any obstacles
                ) { // discard boxes for the tour
                    const tentativeGScore = gScore.get(current) || 0 + this.heuristic(current, neighbor);

                    if (!gScore.has(neighbor) || tentativeGScore < (gScore.get(neighbor) || -1)) {

                        cameFrom.set(neighbor, current);
                        gScore.set(neighbor, tentativeGScore);
                        fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, goal)); // heuristic

                        if (!openSet.includes(neighbor)) {
                            openSet.push(neighbor);
                        }
                    }
                }
            }
        }
        return null; // No wayfinding was found
    }

    private reconstructPath(cameFrom: Map<Box, Box>, current: Box, goal: Box): Box[] {
        const total_path = [current];

        while (cameFrom.has(current)) {
            current = <Box>cameFrom.get(current);
            total_path.unshift(current);
        }

        total_path.push(goal);

        return total_path;
    }

    private heuristic(firstbox: Box, secondbox: Box): number { // Manhattan distance
        return Math.abs(firstbox.x - secondbox.x) + Math.abs(firstbox.y - secondbox.y);
    }

    private getBoxWithLowestFScore(boxes: Box[], fScore: Map<Box, number>): Box {
        let lowestBox = boxes[0];
        let lowestFScore = fScore.get(lowestBox) || 0;

        for (let i = 1; i < boxes.length; i++) {
            const box = boxes[i];
            const boxFScore = fScore.get(box) || 0;

            if (boxFScore < lowestFScore) {
                lowestBox = box;
                lowestFScore = boxFScore;
            }
        }

        return lowestBox;
    }

}