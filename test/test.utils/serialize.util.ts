export function describeClass(typeOfClass: any) {
  const a = new typeOfClass();
  const array = Object.getOwnPropertyNames(a);
  return array;
}

export function serialize<DTO>(data: object, DTO): DTO {
  let result = new DTO();
  const properties = describeClass(DTO);
  result = properties.reduce((result, fieldName) => {
    const value = data[fieldName];
    if (value != null) {
      result[fieldName] = data[fieldName];
    }

    return result;
  }, result);
  return result;
}
