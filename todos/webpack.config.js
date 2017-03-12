/**
 * Created by zm on 2017/1/10.
 */
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
    entry: {
        bundle:"./js/app",
        vendor:['vue']
    },
    output:{
        filename:"./js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
			{
				test: /\.css$/,
				loader: 'style!css!postcss'
			},
            {
                test:/\.less$/,
                loader:'style!css!postcss!less'
            },
            {
                test:/\.(woff|svg|eot|ttf)\??.*$/,
                loader:'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=8192'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor',  './js/vendor.js')
    ],
    postcss:[
        autoprefixer({
            browsers:['last 3 versions']
        })
    ]
};