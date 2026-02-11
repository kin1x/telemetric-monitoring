import { isNullOrUndefined } from '../is-null-or-undefined.helper';

export function transformIntQuery(value: any): number | undefined {
  return isNullOrUndefined(value.value) ? undefined : parseInt(value.value);
}
