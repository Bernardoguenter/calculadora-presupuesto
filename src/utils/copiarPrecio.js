export const copiarPrecio = async (toCopy) => {
  if (!toCopy) {
    alert("Debes realizar una cotización antes de copiar el precio");
    return;
  }
  try {
    await navigator.clipboard.writeText(Number(Math.floor(toCopy)));
  } catch (error) {
    console.error(error.message);
  }
};
