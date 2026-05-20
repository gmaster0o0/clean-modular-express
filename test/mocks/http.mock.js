import { vi } from 'vitest';
/**
 * Request and Response mocks for testing Express controllers.
 * @param {} options
 * @returns
 */
export const createMockReq = (options = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    ...options,
  };
};
/**
 * Response mock for testing Express controllers.
 * @returns
 */
export const createMockRes = () => {
  const res = {
    statusCode: undefined,
    body: undefined,
  };

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data) => {
    res.body = data;
    return res;
  };

  res.send = (data) => {
    res.body = data;
    return res;
  };

  res.sendStatus = (code) => {
    res.statusCode = code;
    return res;
  };

  return res;
};
/**
 * Next function mock for testing Express controllers.
 * @returns
 */
export const createMockNext = () => vi.fn();
