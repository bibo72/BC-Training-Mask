export default function () {
    $('body').on('click', '[data-product-modal-trigger]', e => {
        console.log('did');
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        $currentTarget.next('.modal_content').show();
    }).on('click', '[data-product-modal-close]', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        $currentTarget.closest('.modal_content').hide();
    });
}