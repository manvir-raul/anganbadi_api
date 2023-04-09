exports.capitalizeFirstLetter = (v) => {
  // Convert 'bob' -> 'Bob'
  return v.charAt(0).toUpperCase() + v.substring(1);
};
