/* eslint-disable react/prop-types */

export const VistaPrevia = ({
  cliente,
  setCliente,
  descripcion,
  setDescripcion,
  materiales,
  setMateriales,
  formasPago,
  setFormasPago,
  importeTotal,
  setImporteTotal,
}) => {
  return (
    <div className="vista-previa">
      <label htmlFor="cliente">Nombre cliente</label>
      <input
        name="cliente"
        type="text"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />
      <label htmlFor="Importe total">Importe Total</label>
      <input
        name="Importe total"
        type="text"
        placeholder="Importe total"
        value={importeTotal}
        onChange={(e) =>
          setImporteTotal(
            e.target.value === "" ? "" : parseFloat(e.target.value)
          )
        }
      />
      <label htmlFor="descripcion">Descripción</label>
      <textarea
        cols={2}
        name="descripcion"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}></textarea>
      <label htmlFor="materiales">Materiales(Separar con ;)</label>
      <textarea
        name="materiales"
        placeholder="Materiales"
        value={materiales}
        onChange={(e) => setMateriales(e.target.value)}></textarea>
      <label htmlFor="formadepago">Forma de pago(Separar con ;)</label>
      <textarea
        name="formadepago"
        placeholder="Formas de Pago"
        value={formasPago}
        onChange={(e) => setFormasPago(e.target.value)}></textarea>
    </div>
  );
};
