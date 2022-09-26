import {Service} from '../model/service';
const Sentry = require('@sentry/node');

export class SentryService implements Service {
    public readonly name = "Sentry";
    public readonly environmentVariables = [
        'SENTRY_DSN'
    ];

    public init(): Promise<void> {
        const dsn = process.env.SENTRY_DSN;
        const release = process.env.SENTRY_RELEASE;

        const options = {
            dsn,
            release,
            tracesSampleRate: 1.0,
        };

        if (release === 'dev') {
            options['release'] = 'dev';
            options['environment'] = 'dev';
        }

        if (release === undefined) {
            console.warn(`No Sentry release specified, not initializing`);
            return Promise.reject();
        }

        console.log(`Initializing Sentry (release: ${release})`);
        Sentry.init(options);
        return Promise.resolve();
    }

    public destruct(): Promise<void> {
        return Sentry.close();
    }
}
