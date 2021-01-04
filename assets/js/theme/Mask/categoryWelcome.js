import utils from '@bigcommerce/stencil-utils';

function getProductData(productId, $categoryWelcomeLayer) {
    utils.api.product.getById(productId, { template: 'products/debug' }, (err, response) => {
        console.log(JSON.parse(response));
        const parsedResponse = JSON.parse(response);

        dealRequiredOptions(parsedResponse, $categoryWelcomeLayer);
    })
}

function dealRequiredOptions(parsedResponse, $categoryWelcomeLayer) {
    const productId = parsedResponse.id;
    const options = parsedResponse.options;
    // color option
    const colorOption = options.filter(option => option.display_name.toLowerCase() === 'color');
    console.log(colorOption);
    const colorOptionId = colorOption.id;
    const colorOptionValueId = colorOption.values[0].id; // get the first/default main image
    // other required options
    const requiredOptions = options.filter(option => option.required === true && option.display_name.toLowerCase() !== 'color');
    let html = '';
    requiredOptions.forEach(requiredOption => {
        const requiredOptionValues = requiredOption.values;
        const selectedValue = requiredOptionValues.find(requiredOptionValue => requiredOptionValue.selected === true);
        if (selectedValue) {
            html += `
                <input type="hidden" name="attribute[${requiredOption.id}]" value="${selectedValue.id}" />
            `;
        } else {
            html += `
                <input type="hidden" name="attribute[${requiredOption.id}]" value="${requiredOptionValues[0].id}" />
            `;
        }
    });
    $categoryWelcomeLayer.find(`#form${productId}`).html(html);

    getMainImageByAttrs(colorOptionId, colorOptionValueId);
}

function getMainImageByAttrs(colorOptionId, colorOptionValueId) {
    
}

function getProductHtml(productId, $categoryWelcomeLayer) {
    utils.api.product.getById(productId, { template: 'products/page-builder-product-card' }, (err, response) => {
        // console.log(response);
        $categoryWelcomeLayer.append(response);
    })
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
                getProductHtml(productId, $categoryWelcomeLayer);
                
                getProductData(productId, $categoryWelcomeLayer);
            }
        });
    }

    // local test
    const productId = 112;
    
    if (productId) {
        getProductHtml(productId, $categoryWelcomeLayer);
        
        getProductData(productId, $categoryWelcomeLayer);
    }
}
