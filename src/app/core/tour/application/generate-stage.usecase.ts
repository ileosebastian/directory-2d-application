import { Plane } from "../../map/domain/plane.domain";
import { isAWaypoint } from "../../shared/utils/is-a-waypoint.util";
import { Block } from "../domain/block.domain";
import { Box } from "../domain/box.domain";
import { Sprite } from "../domain/sprite.domain";
import { Waypoint } from "../domain/waypoint.domain";
import { sourceByCategory } from '../../shared/data/constants.data';
import { BlockRole } from "../../shared/models/core.types";


export class GenerateStageUseCase {

    private ROLES_NOT_SHOW: BlockRole[] = ['invisible_lock_down', 'invisible_lock_up', 'waypoint'];
    private middleRow!: number;

    run(plane: Plane, canvas: HTMLCanvasElement, user: Waypoint) {
        const ctx = canvas.getContext('2d');

        if (ctx === null) return;

        this.clearCanvas(canvas, ctx);

        this.middleRow = Math.floor(plane.rows/2);

        plane.stage.forEach(column => {
            column.forEach((row) => {
                if (ctx) {
                    // draw map
                    if (row.type === 'ground') {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(
                            row.x * plane.widthTiles,
                            row.y * plane.heightTiles,
                            plane.heightTiles, plane.heightTiles
                        );
                    } else if (row.type === 'block') {
                        this.drawBlock(<Block>row.contain, row.x, row.y, plane.widthTiles, plane.heightTiles, ctx);
                        if (row.contain && isAWaypoint(row.contain) && row.contain.uuid === user.uuid) {
                            this.drawUser(row, plane, ctx);
                        }
                    } else {
                        const sprite = row.contain as Sprite;
                        this.drawSprite(sprite, sprite.label || '', row.x, row.y, plane.widthTiles, plane.heightTiles, ctx);
                    }
                }
            });
        });

        this.showLabelFloor(plane.floor);
    }

    private showLabelFloor(floor: number) {
        const labelFloor = document.getElementById('labelfloor');
        if (labelFloor) {
            labelFloor.innerHTML = `${floor === 1 ? 'Planta Baja' : 'Piso ' + (floor - 1)}`;
        }
    }

    private drawUser(userBox: Box, plane: Plane, context: CanvasRenderingContext2D) {
        const user = new Image();

        let centerX = 11;
        let centerY = 0;

        if (userBox.y > this.middleRow) {
            centerY = 25;
        }

        user.onload = () => {
            context.drawImage(
                user,
                userBox.x * plane.widthTiles - centerX,
                userBox.y * plane.heightTiles - centerY,
                user.width, user.height
            );
        };
        user.src = sourceByCategory['user'];
        user.width = 35;
        user.height = 38;
    }

    private clearCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        // Store the current transformation matrix
        context.save();

        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        context.restore();
    }

    private drawBlock(
        contentToDraw: Block,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        context.fillStyle = this.ROLES_NOT_SHOW.includes( contentToDraw.blockType ) ? 'white' : contentToDraw.color;
        context.fillRect(x * widthTiles, y * heightTiles, heightTiles, heightTiles);
    }

    private drawSprite(
        contentToDraw: Sprite,
        label: string,
        x: number, y: number,
        widthTiles: number, heightTiles: number,
        context: CanvasRenderingContext2D
    ) {
        const image = new Image();
        image.onload = () => {
            context.drawImage(
                image,
                x * widthTiles,
                y * heightTiles,
                image.width, image.height
            );
            const fontSizeInPx = Math.floor(contentToDraw.width / 2.6);
            context.font = `bold ${fontSizeInPx}px Arial`;
            context.fillStyle = "black";

            context.fillText(label, x * widthTiles + (Math.floor(contentToDraw.width / 5)), y * heightTiles + (contentToDraw.height + 13));
        };
        image.src = sourceByCategory[contentToDraw.spriteType];
        image.width = contentToDraw.width;
        image.height = contentToDraw.height;
    }

}