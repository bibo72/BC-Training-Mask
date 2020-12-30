export default function (context) {
    const injectedProductImages = context.productImages;
    const injectedProductOptions = context.productOptions;
    const themeSettingsProductviewThumbSize = context.productThumbSize;
    const $productImageSection = $('[data-product-image-section]');

    if (injectedProductOptions) {
        const colorOptions = injectedProductOptions.find(option => option.display_name.toLowerCase() === 'color' && option.partial.toLowerCase() === 'swatch');
        if (colorOptions) {
            const selectedColorOption = colorOptions.values.find(colorOption => colorOption.selected === true);
            if (selectedColorOption) {
                const selectedColorOptionName = selectedColorOption.label;

                if (injectedProductImages) {
                    fnSwitchProductImage(injectedProductImages, themeSettingsProductviewThumbSize, $productImageSection, selectedColorOptionName);
        
                    /* $('body').on('click', '[data-product-attribute="swatch"] .form-option', e => {
                        e.stopPropagation();
        
                        const $currentTarget = $(e.currentTarget);
        
                        const triggeredOptionName = $currentTarget.data('getOptionLabel');
        
                        fnSwitchProductImage(injectedProductImages, themeSettingsProductviewThumbSize, $productImageSection, triggeredOptionName);
                    }); */
        
                    $('.productView form[data-cart-item-add] [data-product-option-change]').on('change', e => {
                        const $target = $(e.target);
        
                        const triggeredOptionName = $target.attr('aria-label');

                        if (triggeredOptionName) {
                            fnSwitchProductImage(injectedProductImages, themeSettingsProductviewThumbSize, $productImageSection, triggeredOptionName);
                        }
                    });
                }
            }
        }
    }
}

function fnSwitchProductImage(injectedProductImages, themeSettingsProductviewThumbSize, $productImageSection, selectedColorOptionName) {
    $('.productView [data-set-option-label]').text(selectedColorOptionName);

    let imagesOnSelectedOption = [];
    injectedProductImages.forEach(imageObject => {
        const imageAlt = imageObject.alt;
        const optionNameOnImageAlt = (imageAlt.split('(')[1]).split(')')[0];
        if (optionNameOnImageAlt.toLowerCase() === selectedColorOptionName.toLowerCase()) {
            imagesOnSelectedOption.push(imageObject);
        }
    });

    const $productImageLi = $productImageSection.find('[data-product-image-li]');

    if ($productImageLi.length > imagesOnSelectedOption.length) {
        imagesOnSelectedOption.forEach((image, index) => {
            const sizedImage = image.data.replace('{:size}', `${themeSettingsProductviewThumbSize}`);
            $productImageLi.eq(index).find('img').attr({'src': sizedImage, 'alt': image.alt, 'title': image.alt}).removeAttr('srcset data-srcset');
        });

        $productImageLi.each((index, li) => {
            if (index >= imagesOnSelectedOption.length) {
                $(li).remove();
            }
        });
    } else if ($productImageLi.length < imagesOnSelectedOption.length) {
        imagesOnSelectedOption.forEach((image, index) => {
            if (index < $productImageLi.length) {
                const sizedImage = image.data.replace('{:size}', `${themeSettingsProductviewThumbSize}`);
                $productImageLi.eq(index).find('img').attr({'src': sizedImage, 'alt': image.alt, 'title': image.alt}).removeAttr('srcset data-srcset');
            } else {
                const sizedImage = image.data.replace('{:size}', `${themeSettingsProductviewThumbSize}`);
                const html = `
                <li class="product_image" data-product-image-li>
                    <div class="product_image_container">
                        <img src="${sizedImage}" alt="${image.alt}" title="${image.alt}" data-sizes="auto" class="lazyautosizes ls-is-cached lazyloaded" sizes="408px">
                    </div>
                </li>
                `;
                $productImageSection.find('ul').append(html);
            }
        });
    } else {
        imagesOnSelectedOption.forEach((image, index) => {
            const sizedImage = image.data.replace('{:size}', `${themeSettingsProductviewThumbSize}`);
            $productImageLi.eq(index).find('img').attr({'src': sizedImage, 'alt': image.alt, 'title': image.alt}).removeAttr('srcset data-srcset');
        });
    }
}