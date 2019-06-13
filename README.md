## 搭建基础`webpack`项目骨架

### 初始化`npm`

`npm init`：这个命令用于初始化npm， 并创建一个package.json。创建过程中会让填写一系列信息。也可使用`npm init --yes`或`npm init -y`:从当前目录中提取的信息生成默认的package.json。创建过程中不会提问。

### 安装`webpack`

```
npm install webpack webpack-cli --save-dev
```

**这里总结下`npm install`参数的含义**

- `npm install packageName` : 直接install 会默认将指定的包保存到`dependencies`中

- `npm install packageName --save-prod`即`npm install packageName --P: 效果同`npm insatll` 

- `npm install packageName --save-dev` 即 `npm install packageName --D`  : 将指定包保存到 `devDependencies` 中

- `npm install packageName --save-optional` 即 `npm install packageName --O`  : 将指定包保存到 `optionalDependencies` 中

- `npm install --no-save` : 安装但是不保存到 `dependencies` 中

  还有两个不常用的`-E, --save-exact`  `-B, --save-bundle`

**说了这些就有必要总结下几类npm依赖包管理了**

- **dependencies** : 应用依赖，或者叫做业务依赖，它用于指定应用依赖的外部包，这些依赖是应用发布后正常执行时所需要的，但不包含测试时或者本地打包时所使用的包。
- **devDependencies** : 开发环境依赖，里面的包只用于开发环境，不用于生产环境
- **peerDependencies** : 同等依赖，或者叫同伴依赖，用于指定当前包（也就是你写的包）兼容的宿主版本
- **optionalDependencies** : 可选依赖，如果有一些依赖包即使安装失败，项目仍然能够运行或者希望npm继续运行，就可以使用**optionalDependencies**。另外**optionalDependencies**会覆盖**dependencies**中的同名依赖包，所以不要在两个地方都写,可选依赖包就像程序的插件一样，如果存在就执行存在的逻辑，不存在就执行另一个逻辑
- **bundledDependencies / bundleDependencies** : 打包依赖，**bundledDependencies**是一个包含依赖包名的数组对象，在发布时会将这个对象中的包打包到最终的发布包里。 执行打包命令**npm pack**, 在生成的包中，将包含**bundledDependencies / bundleDependencies**中项。 但是值得注意的是，这两个包必须先在**devDependencies**或**dependencies**声明过，否则打包会报错。

### 配置`entry`及`output`

关于`entry`及`output`的概念可以参考[webpack官方文档](https://webpack.js.org/concepts)

在根目录新建`build/webpack.config.js`

```js
// build/webpack.config.js
const path = require('path')
module.exports = {
  entry: {
    // 配置入口文件
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    // 配置打包文件输出的目录
    path: path.resolve(__dirname, '../dist'),
    // 生成的 js 文件名称
    filename: 'js/[name].[hash:8].js',
    // 生成的 chunk 名称
    chunkFilename: 'js/[name].[hash:8].js',
    // 资源引用的路径
    publicPath: '/'
  },
}
```

在`package.json`的 `script`中添加以下代码： 

```
"build": "webpack --config ./build/webpack.config.js"
```

### 简单 的测试一下

输入`npm run build`可以看到dist目录下生成了文件

## 配置项目中常用的功能

### 使用 `html-webpack-plugin`来创建html页面并自动引入打包生成的文件

先在根目录新建一个`index.html`页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

修改`webpack.config.js`配置

```js
// build/webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    // 配置入口文件
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    // 配置打包文件输出的目录
    path: path.resolve(__dirname, '../dist'),
    // 生成的 js 文件名称
    filename: 'js/[name].[hash:8].js',
    // 生成的 chunk 名称
    chunkFilename: 'js/[name].[hash:8].js',
    // 资源引用的路径
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html')
    }),
  ]
}
```

### 配置热更新

模块热更新需要`HotModuleReplacementPlugin`插件。并且指定`devServer.hot`为`true`。

```js
// build/webpack.config.js
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    // 配置入口文件
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    // 配置打包文件输出的目录
    path: path.resolve(__dirname, '../dist'),
    // 生成的 js 文件名称
    filename: 'js/[name].[hash:8].js',
    // 生成的 chunk 名称
    chunkFilename: 'js/[name].[hash:8].js',
    // 资源引用的路径
    publicPath: '/'
  },
  devServer: {
    hot: true,
    port: 3000, // 端口号
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
```

在`package.json`的 `script`中添加以下代码： 

```
"serve": "webpack-dev-server --config ./build/webpack.config.js",
```



### 配置`Babel`

Babel是一个广泛使用的转码器，可以将ES6及更新版本的代码转为ES5代码，从而在现有环境执行

**安装**

```
npm install babel-loader @babel/core @babel/preset-env
```

在`webpack.config.js` module.rule中添加以下配置

```
{
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader'
},
```

在项目根目录添加一个 `babel.config.js` 文件

```js
module.exports = {
  presets: [
    "@babel/preset-env"
  ]
}
```

### 配置`babel-polyfill`

Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如`Object.assign`）都不会转码。我们可以通过 `babel-polyfill `对一些不支持新语法的客户端提供新语法的实现

**安装**

```
npm install @babel/polyfill
```

在`webpack.config.js`的 `entry` 中添加 `@babel-polyfill`

```js
require("@babel/polyfill");
main: ["@babel/polyfill", path.resolve(__dirname, '../src/main.js')]
```

### 配置 css 预处理

配置方法大同小异，这里只说下`less`

```
$ npm install less-loader css-loader style-loader --save-dev
```

1. `less-loader` 将 `.less` 语法转化为 css
2. `css-loader `使你能够使用类似@import和url（...）的方法实现require的功能
3. `style-loader`  将所有的计算后的样式加入页面的head中的style标签中
4. `mini-css-extract-plugin`   如果不想将css一股脑全放到 style  标签中，可以使用 `mini-css-extract-plugin` 该插件主要是为了抽离 js 文件中的css样式。抽离之后前面配置的的`html-webpack-plugin` 会帮我们将其引入到html中

配置的时候值得注意的是webpack的`module.rules`的loader加载是从右向左加载的

### 配置 css 后处理 postcss

**安装**

```
npm install postcss-loader autoprefixer -D
```

**在项目根目录下新建一个` postcss.config.js`**

```
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```



以上两步配置完成之后 `webpack.config.js` 如下

```
rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'less-loader',
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
    ]
```

### 配置 `file-loader` 、 `url-loader` 

**安装**

```
npm install file-loader url-loader -D
```

`file-loader` 解析文件url，并将文件复制到输出的目录中

`url-loader` 功能类似于 [`file-loader`](https://github.com/webpack-contrib/file-loader)，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。

### 配置 `vue-loader` 

**安装**

```
npm install --save-dev thread-loader
```

**配置**

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve("src"),
        use: [
          "thread-loader",
          "expensive-loader"
        ]
      }
    ]
  }
}
```

## 拆分生产环境及开发环境的webpack配置

保留之前的 `webpack.config.js` 文件作为 两种环境的公用配置

新建 `build/webpack.dev.js` 作为开发环境配置 、 `build/webpack.prod.js` 作为生产环境配置。

首先，我们先明确下生产环境及开发环境的webpack配置有哪些不同：

- 开发环境需要热更新，而生产环境不需要
- 生产环境打包时可以添加进度条，显示打包进度(这里我使用的是`progress-bar-webpack-plugin`)
- 生产环境打包时需要将一些存放静态文件的文件夹直接拷贝到dist文件夹中（这里我使用的是 `copy-webpack-plugin`）
- 生产环境打包时需将前一次打包生成的文件删除（`CleanWebpackPlugin`）
- 生产环境可以添加打包分析插件（`webpack-bundle-analyzer`）
- 生产环境中需分离css到单独文件（ `mini-css-extract-plugin` ）

在拆分的时候可以使用 `webpack-merge` 来合成最终的配置