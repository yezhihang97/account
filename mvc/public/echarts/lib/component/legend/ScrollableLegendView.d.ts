import LegendView from './LegendView';
import { LegendSelectorButtonOption } from './LegendModel';
import ExtensionAPI from '../../ExtensionAPI';
import GlobalModel from '../../model/Global';
import ScrollableLegendModel, { ScrollableLegendOption } from './ScrollableLegendModel';
interface PageInfo {
    contentPosition: number[];
    pageCount: number;
    pageIndex: number;
    pagePrevDataIndex: number;
    pageNextDataIndex: number;
}
declare class ScrollableLegendView extends LegendView {
    static type: "legend.scroll";
    type: "legend.scroll";
    newlineDisabled: boolean;
    private _containerGroup;
    private _controllerGroup;
    private _currentIndex;
    private _showController;
    init(): void;
    resetInner(): void;
    renderInner(itemAlign: ScrollableLegendOption['align'], legendModel: ScrollableLegendModel, ecModel: GlobalModel, api: ExtensionAPI, selector: LegendSelectorButtonOption[], orient: ScrollableLegendOption['orient'], selectorPosition: ScrollableLegendOption['selectorPosition']): void;
    layoutInner(legendModel: ScrollableLegendModel, itemAlign: ScrollableLegendOption['align'], maxSize: {
        width: number;
        height: number;
    }, isFirstRender: boolean, selector: LegendSelectorButtonOption[], selectorPosition: ScrollableLegendOption['selectorPosition']): import("zrender/lib/core/BoundingRect").RectLike;
    _layoutContentAndController(legendModel: ScrollableLegendModel, isFirstRender: boolean, maxSize: {
        width: number;
        height: number;
    }, orientIdx: 0 | 1, wh: 'width' | 'height', hw: 'width' | 'height', yx: 'x' | 'y', xy: 'y' | 'x'): import("zrender/lib/core/BoundingRect").RectLike;
    _pageGo(to: 'pagePrevDataIndex' | 'pageNextDataIndex', legendModel: ScrollableLegendModel, api: ExtensionAPI): void;
    _updatePageInfoView(legendModel: ScrollableLegendModel, pageInfo: PageInfo): void;
    _getPageInfo(legendModel: ScrollableLegendModel): PageInfo;
    _findTargetItemIndex(targetDataIndex: number): number;
}
export default ScrollableLegendView;
