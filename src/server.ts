import * as express from 'express';
//import { configureMiddlewares } from './middlewares/config';
import { ConfigureRoutes } from './routes';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
//import * as cookieParser from 'cookie-parser';
const app = express();

app.use(cors())
//app.use(logger('dev'));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(cookieParser());

//configureMiddlewares(app)
ConfigureRoutes(app)
app.listen(3000, () => {
    console.log('Server listening on port 3000! We are Good to go');
});