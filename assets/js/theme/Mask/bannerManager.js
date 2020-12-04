export default function () {
    window.bannerLinks = {
        double: [
            'https://www.instagram.com/',
            'https://www.facebook.com/'
        ],
        single: 'https://www.wikipedia.org/'
    }
    const bannerLinks = window.bannerLinks;
    if (bannerLinks) {
        const $doubleLinks = $('.two_banner_within a');
        $doubleLinks.each((index, link) => {
            $(link).attr('href', bannerLinks.double[index]);
        });
        const $singleLink = $('.one_banner_within a');
        $singleLink.attr('href', bannerLinks.single);
    }
}