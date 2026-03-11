import { Client } from '@elastic/elasticsearch';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let elasticClient: Client | null = null;

export async function connectElasticsearch(): Promise<Client> {
  if (elasticClient) {
    return elasticClient;
  }

  elasticClient = new Client({
    node: env.ELASTICSEARCH_NODE,
  });

  await elasticClient.ping();
  logger.info('Elasticsearch connected');
  return elasticClient;
}

export function getElasticsearchClient(): Client {
  if (!elasticClient) {
    throw new Error('Elasticsearch client has not been initialized');
  }
  return elasticClient;
}

export async function disconnectElasticsearch(): Promise<void> {
  if (!elasticClient) {
    return;
  }
  await elasticClient.close();
  elasticClient = null;
  logger.info('Elasticsearch disconnected');
}

export function isElasticsearchHealthy(): boolean {
  return elasticClient !== null;
}
