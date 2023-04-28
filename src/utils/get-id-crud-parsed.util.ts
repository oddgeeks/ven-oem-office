export const getIdCrudParsed = (req) =>
  req.parsed.paramsFilter.find(
  (params) => params.field === req.options.params.id?.field,
);