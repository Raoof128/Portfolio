/** The welcome screen is presentation state, not an authentication boundary. */
export const WELCOME_SESSION_KEY = "researchos:welcome-seen";
export const WELCOME_RESTORING_ATTRIBUTE = "data-researchos-restoring";

// Runs before the shell is parsed so a returning tab does not paint the logon
// while its JavaScript loads. The timeout restores the ordinary fallback if
// hydration never completes. Both interpolated values are fixed constants.
export const WELCOME_RESTORE_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(WELCOME_SESSION_KEY)})==="1"){document.body.setAttribute(${JSON.stringify(WELCOME_RESTORING_ATTRIBUTE)},"");setTimeout(function(){document.body.removeAttribute(${JSON.stringify(WELCOME_RESTORING_ATTRIBUTE)})},15000)}}catch{}`;
