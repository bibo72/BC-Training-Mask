export default function () {
    // header navPages
    $('.navPages-action.has-subMenu').on('mouseenter', e => {
        e.stopPropagation();

        const isTouchDevice = 'ontouchstart' in window;

        if (isTouchDevice) {
            return
        }

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

        const isTouchDevice = 'ontouchstart' in window;

        if (isTouchDevice) {
            return
        }

        const $currentTarget = $(e.currentTarget);

        $currentTarget.find('.navPages-action.has-subMenu, .navPage-subMenu').removeClass('is-open');

        $('.global_background').hide();
    });

    // PDP accordions
    $('#productAccordion').on('click', '.accordion_title', e => {
        e.stopPropagation();

        const $currentTarget = $(e.currentTarget);

        const $siblingTriggers = $currentTarget.siblings('.accordion_title');

        $siblingTriggers.each((index, siblingTrigger) => {
            const $siblingTrigger = $(siblingTrigger);

            const collapsible = $siblingTrigger.data('collapsibleInstance');

            collapsible.close();
        });
    });
    // open first accordion by default
    const firstCollapsible = $('#productAccordion').find('.accordion_title').first().data('collapsibleInstance');
    if (firstCollapsible) {
        firstCollapsible.open();
    }
}