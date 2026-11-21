import { describe, it, expect } from 'vitest';

function routeCivicIssue(description: string) {
  const text = description.toLowerCase();
  if (text.includes('water') || text.includes('pipe')) return 'Water Supply';
  if (text.includes('pothole') || text.includes('road')) return 'PWD';
  if (text.includes('streetlight') || text.includes('power')) return 'Electricity';
  return 'General';
}

describe('CivicResolve Routing Tests', () => {
  it('routes water issues correctly', () => {
    expect(routeCivicIssue('Major water pipe burst')).toBe('Water Supply');
  });

  it('routes road potholes correctly', () => {
    expect(routeCivicIssue('Deep pothole on main road')).toBe('PWD');
  });
});