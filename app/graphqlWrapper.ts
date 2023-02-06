import { DocumentNode, print } from 'graphql';
import { DEMO_API_URL, VENIA_API_URL } from './constants';
import { getSdk } from './generated/graphql';
import { getSdkMG } from './generated/graphqlMG';
import { sessionStorage } from './sessions';

let API_URL =
  typeof process !== 'undefined'
    ? process.env.VENDURE_API_URL ?? DEMO_API_URL
    : DEMO_API_URL;

export interface QueryOptions {
  request: Request;
}

export interface GraphqlResponse<Response> {
  errors: any[];
  data: Response;
}

export type WithHeaders<T> = T & { _headers: Headers };

const AUTH_TOKEN_SESSION_KEY = 'authToken';

/**
 * This function is used when running in Cloudflare Pages in order to set the API URL
 * based on an environment variable. Env vars work differently in CF Pages and are not available
 * on the `process` object (which does not exist). Instead, it needs to be accessed from the loader
 * context, and if defined we use it here to set the API_URL var which will be used by the
 * GraphQL calls.
 *
 * See https://developers.cloudflare.com/workers/platform/environment-variables/#environmental-variables-with-module-workers
 */
export function setApiUrl(apiUrl: string) {
  API_URL = apiUrl;
  console.log("API url is set");
  
}
//  sdk == baseSdk == getSdk(requester);
//                      |
//                      --> return methods( methods === .colection, .login, .products ..... etc)
//                                            |
//                                            --> return requester(gql query, variables, options) === Promise
//                                                            |
//                                                            |
//                                                            |
// '=>' = trigger                                             |
//requester => sendQuery => return data=(res.json())          |
//    |                                                       |
//    ---> this is arg into getSdk(REQUESTER) <----------------
//                                     |
//                                     --> return call sendQuery(1. set header,
//                                                                2. set session,
//                                                                3. return fetch.then => DATA from gql)
//   ___________________________________________USING______________________________________________
//                                                | 
//                                                v
// async function loader({request, params, context}) {
//   const {someData} = await getSomethingData(request)
// }
//                              
//  Into the need component use: ==>  const {someData} = useLoaderData()  ===jsx=> {someData?.map( item => <div>item.name<div/>)}                    
//                                                                          

async function sendQuery<Response, Variables = {}>(options: {
  query: string;
  variables?: Variables;
  headers?: Headers;
  request?: Request;
}): Promise<GraphqlResponse<Response> & { headers: Headers }> {
  const headers = new Headers(options.headers);
  const req = options.request;
  headers.append('Content-Type', 'application/json');
  const session = await sessionStorage.getSession(
    options.request?.headers.get('Cookie'),
  );
  if (session) {
    // If we have a vendure auth token stored in the Remix session, then we
    // add it as a bearer token to the API request being sent to Vendure.
    const token = session.get(AUTH_TOKEN_SESSION_KEY);
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(options),
    headers,
  }).then(async (res) => ({ ...(await res.json()),headers: res.headers}));
}
async function sendQueryMG<Response, Variables = {}>(options: {
  query: string;
  variables?: Variables;
  headers?: Headers;
  request?: Request;
}): Promise<GraphqlResponse<Response> & { headers: Headers }> {
  const headers = new Headers(options.headers);
  const req = options.request;
  headers.append('Content-Type', 'application/json');
  const session = await sessionStorage.getSession(
    options.request?.headers.get('Cookie'),
  );
  if (session) {
    // If we have a vendure auth token stored in the Remix session, then we
    // add it as a bearer token to the API request being sent to Vendure.
    const token = session.get(AUTH_TOKEN_SESSION_KEY);
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(VENIA_API_URL, {
    method: 'POST',
    body: JSON.stringify(options),
    headers,
  }).then(async (res) => ({ ...(await res.json()),headers: res.headers}));
}

const baseSdk = getSdk<QueryOptions>(requester);
const baseSdkMG = getSdkMG<QueryOptions>(requesterMG);


type Sdk = typeof baseSdk;
type SdkWithHeaders = {
  [k in keyof Sdk]: (
    ...args: Parameters<Sdk[k]>
  ) => Promise<Awaited<ReturnType<Sdk[k]>> & { _headers: Headers }>;
};

export const sdk: SdkWithHeaders = baseSdk as any;

export const sdkMG:any = baseSdkMG as any

function requester<R, V>( 
  doc: DocumentNode,
  vars?: V,
  options?: { headers?: Headers; request?: Request },
): Promise<R & { _headers: Headers }> {
  return sendQuery<R, V>({
    query: print(doc),
    variables: vars,
    ...options,
  }).then(async (response) => {
    const token = response.headers.get('vendure-auth-token');
    const headers: Record<string, string> = {};
    if (token) {
      // If Vendure responded with an auth token, it means a new Vendure session
      // has started. In this case, we will store that auth token in the Remix session
      // so that we can attach it as an Authorization header in all subsequent requests.
      const session = await sessionStorage.getSession(
        options?.request?.headers.get('Cookie'),
      );
      if (session) {
        session.set(AUTH_TOKEN_SESSION_KEY, token);
        headers['Set-Cookie'] = await sessionStorage.commitSession(session);
      }
    }
    headers['x-vendure-api-url'] = API_URL;
    if (response.errors) {
      console.log(
        response.errors[0].extensions?.exception?.stacktrace.join('\n') ??
          response.errors,
      );
      throw new Error(JSON.stringify(response.errors[0]));
    }
    return { ...response.data, _headers: new Headers(headers) };
  });
}

function requesterMG<R, V>( 
  doc: DocumentNode,
  vars?: V,
  options?: { headers?: Headers; request?: Request },
): Promise<R & { _headers: Headers }> {
  return sendQueryMG<R, V>({
    query: print(doc),
    variables: vars,
    ...options,
  }).then(async (response) => {
    const token = response.headers.get('vendure-auth-token');
    const headers: Record<string, string> = {};
    if (token) {
      // If Vendure responded with an auth token, it means a new Vendure session
      // has started. In this case, we will store that auth token in the Remix session
      // so that we can attach it as an Authorization header in all subsequent requests.
      const session = await sessionStorage.getSession(
        options?.request?.headers.get('Cookie'),
      );
      if (session) {
        session.set(AUTH_TOKEN_SESSION_KEY, token);
        headers['Set-Cookie'] = await sessionStorage.commitSession(session);
      }
    }
    headers['x-vendure-api-url'] = API_URL;
    if (response.errors) {
      console.log(
        response.errors[0].extensions?.exception?.stacktrace.join('\n') ??
          response.errors,
      );
      throw new Error(JSON.stringify(response.errors[0]));
    }
    return { ...response.data, _headers: new Headers(headers) };
  });
}
