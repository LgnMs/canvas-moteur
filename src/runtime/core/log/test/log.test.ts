import { log, warn, error, showAllLogs } from '../index'

test('log function', () => {
    log('log');
    warn('warn');
    error("error");
    showAllLogs();
});