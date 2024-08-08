export function formatNumber(number) {
  const parsed = Math.floor(parseFloat(number));

  const valorFormateado = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 3,
  }).format(parsed);
  return valorFormateado;
}
