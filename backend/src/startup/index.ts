import * as plugin from '../plugins';
import Fastify from 'fastify';
import { registerRoutes } from '../routes';

export async function buildApp() {
  const app = Fastify({ logger: { level: 'error' } });
  await app.register(plugin.prismaPlugin);
  await app.register(plugin.googleOAuth2);

  await registerRoutes(app);
  return app;
}
