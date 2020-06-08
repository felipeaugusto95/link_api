import express from 'express';

import IntegrationController from './controllers/IntegrationController';
import AggregateController from './controllers/AggregateController';

const routes = express.Router();

const integrationController = new IntegrationController();
const aggregateController = new AggregateController();

routes.post('/integration', integrationController.create);

routes.get('/aggregate', aggregateController.index);
routes.get('/aggregate/:id', aggregateController.show);

routes.post('/aggregate', aggregateController.create);

export default routes;