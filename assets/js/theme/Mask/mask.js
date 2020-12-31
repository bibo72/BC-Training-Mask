import headerFlexHelper from './headerFlexHelper';
import collapsible from './collapsible';
import bannerManager from './bannerManager';
import quickSearch from './quick-search';
import optionModal from './optionModal';
import productImgSwitch from './productImgSwitch';
import categoryWelcome from './categoryWelcome';

export default function (context, from) {
    headerFlexHelper();
    collapsible();
    bannerManager();
    quickSearch();
    optionModal();
    productImgSwitch(context);
    // categoryWelcome();
}
