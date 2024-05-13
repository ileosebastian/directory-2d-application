import { Box } from "../../tour/domain/box.domain";


export class AddNeigborsUseCase {

    run(stage: Box[][], box: Box): Box {
        const COOR_OPTIONS = {
            'top-left-corner': [ // x = 0, y = 0
                { x: box.x, y: box.y + 1 }, // abajo
                { x: box.x + 1, y: box.y }, // derecha 
            ],
            'top': [
                { x: box.x - 1, y: box.y }, // izquierda
                { x: box.x + 1, y: box.y }, // derecha
                { x: box.x, y: box.y + 1 }, // abajo
            ],
            'top-right-corner': [ // x = columns-1, y = 0
                { x: box.x, y: box.y + 1 }, // abajo
                { x: box.x - 1, y: box.y }, // izquierda
            ],
            'left': [
                { x: box.x, y: box.y - 1 }, // arriba 
                { x: box.x, y: box.y + 1 }, // abajo
                { x: box.x + 1, y: box.y }, // derecha
            ],
            'body': [
                { x: box.x, y: box.y - 1 }, // arriba
                { x: box.x, y: box.y + 1 }, // abajo
                { x: box.x - 1, y: box.y }, // izquieda
                { x: box.x + 1, y: box.y }, // derecha
            ],
            'right': [
                { x: box.x, y: box.y - 1 }, // arriba
                { x: box.x, y: box.y + 1 }, // abajo
                { x: box.x - 1, y: box.y }, // izquierda
            ],
            'bottom-left-corner': [ // x = 0, y = rows-1
                { x: box.x, y: box.y - 1 }, // arriba
                { x: box.x + 1, y: box.y }, // derecha
            ],
            'bottom': [
                { x: box.x - 1, y: box.y }, // izquierda
                { x: box.x + 1, y: box.y }, // derecha
                { x: box.x, y: box.y - 1 }, // arriba
            ],
            'bottom-right-corner': [ // x = columns-1, y = rows-1
                { x: box.x, y: box.y - 1 }, // arriba
                { x: box.x - 1, y: box.y }, // izquierda
            ],
        };

        box.neighbors = [];
        COOR_OPTIONS[box.kindOption]
            .forEach(coor => box.neighbors.push( stage[coor.x][coor.y] ));

        return box;
    }

}