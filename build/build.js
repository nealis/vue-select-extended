// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var ghpages = require('gh-pages')
var webpackConfig = require('./webpack.prod.conf')

console.log(
		'  Tip:\n' +
		'  Built files are meant to be served over an HTTP server.\n' +
		'  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)

webpack(webpackConfig, function (err, stats) {
	spinner.stop()
	if (err) throw err
	process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false
			}) + '\n')

	// $ npm run build publish
	// This will publish /dist/ to the gh-pages
	if (( process.argv.indexOf('publish') > 1 )) {
		spinner = ora('Publishing to GitHub Pages...').start()
		ghpages.publish(path.join(__dirname, '../dist'), function (err) {
			spinner.stop()
			if (err) throw err
		});
	}
})
