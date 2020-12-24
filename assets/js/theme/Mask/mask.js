import quickSearch from './quick-search';
import bannerManager from './bannerManager';
import collapsible from './collapsible';
import setOptionLabel from './setOptionsLabel';
import optionModal from './optionModal';
import productImgSwitch from './productImgSwitch';

export default function (context) {
    quickSearch();
    bannerManager();
    collapsible();
    setOptionLabel();
    optionModal();
    productImgSwitch(context);
}
