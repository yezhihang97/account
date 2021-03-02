import * as graphic from '../../util/graphic';
import IncrementalDisplayable from 'zrender/esm/graphic/IncrementalDisplayable';
import { PathProps } from 'zrender/esm/graphic/Path';
import List from '../../data/List';
import { StageHandlerProgressParams, LineStyleOption } from '../../util/types';
import Model from '../../model/Model';
declare class LargeLinesPathShape {
    polyline: boolean;
    curveness: number;
    segs: ArrayLike<number>;
}
interface LargeLinesPathProps extends PathProps {
    shape?: Partial<LargeLinesPathShape>;
}
interface LargeLinesCommonOption {
    polyline?: boolean;
    lineStyle?: LineStyleOption & {
        curveness?: number;
    };
}
declare type LargeLinesData = List<Model<LargeLinesCommonOption> & {
    seriesIndex?: number;
}>;
declare class LargeLinesPath extends graphic.Path {
    shape: LargeLinesPathShape;
    __startIndex: number;
    constructor(opts?: LargeLinesPathProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): LargeLinesPathShape;
    buildPath(ctx: CanvasRenderingContext2D, shape: LargeLinesPathShape): void;
    findDataIndex(x: number, y: number): number;
}
declare class LargeLineDraw {
    group: graphic.Group;
    _incremental?: IncrementalDisplayable;
    isPersistent(): boolean;
    updateData(data: LargeLinesData): void;
    incrementalPrepareUpdate(data: LargeLinesData): void;
    incrementalUpdate(taskParams: StageHandlerProgressParams, data: LargeLinesData): void;
    remove(): void;
    _setCommon(lineEl: LargeLinesPath, data: LargeLinesData, isIncremental?: boolean): void;
    _clearIncremental(): void;
}
export default LargeLineDraw;
