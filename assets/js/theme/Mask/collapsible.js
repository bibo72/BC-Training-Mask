export default function () {
    $('.navPages-action.has-subMenu').on('mouseenter', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        const isOpen = $currentTarget.hasClass('is-open');

        if (isOpen) {
            return
        }

        $currentTarget.addClass('is-open');
        $currentTarget.next('.navPage-subMenu').addClass('is-open');

        $('.global_background').show();

        const item = $currentTarget.closest(".navPages-item");
        item.siblings('.navPages-item').find('.navPages-action.has-subMenu, .navPage-subMenu').removeClass('is-open');
    });

    $('.navPages-container').on('mouseleave', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        $currentTarget.find('.navPages-action.has-subMenu, .navPage-subMenu').removeClass('is-open');

        $('.global_background').hide();
    });
}