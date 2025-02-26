import BaseAxisPointer, { AxisPointerElementOptions } from './BaseAxisPointer';
import { ScaleDataValue, CommonAxisPointerOption } from '../../util/types';
import ExtensionAPI from '../../ExtensionAPI';
import SingleAxisModel from '../../coord/single/AxisModel';
import Model from '../../model/Model';
declare type AxisPointerModel = Model<CommonAxisPointerOption>;
declare class SingleAxisPointer extends BaseAxisPointer {
    makeElOption(elOption: AxisPointerElementOptions, value: ScaleDataValue, axisModel: SingleAxisModel, axisPointerModel: AxisPointerModel, api: ExtensionAPI): void;
    getHandleTransform(value: ScaleDataValue, axisModel: SingleAxisModel, axisPointerModel: AxisPointerModel): {
        x: number;
        y: number;
        rotation: number;
    };
    updateHandleTransform(transform: {
        x: number;
        y: number;
        rotation: number;
    }, delta: number[], axisModel: SingleAxisModel, axisPointerModel: AxisPointerModel): {
        x: number;
        y: number;
        rotation: number;
        cursorPoint: number[];
        tooltipOption: {
            verticalAlign: import("zrender/esm/core/types").TextVerticalAlign;
        };
    };
}
export default SingleAxisPointer;
