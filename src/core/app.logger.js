'use strict';

import winston from 'winston';
import fs from 'fs';
import path from 'path';
import config from 'config';

const {createLogger, format, transports} = winston;

/**
 * Generic Applogger fo the Application
 * */
class AppLogger {

    /**
     * @param {String} level The level of the log
     * @return {Object}
     * */
    static logger(level) {
        return createLogger({
            level: level,
            format: format.combine(
                format.colorize(),
                format.timeStamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.prinf((info) => {
                    `${info.timestamp} ${info.level}: ${info.message}`
                })
            ),
            transports: [new transports.Console()]
        });
    }

    static fileLogger(level, filename, saveas = null) {
        if (!fs.existsSync(filename)) {
            fs.mkdirSync(filename);
        }
        const _filename = path.join(this.filename, saveas ? this.saveas.toString() : config.get("app.log"));
        return createLogger({
            level: this.level,
            format: format.combine(
                format.colorize(),
                format.timeStamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.prinf((info) => {
                    `${info.timestamp} ${info.level}: ${info.message}`
                })
            ),
            transports: [
                new transports.Console(),
                format.prinf((info) => {
                    `${info.timestamp} ${info.level}: ${info.message}`
                }),
                new transports.File({_filename})
            ]
        });
    }
}

export default AppLogger;
