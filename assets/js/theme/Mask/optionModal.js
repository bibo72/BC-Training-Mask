export default function () {
    $('body').on('click', '[data-product-modal-trigger]', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        $currentTarget.next('.modal_content').toggle();
    }).on('click', '[data-product-modal-close]', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        $currentTarget.closest('.modal_content').hide();
    });
}