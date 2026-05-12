import apiClient from './client';

// ----------------------------------------------------------------------

export type ServiceCheck = {
  name: string;
  status: 'ok' | 'error';
  latency_ms: number;
  message: string | null;
};

export type QueueDepth = {
  queue: string;
  depth: number | null;
};

export type FailedJob = {
  id: number;
  queue: string;
  job_class: string;
  failed_at: string;
};

export type ScheduledTask = {
  command: string;
  expression: string;
  next_run_at: string | null;
  timezone: string;
};

export type SystemHealthData = {
  services: ServiceCheck[];
  server: {
    load_1: number;
    load_5: number;
    load_15: number;
    cpu_count: number;
    memory_total_mb: number;
    memory_used_mb: number;
    memory_free_mb: number;
    disk_total_gb: number;
    disk_used_gb: number;
    disk_free_gb: number;
  };
  app: {
    laravel_version: string;
    php_version: string;
    env: string;
    debug: boolean;
    cache_driver: string;
    queue_connection: string;
    timezone: string;
  };
  queue: {
    worker_alive: boolean;
    last_heartbeat_at: string | null;
    heartbeat_age_seconds: number | null;
    depths: QueueDepth[];
    failed_count: number;
  };
  failed_jobs: FailedJob[];
  schedule: ScheduledTask[];
  checked_at: string;
};

// ----------------------------------------------------------------------

export const systemHealthApi = {
  get: (): Promise<{ data: SystemHealthData }> =>
    apiClient.get<{ data: SystemHealthData }>('/system-health').then((r) => r.data),
};
