import * as graphic from '../../util/graphic';
import { PathProps } from 'zrender/esm/graphic/Path';
declare class StraightLineShape {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    percent: number;
}
declare class CurveShape extends StraightLineShape {
    cpx1: number;
    cpy1: number;
}
interface ECLineProps extends PathProps {
    shape?: Partial<StraightLineShape | CurveShape>;
}
declare class ECLinePath extends graphic.Path<ECLineProps> {
    type: string;
    shape: StraightLineShape | CurveShape;
    constructor(opts?: ECLineProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): StraightLineShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: StraightLineShape | CurveShape): void;
    pointAt(t: number): number[];
    tangentAt(t: number): number[];
}
export default ECLinePath;
