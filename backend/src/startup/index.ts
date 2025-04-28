import * as plugin from '../plugins';
import Fastify from 'fastify';
import routes from '../routes';

export async function buildApp() {
  const app = Fastify({ logger: { level: 'error' } });
  await app.register(plugin.prismaPlugin);
  await app.register(plugin.googleOAuth2);
  await app.register(routes);
  return app;
}
