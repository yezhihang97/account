import SeriesModel from '../../model/Series';
import { WhiskerBoxCommonMixin } from '../helper/whiskerBoxCommon';
import { SeriesOption, SeriesOnCartesianOptionMixin, LayoutOrient, ItemStyleOption, SeriesLabelOption, OptionDataValueNumeric, StatesOptionMixin, DefaultExtraEmpasisState, SeriesEncodeOptionMixin } from '../../util/types';
import type Axis2D from '../../coord/cartesian/Axis2D';
import Cartesian2D from '../../coord/cartesian/Cartesian2D';
declare type BoxplotDataValue = OptionDataValueNumeric[];
export interface BoxplotStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
export interface BoxplotDataItemOption extends BoxplotStateOption, StatesOptionMixin<BoxplotStateOption, ExtraStateOption> {
    value: BoxplotDataValue;
}
interface ExtraStateOption {
    emphasis?: {
        focus?: DefaultExtraEmpasisState['focus'];
        scale?: boolean;
    };
}
export interface BoxplotSeriesOption extends SeriesOption<BoxplotStateOption, ExtraStateOption>, BoxplotStateOption, SeriesOnCartesianOptionMixin, SeriesEncodeOptionMixin {
    type?: 'boxplot';
    coordinateSystem?: 'cartesian2d';
    layout?: LayoutOrient;
    boxWidth?: (string | number)[];
    data?: (BoxplotDataValue | BoxplotDataItemOption)[];
}
declare class BoxplotSeriesModel extends SeriesModel<BoxplotSeriesOption> {
    static readonly type = "series.boxplot";
    readonly type = "series.boxplot";
    static readonly dependencies: string[];
    coordinateSystem: Cartesian2D;
    defaultValueDimensions: {
        name: string;
        defaultTooltip: boolean;
    }[];
    dimensions: string[];
    visualDrawType: "stroke";
    static defaultOption: BoxplotSeriesOption;
}
interface BoxplotSeriesModel extends WhiskerBoxCommonMixin<BoxplotSeriesOption> {
    getBaseAxis(): Axis2D;
}
export default BoxplotSeriesModel;
