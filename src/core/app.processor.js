'use stict';

import _ from 'underscore';
import AppResponse from './app.response';
import AppLogger from './app.response';
import AppError from './app.error';
import {HTTP_BAD_REQUEST} from "../utils/status-codes";

/**
 * The processor class
 * */
class AppProcessor {
    /**
     * @param {Object} model The schema model
     * @param {String} id The id of the resource to find
     * @param {Object} queryParser  The query parser
     * @return {Promise<Object>}
     * */
    static async getObject(model, id, queryParser) {
        let query = model.findOne({_id: id, deleted: false});
        if (queryParser.population) {
            query = query.populate(queryParser.population);
        }
        return query.exec();
    }

    /**
     * @param {Object} model The schema model
     * @param {Object} object The schema model
     * @param {Integer} code The schema model
     * @param {Object} meta The query parser
     * @param {String} message the id of the resource to find
     * @param {Object} queryParser  The query parser
     * @return {Promise<Object>}
     **/
    static async getResponseObject(model, object, code, meta = AppResponse.getSuccess(), message = "Operation was successful", queryParser = null) {
        _.extend(message, {status_code: code});
        if (queryParser && queryParser.population) {
            object = await model.populate(object, queryParser.population);
        }
        if (message) {
            meta.message = message;
        }
        return AppResponse.format(meta, object);
    }

    /**
     * @param {Object} model The schema model
     * @param {String} type The type of validation to perform
     * @param {Object} body The object to validate
     * @param {String} error The object to validate
     * @return {Object}
     */
    static validate(model, type, body, error) {
        const {validator, validated} = model.validations(type, body);
        if (!validated) {
            return new AppError(error, HTTP_BAD_REQUEST, validator.errors.all());
        }
        return null;
    }

}
