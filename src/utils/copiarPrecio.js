import { formatNumber } from "./formatNumbers";

export const copiarPrecio = async (toCopy) => {
  if (!toCopy) {
    alert("Debes realizar una cotización antes de copiar el precio");
    return;
  }
  try {
    const valorFormateado = formatNumber(toCopy);
    await navigator.clipboard.writeText(valorFormateado);
  } catch (error) {
    console.error(error.message);
  }
};
