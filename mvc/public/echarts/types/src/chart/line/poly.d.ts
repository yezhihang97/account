import Path, { PathProps } from 'zrender/esm/graphic/Path';
import PathProxy from 'zrender/esm/core/PathProxy';
declare class ECPolylineShape {
    points: ArrayLike<number>;
    smooth: number;
    smoothConstraint: boolean;
    smoothMonotone: 'x' | 'y' | 'none';
    connectNulls: boolean;
}
interface ECPolylineProps extends PathProps {
    shape?: Partial<ECPolylineShape>;
}
export declare class ECPolyline extends Path<ECPolylineProps> {
    readonly type = "ec-polyline";
    shape: ECPolylineShape;
    constructor(opts?: ECPolylineProps);
    getDefaultStyle(): {
        stroke: string;
        fill: string;
    };
    getDefaultShape(): ECPolylineShape;
    buildPath(ctx: PathProxy, shape: ECPolylineShape): void;
    getPointOn(xOrY: number, dim: 'x' | 'y'): number[];
}
declare class ECPolygonShape extends ECPolylineShape {
    stackedOnPoints: ArrayLike<number>;
    stackedOnSmooth: number;
}
interface ECPolygonProps extends PathProps {
    shape?: Partial<ECPolygonShape>;
}
export declare class ECPolygon extends Path {
    readonly type = "ec-polygon";
    shape: ECPolygonShape;
    constructor(opts?: ECPolygonProps);
    getDefaultShape(): ECPolygonShape;
    buildPath(ctx: PathProxy, shape: ECPolygonShape): void;
}
export {};
