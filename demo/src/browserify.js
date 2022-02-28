var browserify = require('browserify');
var tsify = require('tsify');

browserify

browserify({debug: true})
    .transform("babelify", 
	       {
		   presets: ["@babel/preset-env", "es2017"], 
		   sourceMaps: true, 
		   global: true, 
		   ignore: [/\/node_modules\/(?!@polkadot\/)/, /\/node_modules\/(?!@babel\/)/, /\/node_modules\/(?!@babel-preset-es2017\/)/ ]
	       })
    .add('ondc-demo.ts') // main entry of an application
    .plugin(tsify, { noImplicitAny: true })
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(process.stdout);
