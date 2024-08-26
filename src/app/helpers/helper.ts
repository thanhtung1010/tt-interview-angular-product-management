export class Helpers {
  /**
   * Substring a string with length and append ...
   * @param str Source string to sub
   * @param length Length to sub
   * @param substr Last index of string to sub, maybe space, ';', '/', '.',...
   * @example: subStringSmarter(item.newS_DESC, 110, ' ')
   */
  public static subStringSmarter(str: string, length: number, substr: string, appendStr = '...'): string {
    if (!str.length) return '';
    if (str.length > length) {
      str = str.substr(0, length);
      const t = str.replace(/^\s+|\s+$/g, '').lastIndexOf(substr);
      if (t < str.length) {
        str = str.substr(0, (t < 0 ? str.length : t)) + appendStr;
      }
    }
    return str;
  }

  // some thing else ...
  /***
   * Need input params, return, description on method
   */
  public static scrollToTop(noAnimation: boolean = false) {
    if (noAnimation) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var scrollStep = -window.scrollY / (300 / 100),
      scrollInterval = setInterval(function () {
        if (window.scrollY != 0) {
          window.scrollBy(0, scrollStep);
        }
        else clearInterval(scrollInterval);
      }, 10);
    //
  }

  public static convertObjectToParams = (_obj: any) => {
    if (_obj) {
      let str = "";
      // tslint:disable-next-line:forin
      for (const key in _obj) {
        if (str !== "") {
          str += "&";
        }
        str += key + "=" + encodeURIComponent(_obj[key]);
      }
      return str;
    } else {
      return "";
    }
  }
  public static convertParamsToObject = (_string: string) => {
    // var search = location.search.substring(1);
    if (_string && _string.length > 0 && _string !== '/') {
      return JSON.parse(
        '{"' +
        decodeURI(_string)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
      );
    }
    return undefined;
  }
  public static getParamString = () => {
    return window.location.search.replace(/\?/g, '') || '';
  }


  /**
   * Get value of query params
   * @param key Key of query
   */
  public static getQueryString = (key: string): string => {
    const { search } = window.location
    const params = new URLSearchParams(search)
    const value = params.get(key)
    return value ? value : ''
  }

  /**
   * Get current host like: https://localhost:8000/
   */
  public static getCurrentHost = (): string => window.location.protocol.concat('//').concat(window.location.host)


  /**
   * Get path with /
   * @param paths Array of path
   * @param prefix Key if prefix / is includes
   * @returns string with paths
   */
  public static JoinPaths = (paths: string[], prefix: boolean = false)
    : string => {
    const _pathMatches = paths.join('/');
    return prefix ? `/${_pathMatches}` : _pathMatches;
  }
}
