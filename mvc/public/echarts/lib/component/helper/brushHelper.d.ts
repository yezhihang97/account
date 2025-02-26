import { RectLike } from 'zrender/lib/core/BoundingRect';
import ExtensionAPI from '../../ExtensionAPI';
import { ElementEvent } from 'zrender/lib/Element';
import ComponentModel from '../../model/Component';
export declare function makeRectPanelClipPath(rect: RectLike): (localPoints: number[][]) => number[][];
export declare function makeLinearBrushOtherExtent(rect: RectLike, specifiedXYIndex?: 0 | 1): (xyIndex: 0 | 1) => number[];
export declare function makeRectIsTargetByCursor(rect: RectLike, api: ExtensionAPI, targetModel: ComponentModel): (e: ElementEvent, localCursorPoint: number[]) => boolean;
