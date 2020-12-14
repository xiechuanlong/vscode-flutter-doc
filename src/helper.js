module.exports = {
    getExtension(filename) {
      return (filename || '').split('.').pop();
    },
  };
  