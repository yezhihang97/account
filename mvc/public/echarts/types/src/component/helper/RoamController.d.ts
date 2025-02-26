import Eventful from 'zrender/esm/core/Eventful';
import { ZRenderType } from 'zrender/esm/zrender';
import { ZRElementEvent, RoamOptionMixin } from '../../util/types';
import { Bind3 } from 'zrender/esm/core/util';
import Group from 'zrender/esm/graphic/Group';
export declare type RoamType = RoamOptionMixin['roam'];
interface RoamOption {
    zoomOnMouseWheel?: boolean | 'ctrl' | 'shift' | 'alt';
    moveOnMouseMove?: boolean | 'ctrl' | 'shift' | 'alt';
    moveOnMouseWheel?: boolean | 'ctrl' | 'shift' | 'alt';
    preventDefaultMouseMove?: boolean;
}
declare type RoamBehavior = 'zoomOnMouseWheel' | 'moveOnMouseMove' | 'moveOnMouseWheel';
export declare type RoamEventParams = {
    'zoom': {
        scale: number;
        originX: number;
        originY: number;
        isAvailableBehavior: Bind3<typeof isAvailableBehavior, null, RoamBehavior, ZRElementEvent>;
    };
    'scrollMove': {
        scrollDelta: number;
        originX: number;
        originY: number;
        isAvailableBehavior: Bind3<typeof isAvailableBehavior, null, RoamBehavior, ZRElementEvent>;
    };
    'pan': {
        dx: number;
        dy: number;
        oldX: number;
        oldY: number;
        newX: number;
        newY: number;
        isAvailableBehavior: Bind3<typeof isAvailableBehavior, null, RoamBehavior, ZRElementEvent>;
    };
};
export interface RoamControllerHost {
    target: Group;
    zoom: number;
    zoomLimit: {
        min?: number;
        max?: number;
    };
}
declare class RoamController extends Eventful<RoamEventParams> {
    pointerChecker: (e: ZRElementEvent, x: number, y: number) => boolean;
    private _zr;
    private _opt;
    private _dragging;
    private _pinching;
    private _x;
    private _y;
    readonly enable: (this: this, controlType?: RoamType, opt?: RoamOption) => void;
    readonly disable: () => void;
    constructor(zr: ZRenderType);
    isDragging(): boolean;
    isPinching(): boolean;
    setPointerChecker(pointerChecker: RoamController['pointerChecker']): void;
    dispose(): void;
    private _mousedownHandler;
    private _mousemoveHandler;
    private _mouseupHandler;
    private _mousewheelHandler;
    private _pinchHandler;
}
declare function isAvailableBehavior(behaviorToCheck: RoamBehavior, e: ZRElementEvent, settings: Pick<RoamOption, RoamBehavior>): boolean;
export default RoamController;
