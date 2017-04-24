/**
 * Created by espdlucas on 3/30/17.
 */

export const SERVER_URL = 'http://localhost:5000';
export const API_URL = 'http://localhost:5000/api';
//export const SERVER_URL = 'https://mednuvem.azurewebsites.net';
//export const API_URL = 'https://mednuvem.azurewebsites.net/api';

export const CLIENT_OAUTH2_CONFIG = {
    clientId: 'mednuvemApp',
    clientSecret: 'secret',
    accessTokenUri: SERVER_URL + '/connect/token',
    authorizationUri: SERVER_URL + '/connect/authorize',
    redirectUri: 'http://localhost/redirect.html',
    scopes: ['api']
};
