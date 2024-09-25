/* eslint-disable react/prop-types */
export const Form = ({
  estructura,
  setEstructura,
  material,
  setMaterial,
  ancho,
  setAncho,
  largo,
  setLargo,
  alto,
  setAlto,
  cerramiento,
  setCerramiento,
  tipoCambio,
  setTipoCambio,
  porcentaje,
  setPorcentaje,
  km,
  setKm,
  calcularCosto,
  cliente,
  setCliente,
  techoColor,
  setTechoColor,
  lateralesColor,
  setLateralesColor,
  chapaColor,
  setChapaColor,
  incluyeIva,
  setIncluyeIva,
}) => {
  return (
    <form
      onSubmit={calcularCosto}
      className="form">
      <div className="form-container">
        <div className="form-col">
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
          <label htmlFor="estructura">Estructura:</label>
          <select
            id="estructura"
            value={estructura}
            onChange={(e) => setEstructura(e.target.value)}>
            <option value="Galpón">Galpón</option>
            <option value="Tinglado">Tinglado</option>
          </select>
          <label htmlFor="material">Material:</label>
          <select
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}>
            <option value="Hierro Torsionado">Hierro Torsionado</option>
            <option value="Perfil U Ángulo">Perfil U Ángulo</option>
            <option value="Alma Llena">Alma Llena</option>
          </select>
          <label htmlFor="ancho">Ancho (m):</label>
          <input
            type="number"
            id="ancho"
            value={ancho}
            onChange={(e) => setAncho(parseFloat(e.target.value))}
          />
          <label htmlFor="largo">Largo (m):</label>
          <input
            type="number"
            id="largo"
            value={largo}
            onChange={(e) => setLargo(parseFloat(e.target.value))}
          />
          <label htmlFor="alto">Alto (m):</label>
          <input
            type="number"
            id="alto"
            value={alto}
            onChange={(e) => setAlto(parseFloat(e.target.value))}
          />
          {estructura === "Galpón" && (
            <>
              <label htmlFor="cerramiento">Cerramiento (m):</label>
              <input
                type="number"
                id="cerramiento"
                value={cerramiento}
                onChange={(e) => setCerramiento(parseFloat(e.target.value))}
              />
            </>
          )}
        </div>
        <div className="form-col">
          {estructura === "Galpón" && (
            <div className="checkbox-container">
              <label htmlFor="lateralesColor">Laterales a color:</label>
              <input
                type="checkbox"
                id="lateralesColor"
                value={lateralesColor}
                onChange={(e) => setLateralesColor(e.target.checked)}
              />
            </div>
          )}
          <div className="checkbox-container">
            <label htmlFor="techoColor">Techo a color:</label>
            <input
              type="checkbox"
              id="techoColor"
              value={techoColor}
              onChange={(e) => setTechoColor(e.target.checked)}
            />
          </div>
          <label htmlFor="tipo_cambio">Tipo de cambio (USD a ARS):</label>
          <input
            type="number"
            id="tipo_cambio"
            value={tipoCambio}
            onChange={(e) => setTipoCambio(parseFloat(e.target.value))}
          />
          <label htmlFor="porcentaje">Porcentaje adicional (%):</label>
          <input
            type="number"
            id="porcentaje"
            value={porcentaje}
            onChange={(e) => setPorcentaje(parseFloat(e.target.value))}
          />
          <label htmlFor="km">Kilómetros:</label>
          <input
            type="number"
            id="km"
            value={km}
            onChange={(e) => setKm(parseFloat(e.target.value))}
          />
          <label htmlFor="chapaColor">Diferencia Chapa Color:</label>
          <input
            type="number"
            id="chapaColor"
            value={chapaColor}
            onChange={(e) => setChapaColor(parseFloat(e.target.value))}
          />
          <div className="checkbox-container">
            <label htmlFor="incluyeIva">Inlcuye IVA</label>
            <input
              type="checkbox"
              id="incluyeIva"
              checked={incluyeIva}
              onChange={(e) => setIncluyeIva(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <button type="submit">Calcular Costo</button>
    </form>
  );
};
