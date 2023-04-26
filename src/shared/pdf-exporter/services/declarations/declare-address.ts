export function declareAddress(address: any) {
  const result = {
    stack: [],
  };

  if (!address) {
    return result;
  }

  const { address_1, address_2, address_3, city, zipCode, region, country } =
    address;

  if (address_1 || address_2 || address_3) {
    result.stack.push({
      text: address_1 || address_2 || address_3,
    });
  }

  if (city) {
    result.stack.push({
      text: city,
    });
  }

  if (region) {
    result.stack.push({
      text: `${region} ${zipCode}`,
    });
  }

  return result;
}
