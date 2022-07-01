import Configuration from '../configuration/Configuration';
import merge from '../mergeHeaders';

const callApi = (
  url: string,
  init?: RequestInit | undefined
): Promise<Response> => {
  return url.startsWith('/')
    ? fetch(Configuration.BaseAPIUrl + url, init)
    : fetch(url, init);
};

export const callApiWithToken = async (
  accessToken: string,
  url: string,
  init?: RequestInit | undefined
) => {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  if (accessToken) {
    headers.append('Authorization', bearer);
  }

  const options = {
    ...init,
    headers: merge(headers, init?.headers ?? {}),
  };

  return url.startsWith('/')
    ? fetch(Configuration.BaseAPIUrl + url, options)
    : fetch(url, options);
};

export default callApi;
