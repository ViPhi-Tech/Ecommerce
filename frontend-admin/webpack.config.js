const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'app': path.resolve(__dirname, 'src/app')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all'
        },
        primeng: {
          test: /[\\/]node_modules[\\/]primeng[\\/]/,
          name: 'primeng',
          priority: 10,
          chunks: 'all'
        },
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular',
          priority: 15,
          chunks: 'all'
        }
      }
    }
  }
};
