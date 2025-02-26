import ChartView from '../../view/Chart';
import SunburstPiece from './SunburstPiece';
import SunburstSeriesModel from './SunburstSeries';
import GlobalModel from '../../model/Global';
import ExtensionAPI from '../../ExtensionAPI';
import { TreeNode } from '../../data/Tree';
interface DrawTreeNode extends TreeNode {
    parentNode: DrawTreeNode;
    piece: SunburstPiece;
    children: DrawTreeNode[];
}
declare class SunburstView extends ChartView {
    static readonly type = "sunburst";
    readonly type = "sunburst";
    seriesModel: SunburstSeriesModel;
    api: ExtensionAPI;
    ecModel: GlobalModel;
    virtualPiece: SunburstPiece;
    private _oldChildren;
    render(seriesModel: SunburstSeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: any): void;
    _initEvents(): void;
    _rootToNode(node: DrawTreeNode): void;
    containPoint(point: number[], seriesModel: SunburstSeriesModel): boolean;
}
export default SunburstView;
