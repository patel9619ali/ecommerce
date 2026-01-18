/**
 * An array of routes that are accessible to public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = [
    '/'
];

/**
 * An array of routes that used for authentification
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */

export const authRoutes: string[] = [
    '/sign-in',
    '/sign-up'
];


/**
 * The prefic for api authentifiction routes
 * Routes that starts with these prefix will use for these authentification
 * @type {string}
 */

export const apiAuthPrefix: string = '/api/auth';



/**
 * Default redirect after login in 
 * @type {string}
 */
export const DEFAULT_REDIRECT_PAGE: string = 
    '/settings'
