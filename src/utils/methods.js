/**
 * convert format price
 * @param {*} params
 */
export const formatPriceX = (price, key = '') => {
  const formattedPrice = parseFloat(price)
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return key === '' ? `₱${formattedPrice}` : `${key}₱ ${formattedPrice}`;
};

/**
 * convert object to query string
 * @param {*} params
 */
export const convertQueryString = (params) => {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};
