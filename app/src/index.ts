import {ServiceRegistry} from './config/service-registry';
import {SentryService} from './service/sentry-service';
import {ExpressService} from './service/express-service';

const serviceRegistry = new ServiceRegistry();
serviceRegistry.registerService(new SentryService());
serviceRegistry.registerService(new ExpressService());

serviceRegistry.initServices();



process.on('SIGINT', handleTermination);
process.on('SIGTERM', handleTermination);

function handleTermination(args) {
    console.info(`Received ${args} - shutting down`);
    serviceRegistry.destructServices()
        .then(() => process.exit(0));
}
