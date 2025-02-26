import ComponentModel from '../model/Component';
import { ComponentOption, SeriesEncodeOptionMixin, OptionSourceData, SeriesLayoutBy, OptionSourceHeader } from '../util/types';
import { DataTransformOption, PipedDataTransformOption } from '../data/helper/transform';
import GlobalModel from '../model/Global';
import Model from '../model/Model';
import { SourceManager } from '../data/helper/sourceManager';
export interface DatasetOption extends Pick<ComponentOption, 'type' | 'id' | 'name'>, Pick<SeriesEncodeOptionMixin, 'dimensions'> {
    seriesLayoutBy?: SeriesLayoutBy;
    sourceHeader?: OptionSourceHeader;
    source?: OptionSourceData;
    fromDatasetIndex?: number;
    fromDatasetId?: string;
    transform?: DataTransformOption | PipedDataTransformOption;
    fromTransformResult?: number;
}
export declare class DatasetModel<Opts extends DatasetOption = DatasetOption> extends ComponentModel<Opts> {
    type: string;
    static type: string;
    static defaultOption: DatasetOption;
    private _sourceManager;
    init(option: Opts, parentModel: Model, ecModel: GlobalModel): void;
    mergeOption(newOption: Opts, ecModel: GlobalModel): void;
    optionUpdated(): void;
    getSourceManager(): SourceManager;
}
