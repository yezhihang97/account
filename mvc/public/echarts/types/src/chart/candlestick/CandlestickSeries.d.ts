import SeriesModel from '../../model/Series';
import { SeriesOption, SeriesOnCartesianOptionMixin, LayoutOrient, ItemStyleOption, ZRColor, ColorString, SeriesLabelOption, SeriesLargeOptionMixin, OptionDataValueNumeric, StatesOptionMixin, DefaultExtraEmpasisState, SeriesEncodeOptionMixin } from '../../util/types';
import List from '../../data/List';
import Cartesian2D from '../../coord/cartesian/Cartesian2D';
import { BrushCommonSelectorsForSeries } from '../../component/brush/selector';
declare type CandlestickDataValue = OptionDataValueNumeric[];
interface CandlestickItemStyleOption extends ItemStyleOption {
    color0?: ZRColor;
    borderColor0?: ColorString;
}
export interface CandlestickStateOption {
    itemStyle?: CandlestickItemStyleOption;
    label?: SeriesLabelOption;
}
export interface CandlestickDataItemOption extends CandlestickStateOption, StatesOptionMixin<CandlestickStateOption, ExtraStateOption> {
    value: CandlestickDataValue;
}
interface ExtraStateOption {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
export interface CandlestickSeriesOption extends SeriesOption<CandlestickStateOption, ExtraStateOption>, CandlestickStateOption, SeriesOnCartesianOptionMixin, SeriesLargeOptionMixin, SeriesEncodeOptionMixin {
    type?: 'candlestick';
    coordinateSystem?: 'cartesian2d';
    layout?: LayoutOrient;
    clip?: boolean;
    barMaxWidth?: number | string;
    barMinWidth?: number | string;
    barWidth?: number | string;
    data?: (CandlestickDataValue | CandlestickDataItemOption)[];
}
declare class CandlestickSeriesModel extends SeriesModel<CandlestickSeriesOption> {
    static readonly type = "series.candlestick";
    readonly type = "series.candlestick";
    static readonly dependencies: string[];
    coordinateSystem: Cartesian2D;
    dimensions: string[];
    defaultValueDimensions: {
        name: string;
        defaultTooltip: boolean;
    }[];
    static defaultOption: CandlestickSeriesOption;
    getShadowDim(): string;
    brushSelector(dataIndex: number, data: List, selectors: BrushCommonSelectorsForSeries): boolean;
}
export default CandlestickSeriesModel;
