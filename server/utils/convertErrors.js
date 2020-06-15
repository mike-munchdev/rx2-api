module.exports = (e) => {
  return { message: e.message || String(e) };
};
