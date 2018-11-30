'use strict';

import jwt from 'jsonwebtoken';
import config from 'config';
import cloudinary from 'cloudinary';
import Q from 'q';

/**
 * @param {Object} obj the Obj to sign
 * @return {Object} The signed object
 * */
export const signToken = (obj) => {
    return jwt.sign(obj, config.get("authToken.secrete"), {expires: config.get('authToken.expiresIn')});
};

/**
 * @param {Object} file The obj to upload
 * @return {Promise}
 **/
export const upload = (file) => {
    cloudinary.config({
        cloud_name: config.get("cloudinary.cloud_name"),
        api_key: config.get("cloudinary.api_key"),
        api_secret: config.get("cloudinary.api_secret")
    });
    return new Q.Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file, {width: 50, height: 50}, (err, res) => {
            if (err) {
                reject(err);
            } else {
                return resolve(res);
            }
        });
    })
};



