type LimiterOptions = {
  limit: number;
  windowMs: number;
  maxKeys?: number;
  now?: () => number;
};

export function createContactRateLimiter({
  limit,
  windowMs,
  maxKeys = 1024,
  now = Date.now,
}: LimiterOptions) {
  const requests = new Map<string, number[]>();

  return (key: string) => {
    const timestamp = now();
    const recent = (requests.get(key) ?? []).filter(
      (requestTime) => timestamp - requestTime < windowMs,
    );
    if (recent.length >= limit) {
      requests.set(key, recent);
      return false;
    }
    if (requests.size >= maxKeys && !requests.has(key)) {
      const oldest = requests.keys().next().value;
      if (oldest) requests.delete(oldest);
    }
    recent.push(timestamp);
    requests.set(key, recent);
    return true;
  };
}
