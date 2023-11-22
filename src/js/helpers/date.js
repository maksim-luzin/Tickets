import { format } from 'date-fns';

/**
 * 
 * @param {String} str 
 * @param {String} type 'yyyy.mm.dd'
 * @returns {String}
 */

export const formatDate = (str, type) => {
  const date = new Date(str);
  return format(date, type);
}