import { log, warn, error, showAllLogs } from '../log'

test('log function', () => {
    log('log');
    warn('warn');
    error("error");
    showAllLogs();
});