// # Application API
// sets up the application API

// import dependencies
import * as _ from 'lodash';
import { Request, Response, NextFunction, RequestHandler } from 'express';
export { default as status } from './status';
export { default as tags } from './tags';
export { default as webhooks } from './webhooks';

export interface IRequest extends Request {
  isAdmin?: boolean;
	file?: any;
}

function assignLocationHeader(apiMethod: Function, req: Request, res: Response, response: any) : void {
	let location;

	// assign location to response
	if (location) {
		res.set({ Location: location });
		res.status(201);
	}
}

function addHeaders(apiMethod: Function, req: Request, res: Response, response: any) {
	// check if a new object was created
	if(req.method === 'POST' || req.method === 'GET') {
		// # a new object was created
		// set location header to indicate where the object was created
		// the status code should be set to 201 Created
		assignLocationHeader(apiMethod, req, res, response);
	}
}

/**
 * http - HTTP wrapper function
 *
 * HTTP wrapper function that takes the API method and wraps it in order to make express able to handle it
 *
 * @param  {Function} apiMethod API method to call
 * @return {Function} middleware format function to be called by express
 */
export function http(apiMethod: Function) : RequestHandler {
	return async function apiHandler(req: IRequest, res: Response, next: NextFunction) {
		// define two base properties which will be used in every API method call
		let object = req.body;
		let options = _.extend({}, req.file, { ip: req.ip, userAgent: req.headers['user-agent'] }, req.query, req.params, {
			context: {
				// add admin payload if he is authenticated
				isAdmin: req.isAdmin
			}
		});

		// call API method with the prepared properties
		try {
			let response = await apiMethod(options, object);
			
			// set status
			res.status(200);
		
			// check if the request method is DELETE
			if(req.method === 'DELETE') {
				// set status code to No Content (204)
				return res.status(204).end();
			}

			// add headers to API responseco
			await addHeaders(apiMethod, req, res, response);

			// send a properly formatted HTTP response containing the json data
			res.json(response || {});
		} catch (err) {
			// # error should be handled by the error middleware
			// call next in order to continue middleware chain
			return next(err);
		}
	}
}

export function render(apiMethod: Function) : RequestHandler {
	return async function apiHandler(req: IRequest, res: Response, next: NextFunction) {
		// define two base properties which will be used in every API method call
		let object = req.body;
		let options = _.extend({}, req.file, { ip: req.ip }, req.query, req.params, {
			context: {
				// add admin payload if he is authenticated
				isAdmin: req.isAdmin
			}
		});

		// call API method with the prepared properties
		try {
			// set status
			res.status(200);

			// wait for method to send
			await apiMethod(options, object, res);
		} catch (err) {
			console.log(err);
			// # error should be handled by the error middleware
			// call next in order to continue middleware chain
			return next(err);
		}
	}
}