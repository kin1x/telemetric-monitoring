export function getIpFromHeadersHelper(
  headers: unknown,
  ipDecorator?: string,
  defaultIp: string = '127.0.0.1',
): string {
  const ipv4 =
    headers['x-forwarded-for'] ||
    headers['X-Forwarded-For'] ||
    headers['x-real-ip'] ||
    headers['X-Real-IP'] ||
    ipDecorator?.substring(2).split(':')[1] ||
    defaultIp;
  return ipv4;
}
