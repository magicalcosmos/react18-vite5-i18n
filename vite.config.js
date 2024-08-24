import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'path';
import px2Viewport from 'postcss-px-to-viewport-8-plugin';

const pxToViewConfig750 = {
  unitToConvert: 'px',
  viewportWidth: 750, // 设计稿宽度
  unitPrecision: 5, // 单位转换后保留的精度
  propList: ['*'], // 能转化为vw的属性列表
  viewportUnit: 'vw', // 希望使用的视口单位
  fontViewportUnit: 'vw', // 字体使用的视口单位
  selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
  minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
  mediaQuery: true, // 媒体查询里的单位是否需要转换单位
  replace: true, //  是否直接更换属性值，而不添加备用属性
  exclude: [/src\/views\/Admin/, /src\/views\/375/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
  include: [/src\/views\/750/], // 如果设置了include，那将只有匹配到的文件才会被转换
  landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
  landscapeUnit: 'vw', // 横屏时使用的单位
  landscapeWidth: 1024, // 横屏时使用的视口宽度
};
const pxToViewConfig375 = {
  unitToConvert: 'px',
  viewportWidth: 375, // 设计稿宽度
  unitPrecision: 5, // 单位转换后保留的精度
  propList: ['*'], // 能转化为vw的属性列表
  viewportUnit: 'vw', // 希望使用的视口单位
  fontViewportUnit: 'vw', // 字体使用的视口单位
  selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
  minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
  mediaQuery: true, // 媒体查询里的单位是否需要转换单位
  replace: true, //  是否直接更换属性值，而不添加备用属性
  exclude: [/src\/views\/Admin/, /src\/views\/750\//], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
  include: [/src\/views\/375\//], // 如果设置了include，那将只有匹配到的文件才会被转换
  landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
  landscapeUnit: 'vw', // 横屏时使用的单位
  landscapeWidth: 1024, // 横屏时使用的视口宽度
};

export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        'react-i18next' // Add this to auto-import react-i18next functions
      ]
    }),
  ],
  css: {
    postcss: {
      plugins: [
        px2Viewport(pxToViewConfig375),
        px2Viewport(pxToViewConfig750),
      ],
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
      },
    }
  }
});
