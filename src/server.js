/* eslint-disable no-console */
import app from './app';

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log('App is listening on port 3333');
});

process.on('SIGHUP', () => {
  server.close(() => {
    console.log('Graceful Shutdown.');
    process.exit(0);
  });
});
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Graceful Shutdown.');
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Graceful Shutdown.');
    process.exit(0);
  });
});
