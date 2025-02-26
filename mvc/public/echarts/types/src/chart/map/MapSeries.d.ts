import SeriesModel from '../../model/Series';
import { SeriesOption, BoxLayoutOptionMixin, SeriesEncodeOptionMixin, OptionDataItemObject, OptionDataValueNumeric, ParsedValue, SeriesOnGeoOptionMixin, StatesOptionMixin, SeriesLabelOption } from '../../util/types';
import { Dictionary } from 'zrender/esm/core/types';
import GeoModel, { GeoCommonOptionMixin, GeoItemStyleOption } from '../../coord/geo/GeoModel';
import List from '../../data/List';
import Model from '../../model/Model';
import Geo from '../../coord/geo/Geo';
export interface MapStateOption {
    itemStyle?: GeoItemStyleOption;
    label?: SeriesLabelOption;
}
export interface MapDataItemOption extends MapStateOption, StatesOptionMixin<MapStateOption>, OptionDataItemObject<OptionDataValueNumeric> {
    cursor?: string;
}
export declare type MapValueCalculationType = 'sum' | 'average' | 'min' | 'max';
export interface MapSeriesOption extends SeriesOption<MapStateOption>, MapStateOption, GeoCommonOptionMixin, SeriesOnGeoOptionMixin, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
    type?: 'map';
    coordinateSystem?: string;
    silent?: boolean;
    markLine?: any;
    markPoint?: any;
    markArea?: any;
    mapValueCalculation?: MapValueCalculationType;
    showLegendSymbol?: boolean;
    geoCoord?: Dictionary<number[]>;
    data?: OptionDataValueNumeric[] | OptionDataValueNumeric[][] | MapDataItemOption[];
    nameProperty?: string;
}
declare class MapSeries extends SeriesModel<MapSeriesOption> {
    static type: "series.map";
    type: "series.map";
    static dependencies: string[];
    static layoutMode: "box";
    coordinateSystem: Geo;
    originalData: List;
    mainSeries: MapSeries;
    needsDrawMap: boolean;
    seriesGroup: MapSeries[];
    getInitialData(this: MapSeries, option: MapSeriesOption): List;
    getHostGeoModel(): GeoModel;
    getMapType(): string;
    getRawValue(dataIndex: number): ParsedValue;
    getRegionModel(regionName: string): Model<MapDataItemOption>;
    formatTooltip(dataIndex: number, multipleSeries: boolean, dataType: string): import("../../component/tooltip/tooltipMarkup").TooltipMarkupSection;
    getTooltipPosition: (this: MapSeries, dataIndex: number) => number[];
    setZoom(zoom: number): void;
    setCenter(center: number[]): void;
    static defaultOption: MapSeriesOption;
}
export default MapSeries;
