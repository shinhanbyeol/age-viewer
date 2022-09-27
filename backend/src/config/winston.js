/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const fs = require('fs');
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const path = require('path');
const { platform, homedir } = require('os');
const dotenv = require('dotenv');
dotenv.config();

const createDir = (dirName) => {
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }
};

const getAppDataPath = () => {
    let appDataPath;
    switch (platform()) {
        case 'win32':
            appDataPath = path.join(homedir(), '.Ageviewer');
            break;
        case 'darwin':
            appDataPath = path.join(homedir(), 'Library', 'Preferences', 'Ageviewer');
            break;
        case 'linux':
            appDataPath = path.join(homedir(), '.config', '.Ageviewer');
            break;
        default:
            if (platform().startsWith('win')) {
                appDataPath = path.join(homedir(), '.Ageviewer');
            } else {
                appDataPath = path.join(homedir(), '.config', '.Ageviewer');
            }
    }
    // Create directory if not exists
    createDir(appDataPath);
    return appDataPath;
};

const logDir = process.env.LOG_DIR || getAppDataPath();
const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const infoTransport = new winstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir,
    filename: 'info.%DATE%.log',
    maxFiles: 15,
    zippedArchive: true,
});

const errorTransport = new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/error',
    filename: 'error.%DATE%.log',
    maxFiles: 15,
    zippedArchive: true,
});

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [infoTransport, errorTransport],
});

const stream = {
    write: (message) => {
        logger.info(message);
    },
};

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
    );
}

module.exports = { logger, stream };
