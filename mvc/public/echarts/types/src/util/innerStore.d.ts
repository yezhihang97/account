import Element from 'zrender/esm/Element';
import { DataModel, ECEventData, BlurScope, InnerFocus, SeriesDataType } from './types';
export interface ECData {
    dataIndex?: number;
    dataModel?: DataModel;
    eventData?: ECEventData;
    seriesIndex?: number;
    dataType?: SeriesDataType;
    focus?: InnerFocus;
    blurScope?: BlurScope;
}
export declare const getECData: (hostObj: Element<import("zrender/esm/Element").ElementProps>) => ECData;
