const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const urlDev = "https://localhost:3000/";
const urlProd = "https://api.contractsmarts.ai/static/v1.0/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const buildType = dev ? "dev" : "prod";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: "./src/taskpane/taskpane.js",
      commands: "./src/commands/commands.js"
    },
    output: {
      clean: true,
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      publicPath: dev ? "/" : "./"
    },
    resolve: {
      extensions: [".html", ".js", ".css"],
      alias: {
        assets: path.resolve(__dirname, 'assets'),
        styles: path.resolve(__dirname, 'src/styles')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[path][name][ext]"
          }
        }
      ]
    },
    plugins: [
      // Main taskpane
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"]
      }),
      // Commands
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"]
      }),
      // Feature pages
      new HtmlWebpackPlugin({
        filename: "align.html",
        template: "./src/taskpane/align/align.html",
        chunks: ["polyfill", "taskpane"]
      }),
      new HtmlWebpackPlugin({
        filename: "chat.html",
        template: "./src/taskpane/chat/chat.html",
        chunks: ["polyfill", "taskpane"]
      }),
      new HtmlWebpackPlugin({
        filename: "support.html",
        template: "./src/taskpane/support/support.html",
        chunks: ["polyfill", "taskpane"]
      }),
      new HtmlWebpackPlugin({
        filename: "startval.html",
        template: "./src/taskpane/validate/startval.html",
        chunks: ["polyfill", "taskpane"]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/images",
            to: "assets/images",
            globOptions: {
              ignore: ["**/.DS_Store"]
            }
          },
          {
            from: "src/styles",
            to: "styles"
          },
          {
            from: "manifest*.xml",
            to: "[name].[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            }
          }
        ]
      })
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions()
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
      static: {
        directory: path.join(__dirname, "dist"),
        publicPath: "/"
      }
    }
  };

  return config;
};