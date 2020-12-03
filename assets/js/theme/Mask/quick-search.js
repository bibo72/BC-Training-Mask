export default function () {
    const $buttonShutQuicksearch = $('[data-shut-quicksearch]');

    $('body').on('click', '[data-shut-quicksearch]', e => {
        e.stopPropagation();
        const $currentTarget = $(e.currentTarget);
        const check = $currentTarget.hasClass('dropdown_button__close');
        if (!check) {
            return
        }
    }).on('keyup', '[data-search-quick]', e => {
        e.stopPropagation();
        const $currentTarget = $(e.currentTarget);
        const check = $currentTarget.hasClass('form-input');
        if (!check) {
            return
        }

        const val = $currentTarget.val();
        if (val === '') {
            $('.quickSearchResults').html('');
        }
    });
}
