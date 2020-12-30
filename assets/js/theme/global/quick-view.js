import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';
import { defaultModal, modalTypes } from './modal';
import 'slick-carousel';

export default function (context) {
    const modal = defaultModal();

    $('body').on('click', '.quickview', event => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('productId');

        modal.open({ size: 'large' });


        // { template: 'products/debug' }
        utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {

            modal.updateContent(response);

            modal.$content.find('.productView').addClass('productView--quickView');

            modal.$content.find('[data-slick]').slick();

            modal.setupFocusableElements(modalTypes.QUICK_VIEW);

            const productImages = modal.$content.find('#productImages').val();
            const productOptions = modal.$content.find('#productOptions').val();

            context.productImages = JSON.parse(productImages);
            context.productOptions = JSON.parse(productOptions);

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
    });
}
