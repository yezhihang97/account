import List from '../../data/List';
import { SeriesOption, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, OptionDataValue, RoamOptionMixin, SeriesLabelOption, ItemStyleOption, LineStyleOption, SymbolOptionMixin, BoxLayoutOptionMixin, Dictionary, SeriesLineLabelOption, StatesOptionMixin, GraphEdgeItemObject, OptionDataValueNumeric, DefaultExtraEmpasisState, CallbackDataParams } from '../../util/types';
import SeriesModel from '../../model/Series';
import Graph from '../../data/Graph';
import GlobalModel from '../../model/Global';
import { VectorArray } from 'zrender/esm/core/vector';
import { ForceLayoutInstance } from './forceLayout';
import { LineDataVisual } from '../../visual/commonVisualTypes';
declare type GraphDataValue = OptionDataValue | OptionDataValue[];
interface GraphEdgeLineStyleOption extends LineStyleOption {
    curveness?: number;
}
export interface GraphNodeStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface ExtraEmphasisState {
    focus?: DefaultExtraEmpasisState['focus'] | 'adjacency';
}
interface ExtraNodeStateOption {
    emphasis?: ExtraEmphasisState;
}
interface ExtraEdgeStateOption {
    emphasis?: ExtraEmphasisState;
}
export interface GraphNodeItemOption extends SymbolOptionMixin, GraphNodeStateOption, GraphNodeStateOption, StatesOptionMixin<GraphNodeStateOption, ExtraNodeStateOption> {
    id?: string;
    name?: string;
    value?: GraphDataValue;
    x?: number;
    y?: number;
    fixed?: boolean;
    category?: number | string;
    draggable?: boolean;
}
export interface GraphEdgeStateOption {
    lineStyle?: GraphEdgeLineStyleOption;
    label?: SeriesLineLabelOption;
}
export interface GraphEdgeItemOption extends GraphEdgeStateOption, StatesOptionMixin<GraphEdgeStateOption, ExtraEdgeStateOption>, GraphEdgeItemObject<OptionDataValueNumeric> {
    value?: number;
    symbol?: string | string[];
    symbolSize?: number | number[];
    ignoreForceLayout?: boolean;
}
export interface GraphCategoryItemOption extends SymbolOptionMixin, GraphNodeStateOption, StatesOptionMixin<GraphNodeStateOption> {
    name?: string;
    value?: OptionDataValue;
}
export interface GraphSeriesOption extends SeriesOption, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SymbolOptionMixin<CallbackDataParams>, RoamOptionMixin, BoxLayoutOptionMixin {
    type?: 'graph';
    coordinateSystem?: string;
    legendHoverLink?: boolean;
    layout?: 'none' | 'force' | 'circular';
    data?: (GraphNodeItemOption | GraphDataValue)[];
    nodes?: (GraphNodeItemOption | GraphDataValue)[];
    edges?: GraphEdgeItemOption[];
    links?: GraphEdgeItemOption[];
    categories?: GraphCategoryItemOption[];
    focusNodeAdjacency?: boolean;
    nodeScaleRatio?: 0.6;
    draggable?: boolean;
    edgeSymbol?: string | string[];
    edgeSymbolSize?: number | number[];
    edgeLabel?: SeriesLineLabelOption;
    label?: SeriesLabelOption;
    itemStyle?: ItemStyleOption;
    lineStyle?: GraphEdgeLineStyleOption;
    emphasis?: {
        focus?: GraphNodeItemOption['emphasis']['focus'];
        scale?: boolean;
        label?: SeriesLabelOption;
        edgeLabel?: SeriesLabelOption;
        itemStyle?: ItemStyleOption;
        lineStyle?: LineStyleOption;
    };
    blur?: {
        label?: SeriesLabelOption;
        edgeLabel?: SeriesLabelOption;
        itemStyle?: ItemStyleOption;
        lineStyle?: LineStyleOption;
    };
    select?: {
        label?: SeriesLabelOption;
        edgeLabel?: SeriesLabelOption;
        itemStyle?: ItemStyleOption;
        lineStyle?: LineStyleOption;
    };
    circular?: {
        rotateLabel?: boolean;
    };
    force?: {
        initLayout?: 'circular' | 'none';
        repulsion?: number | number[];
        gravity?: number;
        friction?: number;
        edgeLength?: number | number[];
        layoutAnimation?: boolean;
    };
}
declare class GraphSeriesModel extends SeriesModel<GraphSeriesOption> {
    static readonly type = "series.graph";
    readonly type = "series.graph";
    private _categoriesData;
    private _categoriesModels;
    preservedPoints?: Dictionary<VectorArray>;
    forceLayout?: ForceLayoutInstance;
    hasSymbolVisual: boolean;
    init(option: GraphSeriesOption): void;
    mergeOption(option: GraphSeriesOption): void;
    mergeDefaultAndTheme(option: GraphSeriesOption): void;
    getInitialData(option: GraphSeriesOption, ecModel: GlobalModel): List;
    getGraph(): Graph;
    getEdgeData(): List<GraphSeriesModel, LineDataVisual>;
    getCategoriesData(): List;
    formatTooltip(dataIndex: number, multipleSeries: boolean, dataType: string): import("../../component/tooltip/tooltipMarkup").TooltipMarkupBlockFragment;
    _updateCategoriesData(): void;
    setZoom(zoom: number): void;
    setCenter(center: number[]): void;
    isAnimationEnabled(): boolean;
    static defaultOption: GraphSeriesOption;
}
export default GraphSeriesModel;
