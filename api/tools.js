module.exports = {
    wrap: fn => (...args) => fn(...args).catch(args[2])
}