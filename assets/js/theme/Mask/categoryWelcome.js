import utils from '@bigcommerce/stencil-utils';

function getProductData(productId) {
    utils.api.product.getById(productId, { template: 'products/debug' }, (err, response) => {
        // console.log(response);
        console.log(JSON.parse(response));
        const parsedResponse = JSON.parse(response);
        buildCard(parsedResponse);
    })
}

function buildCard(data) {
    const productTitle = data.title;
    const productPrice = data.price;
    const productUrl = data.url;
    const productOptions = data.options;
    const colorOption = productOptions.find(productOption => productOption.display_name.toLowerCase() === 'color');
    if (colorOption) {
        // get card thumbnails
        let productThumbnailHtml = '';
        colorOption.values.forEach(option => {
            const sizedOptionImage = option.image.data.replace('{:size}', '443x443');
            productThumbnailHtml += `
                <button type="button" class="product_thumbnail_button ${option.selected ? 'now' : ''}">
                    <img src="${sizedOptionImage}" alt="${option.image.alt}">
                </button>
            `;
        });
        // set card default image and related option label
        let productNowImage = colorOption.values[0].image;
        let productNowOptionLabel = colorOption.values[0].label;
        // check if default selected option
        const selectedOption = colorOption.values.find(option => option.selected === true);
        if (selectedOption) {
            productNowImage = selectedOption.image;
            productNowOptionLabel = selectedOption.label;
        }
        const sizedProductNowImage = productNowImage.data.replace('{:size}', '443x443');

        let productCardHtml = `
            <div class="product_card">
                <div class="product_main_image">
                    <a href="${productUrl}">
                        <img src="${sizedProductNowImage}" alt="${productNowImage.alt}">
                    </a>
                </div>
                <h5 class="product_title">${productTitle}</h5>
                <p class="product_option_label">${productNowOptionLabel}</p>
                <p class="product_price">${productPrice.without_tax.formatted}</p>
                <div class="product_thumbnail_area">
                    <div class="product_thumbnail_viewport">
                        <div class="product_thumbnails">
                        ${productThumbnailHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
        $(`.page_builder_product_card[data-product-id="${data.id}"]`).html(productCardHtml);
    }
}

export default function () {
    const $categoryWelcomeLayer = $('.category_welcome_layer');

    const $productCards = $categoryWelcomeLayer.find('.page_builder_product_card');

    if ($productCards.length) {
        $productCards.each(function (index, card) {
            // element == this
            const $card = $(card);
    
            const productId = $card.data('productId');
    
            if (productId) {
                getProductData(productId);
            }
        });
    }



    utils.api.product.getById('112', { template: 'products/page-builder-product-card' }, (err, response) => {
        console.log(response);
        $categoryWelcomeLayer.append(response);
    })
}
