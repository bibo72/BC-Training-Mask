export default function () {
    const $navUserContainer = $('.header .navUser_container');
    const $navPagesContainer = $('.header .navPages-container');
    const navUserContainerWidth = $navUserContainer.width();
    const navPagesContainerWidth = $navPagesContainer.width();

    // https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
    // In summary, we recommend looking for the string 'Mobi' anywhere in the User Agent to detect a mobile device.
    if (/Mobi/i.test(navigator.userAgent)) {
        return 
    }

    if (navUserContainerWidth > navPagesContainerWidth) {
        $navUserContainer.width(Math.ceil(navUserContainerWidth));
        $navPagesContainer.width(Math.ceil(navUserContainerWidth));
    } else if (navUserContainerWidth < navPagesContainerWidth) {
        $navUserContainer.width(Math.ceil(navPagesContainerWidth));
        $navPagesContainer.width(Math.ceil(navPagesContainerWidth));
    }
}