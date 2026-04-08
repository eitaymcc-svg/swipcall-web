/**
 * CookieConsent v3 - GDPR compliant with Google Consent Mode v2
 * https://cookieconsent.orestbida.com/
 */
CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: 'box wide',
            position: 'bottom left',
            equalWeightButtons: false,
            flipButtons: false
        },
        preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false
        }
    },

    categories: {
        necessary: {
            enabled: true,
            readOnly: true
        },
        analytics: {
            enabled: false,
            readOnly: false,
            autoClear: {
                cookies: [
                    { name: /^_ga/ },
                    { name: '_gid' }
                ]
            }
        }
    },

    onFirstConsent: function() {
        updateGtagConsent();
    },

    onConsent: function() {
        updateGtagConsent();
    },

    onChange: function() {
        updateGtagConsent();
    },

    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'This website uses cookies',
                    description: 'We use essential cookies to make this site work. With your permission, we also use analytics cookies to understand how you interact with the site so we can improve it. You can change your preferences at any time.',
                    acceptAllBtn: 'Accept',
                    showPreferencesBtn: 'Manage preferences',
                    footer: '<a href="/privacy/">Privacy Policy</a><a href="/terms/">Terms of Service</a>'
                },
                preferencesModal: {
                    title: 'Cookie preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject non-essential',
                    savePreferencesBtn: 'Save preferences',
                    closeIconLabel: 'Close',
                    sections: [
                        {
                            title: 'Your privacy choices',
                            description: 'Choose which cookies you allow. Essential cookies are required and cannot be disabled. You can change your choices at any time from the "Cookie Settings" link in the footer.'
                        },
                        {
                            title: 'Essential cookies',
                            description: 'Required for the website to function. These include:<ul><li><strong>Consent preferences</strong> - Remembers your cookie choices (expires after 182 days).</li><li><strong>Accessibility settings</strong> - Saves your display preferences such as font size and contrast (localStorage, device only).</li></ul>These do not collect personal data and cannot be disabled.',
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Analytics cookies',
                            description: 'Help us understand how visitors use this website by collecting anonymous, aggregated data. This allows us to improve the site experience. We use Google Analytics with IP anonymization enabled.<ul><li><strong>_ga</strong> - Distinguishes unique visitors (expires after 2 years).</li><li><strong>_gid</strong> - Distinguishes unique visitors (expires after 24 hours).</li></ul><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a>',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'More information',
                            description: 'For questions about cookies or privacy, read our <a href="/privacy/">Privacy Policy</a> or <a href="mailto:eitaymcc@gmail.com">contact us</a>.'
                        }
                    ]
                }
            }
        }
    }
});

function updateGtagConsent() {
    var analyticsAccepted = CookieConsent.acceptedCategory('analytics');
    gtag('consent', 'update', {
        analytics_storage: analyticsAccepted ? 'granted' : 'denied'
    });
}
