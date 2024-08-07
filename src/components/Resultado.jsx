/* eslint-disable react/prop-types */
export const Resultado = ({ resultado }) => {
  if (!resultado) return null;

  const {
    areaPiso,
    perimetro,
    totalColumnas,
    areaParedes,
    areaTotal,
    estructura,
    material,
    precioPorMetro,
    costoColumnas,
    costoCerramiento,
    costoKmArsFormateado,
    precioTotal,
    precioTotalArsFormateado,
    precioFinalArsFormateado,
  } = resultado;

  return (
    <div>
      <h2>Cotización</h2>
      <p>
        Área del piso: <span>{areaPiso} m²</span>
      </p>
      <p>
        Perímetro del galpón: <span>{perimetro} m</span>
      </p>
      <p>
        Número total de columnas: <span>{totalColumnas}</span>
      </p>
      <p>
        Área de las paredes: <span>{areaParedes} m²</span>
      </p>
      <p>
        Área total: <span>{areaTotal} m²</span>
      </p>
      <p>
        Estructura seleccionada: <span>{estructura}</span>
      </p>
      <p>
        Material seleccionado: <span>{material}</span>
      </p>
      <p>
        Precio por metro cuadrado de piso:{" "}
        <span>{precioPorMetro.toFixed(2)} USD/m²</span>
      </p>
      <p>
        Costo adicional/reducción por columnas:{" "}
        <span>{costoColumnas.toFixed(2)} USD</span>
      </p>
      <p>
        Costo del cerramiento: <span>{costoCerramiento.toFixed(2)} USD</span>
      </p>
      <p>
        Costo de los kilómetros en ARS: <span>{costoKmArsFormateado} ARS</span>
      </p>
      <p>
        Precio total en USD: <span>{precioTotal.toFixed(2)} USD</span>
      </p>
      <p>
        Precio total en ARS: <span>{precioTotalArsFormateado} ARS</span>
      </p>
      <p>
        Precio final con porcentaje adicional en ARS:
        <span>{precioFinalArsFormateado} ARS</span>
      </p>
    </div>
  );
};
