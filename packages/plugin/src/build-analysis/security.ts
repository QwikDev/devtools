const REMOTE_BUILD_ANALYSIS_ENV = 'QWIK_DEVTOOLS_ALLOW_REMOTE_BUILD_ANALYSIS';
const TRUTHY_ENV_VALUES = new Set(['1', 'true', 'yes', 'on']);

type RpcClientSocket = {
  remoteAddress?: string | null;
};

type RpcClientLike = {
  socket?: RpcClientSocket | null;
  _socket?: RpcClientSocket | null;
};

export function isRemoteBuildAnalysisEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const rawValue = env[REMOTE_BUILD_ANALYSIS_ENV];
  if (!rawValue) return false;
  return TRUTHY_ENV_VALUES.has(rawValue.trim().toLowerCase());
}

export function getRpcClientRemoteAddress(client: unknown): string | undefined {
  if (!client || typeof client !== 'object') {
    return undefined;
  }

  const candidate = client as RpcClientLike;
  return candidate.socket?.remoteAddress ?? candidate._socket?.remoteAddress ?? undefined;
}

export function isLoopbackAddress(address: string | undefined): boolean {
  if (!address) return false;
  if (address === '127.0.0.1' || address === '::1') return true;
  if (address.startsWith('::ffff:')) {
    return isLoopbackAddress(address.slice('::ffff:'.length));
  }
  return false;
}

export function isBuildAnalysisRpcAllowed(
  client: unknown,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (isRemoteBuildAnalysisEnabled(env)) {
    return true;
  }

  return isLoopbackAddress(getRpcClientRemoteAddress(client));
}

export function getBuildAnalysisRpcGuardError(): string {
  return `Refusing to run the project build from a non-local DevTools RPC client. Reconnect from localhost or set ${REMOTE_BUILD_ANALYSIS_ENV}=1 to opt in to remote build-analysis execution.`;
}
