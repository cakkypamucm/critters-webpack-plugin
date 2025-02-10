import chalk from "chalk";

export function tap(inst, hook, pluginName, async, callback) {
    if (inst.hooks) {
        const camel = hook.replace(/-([a-z])/g, (s, i) => i.toUpperCase());
        inst.hooks[camel][async ? "tapAsync" : "tap"](pluginName, callback);
    } else {
        inst.plugin(hook, callback);
    }
}

const LOG_LEVELS = ["trace", "debug", "info", "warn", "error", "silent"];

const defaultLogger = {
    trace(msg) {
        console.trace(msg);
    },

    debug(msg) {
        console.debug(msg);
    },

    warn(msg) {
        console.warn(chalk.yellow(msg));
    },

    error(msg) {
        console.error(chalk.bold.red(msg));
    },

    info(msg) {
        console.info(chalk.bold.blue(msg));
    },

    silent() {}
};

/**
 * @see {@link https://github.com/GoogleChromeLabs/critters/blob/main/packages/critters/src/util.js} logger source code.
 */
export function createLogger(logLevel) {
    const logLevelIdx = LOG_LEVELS.indexOf(logLevel);

    return LOG_LEVELS.reduce((logger, type, index) => {
        if (index >= logLevelIdx) {
            logger[type] = defaultLogger[type];
        } else {
            logger[type] = defaultLogger.silent;
        }
        return logger;
    }, {});
}
