/**
 * Search actions.
 * @module actions/search/search
 */

import compact from 'lodash/compact';
import concat from 'lodash/concat';
import isArray from 'lodash/isArray';
import join from 'lodash/join';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import toPairs from 'lodash/toPairs';

import {
  RESET_SEARCH_CONTENT,
  SEARCH_CONTENT,
} from '@plone/volto/constants/ActionTypes';

/**
 * Search content function.
 * @function searchContent
 * @param {string} url Url to use as base.
 * @param {Object} options Search options.
 * @param {string} subrequest Key of the subrequest.
 * @returns {Object} Search content action.
 */
export function searchContent(url, options, subrequest = null) {
  let queryArray = [];
  options = pickBy(
    options,
    (value) => value !== undefined && value !== null && value !== '',
  );
  const arrayOptions = pickBy(options, (item) => isArray(item));

  queryArray = concat(
    queryArray,
    options
      ? join(
          map(toPairs(pickBy(options, (item) => !isArray(item))), (item) => {
            if (item[0] === 'SearchableText') {
              // Adds the wildcard to the SearchableText param
              item[1] = `${item[1]}*`;
            }
            return join(item, '=');
          }),
          '&',
        )
      : '',
  );

  queryArray = concat(
    queryArray,
    arrayOptions
      ? join(
          map(pickBy(arrayOptions), (item, key) =>
            join(
              item.map((value) => `${key}:list=${value}`),
              '&',
            ),
          ),
          '&',
        )
      : '',
  );

  const querystring = join(compact(queryArray), '&');

  return {
    type: SEARCH_CONTENT,
    subrequest,
    request: {
      op: 'get',
      path: `${url}/@search${querystring ? `?${querystring}` : ''}`,
    },
  };
}

/**
 * Reset search content function.
 * @function resetSearchContent
 * @param {string} subrequest Key of the subrequest.
 * @returns {Object} Search content action.
 */
export function resetSearchContent(subrequest = null) {
  return {
    type: RESET_SEARCH_CONTENT,
    subrequest,
  };
}
