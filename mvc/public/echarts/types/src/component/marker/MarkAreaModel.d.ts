import MarkerModel, { MarkerOption, MarkerStatisticType, MarkerPositionOption } from './MarkerModel';
import { SeriesLabelOption, ItemStyleOption, StatesOptionMixin } from '../../util/types';
import GlobalModel from '../../model/Global';
interface MarkAreaStateOption {
    itemStyle?: ItemStyleOption;
    label?: SeriesLabelOption;
}
interface MarkAreaDataItemOptionBase extends MarkAreaStateOption, StatesOptionMixin<MarkAreaStateOption> {
    name?: string;
}
export interface MarkArea1DDataItemOption extends MarkAreaDataItemOptionBase {
    xAxis?: number;
    yAxis?: number;
    type?: MarkerStatisticType;
    valueIndex?: number;
    valueDim?: string;
}
interface MarkArea2DDataItemDimOption extends MarkAreaDataItemOptionBase, MarkerPositionOption {
}
export declare type MarkArea2DDataItemOption = [MarkArea2DDataItemDimOption, MarkArea2DDataItemDimOption];
export interface MarkAreaOption extends MarkerOption, MarkAreaStateOption, StatesOptionMixin<MarkAreaStateOption> {
    precision?: number;
    data?: (MarkArea1DDataItemOption | MarkArea2DDataItemOption)[];
}
declare class MarkAreaModel extends MarkerModel<MarkAreaOption> {
    static type: string;
    type: string;
    createMarkerModelFromSeries(markerOpt: MarkAreaOption, masterMarkerModel: MarkAreaModel, ecModel: GlobalModel): MarkAreaModel;
    static defaultOption: MarkAreaOption;
}
export default MarkAreaModel;
