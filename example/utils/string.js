export const obj2String = (str, replacer = null, space = 2) =>
  JSON.stringify(str, replacer, space).replace(/"([^(")]+)":/g, '$1:');

export const getConfigFromString = (fnString) => {
  // Regex to match the content between the first pair of curly braces
  const match = fnString.match(/=\s*(\{[\s\S]*\});?/);
  // If match is found, parse the string into an object
  if (match && match[1]) {
    try {
      // Use eval to parse the string as an object
      // eslint-disable-next-line no-eval
      return eval(`(${match[1]})`);
    } catch (e) {
      console.error('getConfigFromString', e);
      return null;
    }
  }
  return null;
};
