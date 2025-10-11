type MapJson = {
  dataType: 'Map';
  value: readonly (readonly [unknown, unknown])[];
};

function isMapJSON(v: unknown): v is MapJson {
  if (
    typeof v !== 'object' ||
    v === null ||
    !('dataType' in v) ||
    !('value' in v)
  )
    return false;

  const anyV = v as { dataType: unknown; value: unknown };
  if (anyV.dataType !== 'Map') return false;
  if (!Array.isArray(anyV.value)) return false;

  // Ensure value is an array of tuple-like pairs
  return anyV.value.every((e) => Array.isArray(e) && e.length === 2);
}

function replacer(_: string, value: unknown) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(_key: string, value: unknown): unknown {
  if (isMapJSON(value)) {
    // value.value is now strongly typed as readonly (readonly [unknown, unknown])[]
    // Map constructor accepts Iterable<[K, V]>, readonly pairs are fine.
    return new Map(value.value as Iterable<readonly [unknown, unknown]>);
  }
  return value;
}

export const jsonStringify = (value: unknown) => {
  return JSON.stringify(value, replacer);
};

export const jsonParse = <T = unknown>(value: string) => {
  return JSON.parse(value, reviver) as T;
};
