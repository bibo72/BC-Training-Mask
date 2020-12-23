export default function () {
    $('[data-product-attribute="swatch"]').on('click', '.form-option.form-option-swatch', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        const $delegateTarget = $(e.delegateTarget);

        const getOptionLabel = $currentTarget.data('getOptionLabel');
        if (getOptionLabel) {
            $delegateTarget.find('[data-set-option-label]').text(getOptionLabel);
        }
    });
}