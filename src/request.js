export const fetchData = async (url, method = "GET", customOptions) => {
  const options = { ...customOptions, method };
  const responsePromise = await fetch(url, options);
  const response = await responsePromise.json();
  return response;
};
