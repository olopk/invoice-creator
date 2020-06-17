const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const { getThemeVariables } = require('antd/dist/theme');

module.exports = override(
  fixBabelImports('antd', {
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: getThemeVariables({ dark: true,compact: true  })
    }),
);