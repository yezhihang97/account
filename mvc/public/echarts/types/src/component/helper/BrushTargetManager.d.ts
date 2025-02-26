import * as graphic from '../../util/graphic';
import { BrushPanelConfig, BrushControllerEvents, BrushType, BrushAreaRange, BrushDimensionMinMax } from './BrushController';
import ExtensionAPI from '../../ExtensionAPI';
import GridModel from '../../coord/cartesian/GridModel';
import GeoModel from '../../coord/geo/GeoModel';
import { CoordinateSystemMaster } from '../../coord/CoordinateSystem';
import Cartesian2D from '../../coord/cartesian/Cartesian2D';
import Geo from '../../coord/geo/Geo';
import GlobalModel from '../../model/Global';
import { BrushAreaParam, BrushAreaParamInternal } from '../brush/BrushModel';
import SeriesModel from '../../model/Series';
import { ModelFinderObject } from '../../util/model';
declare type COORD_CONVERTS_INDEX = 0 | 1;
declare type BrushableCoordinateSystem = Cartesian2D | Geo;
declare type BrushTargetBuilderKey = 'grid' | 'geo';
interface BrushTargetInfo {
    panelId: string;
    coordSysModel: CoordinateSystemMaster['model'];
    coordSys: BrushableCoordinateSystem;
    coordSyses: BrushableCoordinateSystem[];
    getPanelRect: GetPanelRect;
}
export interface BrushTargetInfoCartesian2D extends BrushTargetInfo {
    gridModel: GridModel;
    coordSys: Cartesian2D;
    coordSyses: Cartesian2D[];
    xAxisDeclared: boolean;
    yAxisDeclared: boolean;
}
export interface BrushTargetInfoGeo extends BrushTargetInfo {
    geoModel: GeoModel;
    coordSysModel: GeoModel;
    coordSys: Geo;
    coordSyses: Geo[];
}
declare type GetPanelRect = () => graphic.BoundingRect;
declare class BrushTargetManager {
    private _targetInfoList;
    constructor(finder: ModelFinderObject, ecModel: GlobalModel, opt?: {
        include?: BrushTargetBuilderKey[];
    });
    setOutputRanges(areas: BrushControllerEvents['brush']['areas'], ecModel: GlobalModel): BrushAreaParam[];
    matchOutputRanges<T extends (Parameters<BrushTargetManager['findTargetInfo']>[0] & {
        brushType: BrushType;
        range: BrushAreaRange;
    })>(areas: T[], ecModel: GlobalModel, cb: (area: T, coordRange: ReturnType<ConvertCoord>['values'], coordSys: BrushableCoordinateSystem, ecModel: GlobalModel) => void): void;
    setInputRanges(areas: BrushAreaParamInternal[], ecModel: GlobalModel): void;
    makePanelOpts(api: ExtensionAPI, getDefaultBrushType?: (targetInfo: BrushTargetInfo) => BrushType): BrushPanelConfig[];
    controlSeries(area: BrushAreaParamInternal, seriesModel: SeriesModel, ecModel: GlobalModel): boolean;
    findTargetInfo(area: ModelFinderObject & {
        panelId?: string;
    }, ecModel: GlobalModel): BrushTargetInfo | true;
}
declare type ConvertCoord = (to: COORD_CONVERTS_INDEX, coordSys: BrushableCoordinateSystem, rangeOrCoordRange: BrushAreaRange) => {
    values: BrushAreaRange;
    xyMinMax: BrushDimensionMinMax[];
};
export default BrushTargetManager;
