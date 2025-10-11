export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}
export function isUnauthorizedError(error: Error): boolean {
  if ('status' in error && (error as any).status === 401) {
    return true;
  }
  
  if (error.message && error.message.toLowerCase().includes('unauthorized')) {
    return true;
  }
  
  return false;
}
