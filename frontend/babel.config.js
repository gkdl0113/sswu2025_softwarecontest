// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    // JSX + RN + TS 파싱
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      // @/ 경로 별칭
      ['module-resolver', {
        root: ['./'],
        alias: { '@': './' },
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      }],
      // (사용 중이면) 항상 마지막에 위치
      'react-native-reanimated/plugin',
    ],
  };
};
