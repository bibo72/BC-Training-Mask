import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';

function getProductData(productId, $categoryWelcomeLayer) {
    utils.api.product.getById(productId, { template: 'products/debug' }, (err, response) => {
        if (err) {
            console.log(err);
            return
        }

        if (response) {
            const parsedResponse = JSON.parse(response);
    
            dealRequiredOptions(parsedResponse, $categoryWelcomeLayer);
        }
    })
}

function dealRequiredOptions(parsedResponse, $categoryWelcomeLayer) {
    const productId = parsedResponse.id;
    const options = parsedResponse.options;
    let html = '';
    // color option
    const colorOption = options.find(option => option.display_name.toLowerCase() === 'color');
    const colorOptionId = colorOption.id;
    const colorOptionValueId = colorOption.values[0].id; // get the first/default main image
    html += `<input type="hidden" name="attribute[${colorOptionId}]" value="${colorOptionValueId}" data-color-attr-val />`;
    initThumbnailCarousel(colorOption, productId);

    // set option value label
    const colorOptionValueLabel = colorOption.values[0].label;
    $categoryWelcomeLayer.find(`[data-product-id="${productId}"] .product_option_label`).text(colorOptionValueLabel);

    // other required options
    const requiredOptions = options.filter(option => option.required === true && option.display_name.toLowerCase() !== 'color');
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

    // append hidden data which required for retriving main image
    const $form = $categoryWelcomeLayer.find(`#form${productId}`);
    $form.html(html);

    getMainImageByAttrs(productId, $form);
}

function getMainImageByAttrs(productId, $form) {
    utils.api.productAttributes.optionChange(productId, $form.serialize(), 'products/bulk-discount-rates', (err, response) => {
        if (err) {
            console.log(err);
            return
        }

        if (response) {
            const data = response.data;
            const image = data.image;
            if (_.isPlainObject(image)) {
                const mainImageUrl = utils.tools.imageSrcset.getSrcset(
                    image.data,
                    { '1x': '450x450' },
                    /*
                        Should match fallback image size used for the main product image in
                        components/products/product-view.html
    
                        Note that this will only be used as a fallback image for browsers that do not support srcset
    
                        Also note that getSrcset returns a simple src string when exactly one size is provided
                    */
                );
                $(`[data-product-id="${productId}"]`).find('.product_main_image a').html(`<img src="${mainImageUrl}" alt="${image.alt}" />`);
            }

            const price = data.price;
            if (price) {
                $(`[data-product-id="${productId}"]`).find('.product_price').html(price.without_tax.formatted);
            }
        }
    });
}

function getProductHtml(productId, $categoryWelcomeLayer) {
    utils.api.product.getById(productId, { template: 'products/page-builder-product-card' }, (err, response) => {
        if (err) {
            console.log(err);
            return
        }

        if (response) {
            // local test
            // $categoryWelcomeLayer.append(response);

            $(`.page_builder_product_card[data-product-id="${productId}"]`, $categoryWelcomeLayer).html(response);
        }
    })
}

function initThumbnailCarousel(option, productId) {
    const values = option.values;
    const $thisCard = $(`.product_card[data-product-id="${productId}"]`);
    const $thumbnail = $('[data-thumbnail]', $thisCard);
    const $prev = $('[data-prev]', $thisCard);
    const $next = $('[data-next]', $thisCard);

    const cardWidth = $thisCard.width();
    // $thumbnail.width(`${parseInt(cardWidth/6-5)}px`).height(`${parseInt(cardWidth/6-5)}px`);
    $thumbnail.width(`${cardWidth/6-5}px`).height(`${cardWidth/6-5}px`);

    // if (values.length) {
    //     if (values.length < 7) {
    //         $next.addClass('disabled');
    //     }
    // }

    // init next button hit count
    window.cardNextCount = 0;
}

function actPrev(event) {
    const $currentTarget = $(event.currentTarget);
    const $thisCard = $currentTarget.closest('.product_card');
    const $next = $('[data-next]', $thisCard);
    const $thumbnails = $('[data-thumbnails]', $thisCard);

    const cardWidth = $thisCard.width();
    // const unit = parseInt(cardWidth / 6);
    const unit = cardWidth / 6;
    const nowLeft = $thumbnails.css('left');
    const disabledNext = $next.hasClass('disabled');

    // help calc next button hit limit
    if (window.cardNextCount && window.cardNextCount > 0) {
        window.cardNextCount -= 1
    }

    if (disabledNext) {
        $thumbnails.css('left', `${parseInt(nowLeft) + (unit*5 - 5)}px`);
        $next.removeClass('disabled');
    } else {
        $thumbnails.css('left', `${parseInt(nowLeft) + (unit*4 - 5)}px`);
    }

    if (-unit < nowLeft < unit) {
        $thumbnails.css('left', 0);
        $currentTarget.addClass('disabled');
        return
    }
}

function actNext(event) {
    const $currentTarget = $(event.currentTarget);
    const $thisCard = $currentTarget.closest('.product_card');
    const $prev = $('[data-prev]', $thisCard);
    const $thumbnails = $('[data-thumbnails]', $thisCard);

    const cardWidth = $thisCard.width();
    // const unit = parseInt(cardWidth / 6);
    const unit = cardWidth / 6;
    const nowLeft = $thumbnails.css('left');
    const disabledPrev = $prev.hasClass('disabled');
    const thumbnailLength = $thumbnails.data('length');

    // calc next button hit count
    window.cardNextCount += 1;

    if (disabledPrev) {
        $thumbnails.css('left', `${parseInt(nowLeft) - unit*5 - 5}px`);
        $prev.removeClass('disabled');
    } else {
        $thumbnails.css('left', `${parseInt(nowLeft) - unit*4 - 5}px`);
    }

    const shouldDisableNext = calcNextLimit(thumbnailLength);
    if (shouldDisableNext) {
        $currentTarget.addClass('disabled');
        return
    }
}

function calcNextLimit(length) {
    if (length > 6) {
        const rest = length - 5 - window.cardNextCount * 4;
        if (rest < 2) {
            return true
        } else {
            return false
        }
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
                getProductHtml(productId, $categoryWelcomeLayer);
                
                getProductData(productId, $categoryWelcomeLayer);
            }
        });
    }

    // local test
    // const productId = 112;
    
    // if (productId) {
    //     getProductHtml(productId, $categoryWelcomeLayer);
        
    //     getProductData(productId, $categoryWelcomeLayer);
    // }

    // const productIdAnother = 113;
    
    // if (productIdAnother) {
    //     getProductHtml(productIdAnother, $categoryWelcomeLayer);
        
    //     getProductData(productIdAnother, $categoryWelcomeLayer);
    // }

    // event
    $('body').on('click', `.product_card .product_thumbnail_button[data-thumbnail]`, event => {
        event.stopPropagation();

        const $currentTarget = $(event.currentTarget);

        // update view
        $currentTarget.siblings('.product_thumbnail_button').removeClass('now');
        $currentTarget.addClass('now');

        // store now option id and its value id
        const optionId = $currentTarget.data('optionId');
        const optionValueId = $currentTarget.data('optionValueId');
        const optionValueLabel = $currentTarget.data('optionValueLabel');

        const $currentCard = $currentTarget.closest('.product_card');

        $currentCard.find('form input[data-color-attr-val]').attr({name: `attribute[${optionId}]`, value: optionValueId});
        $currentCard.find('.product_option_label').text(optionValueLabel);

        const productId = $currentCard.data('productId');

        const $form = $currentCard.find('form');

        getMainImageByAttrs(productId, $form);
    }).on('click', '.product_card .prev', event => {
        event.stopPropagation();

        actPrev(event);
    }).on('click', '.product_card .next', event => {
        event.stopPropagation();

        actNext(event);
    });
}
