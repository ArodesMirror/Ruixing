module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5, //1ren == 37.5px
            propList: ['*'],
        },
    },
};