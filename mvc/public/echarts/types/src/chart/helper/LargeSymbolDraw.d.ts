import * as graphic from '../../util/graphic';
import { createSymbol } from '../../util/symbol';
import IncrementalDisplayable from 'zrender/esm/graphic/IncrementalDisplayable';
import List from '../../data/List';
import { PathProps } from 'zrender/esm/graphic/Path';
import PathProxy from 'zrender/esm/core/PathProxy';
import { StageHandlerProgressParams } from '../../util/types';
import { CoordinateSystemClipArea } from '../../coord/CoordinateSystem';
declare class LargeSymbolPathShape {
    points: ArrayLike<number>;
    size: number[];
}
declare type LargeSymbolPathProps = PathProps & {
    shape?: Partial<LargeSymbolPathShape>;
    startIndex?: number;
    endIndex?: number;
};
declare type ECSymbol = ReturnType<typeof createSymbol>;
declare class LargeSymbolPath extends graphic.Path<LargeSymbolPathProps> {
    shape: LargeSymbolPathShape;
    symbolProxy: ECSymbol;
    softClipShape: CoordinateSystemClipArea;
    startIndex: number;
    endIndex: number;
    private _ctx;
    constructor(opts?: LargeSymbolPathProps);
    getDefaultShape(): LargeSymbolPathShape;
    setColor: ECSymbol['setColor'];
    buildPath(path: PathProxy | CanvasRenderingContext2D, shape: LargeSymbolPathShape): void;
    afterBrush(): void;
    findDataIndex(x: number, y: number): number;
}
interface UpdateOpt {
    clipShape?: CoordinateSystemClipArea;
}
declare class LargeSymbolDraw {
    group: graphic.Group;
    _incremental: IncrementalDisplayable;
    isPersistent(): boolean;
    updateData(data: List, opt?: UpdateOpt): void;
    updateLayout(data: List): void;
    incrementalPrepareUpdate(data: List): void;
    incrementalUpdate(taskParams: StageHandlerProgressParams, data: List, opt: UpdateOpt): void;
    _setCommon(symbolEl: LargeSymbolPath, data: List, isIncremental: boolean, opt: UpdateOpt): void;
    remove(): void;
    _clearIncremental(): void;
}
export default LargeSymbolDraw;
