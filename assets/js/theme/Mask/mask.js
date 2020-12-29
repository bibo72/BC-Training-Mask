import quickSearch from './quick-search';
import bannerManager from './bannerManager';
import collapsible from './collapsible';
import optionModal from './optionModal';
import productImgSwitch from './productImgSwitch';

export default function (context, from) {
    if (from === 'GLOBAL') {
        quickSearch();
        bannerManager();
        optionModal();
    } else if (from === 'PRODUCTDETAILS') {
        collapsible();
        productImgSwitch(context);
    }
}
