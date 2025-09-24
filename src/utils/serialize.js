/**
 * Convierte BigInt a string en un objeto JSON para evitar errores
 * al enviar datos de Prisma a clientes como Postman.
 * @param {any} obj
 * @returns {any}
 */
export function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

/**
 * Adjunta URL completa a un pictograma individual
 * @param {object} pictogram
 * @param {string} host
 * @returns {object}
 */
export const attachFullImageUrl = (
  pictogram,
  host = "http://localhost:4000"
) => {
  if (!pictogram) return null;
  const newPicto = { ...pictogram };
  if (pictogram.image?.url) {
    newPicto.image = {
      ...pictogram.image,
      fullUrl: `${host}${pictogram.image.url}`,
    };
  }
  return newPicto;
};

/**
 * Adjunta URL completa a un array de pictogramas
 * @param {array} pictograms
 * @param {string} host
 * @returns {array}
 */
export const attachFullImageUrlArray = (
  pictograms,
  host = "http://localhost:4000"
) => pictograms.map((p) => attachFullImageUrl(p, host));
