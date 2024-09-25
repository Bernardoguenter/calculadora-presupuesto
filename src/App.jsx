/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Resultado } from "./components/Resultado";
import { convertPDF } from "./utils/jsPDF";
import { Form } from "./components/Form";
import { VistaPrevia } from "./components/VistaPrevia";
import { PDF } from "./components/PDF";
import { interp1d } from "./utils/calculadorDeArea";
import { priceListGalpon, priceListTinglado } from "./utils/precios";
import { materialesMap } from "./utils/materiales";

const initialValues = {
  estructura: "Galpón",
  material: "Hierro Torsionado",
  ancho: 15,
  largo: 5,
  alto: 25,
  cerramiento: 4.5,
  tipoCambio: 1,
  porcentaje: 2,
  km: 0,
  resultado: null,
  cliente: "",
  descripcion: "",
  importeTotal: 0,
  materiales: "",
  formaDePago: `
      Pago contado;
      Cheques a 0, 30, 60, 90, 120 días (sin interés);
      Cheques a 150 días (8% de interés);
      Crédito bancario por medio de factura proforma
    `,
  lateralesColor: false,
  techoColor: false,
  chapaColor: 6.68,
  incluyeIva: true,
};

const App = () => {
  const [estructura, setEstructura] = useState(initialValues.estructura);
  const [material, setMaterial] = useState(initialValues.material);
  const [ancho, setAncho] = useState(initialValues.ancho);
  const [largo, setLargo] = useState(initialValues.largo);
  const [alto, setAlto] = useState(initialValues.alto);
  const [cerramiento, setCerramiento] = useState(initialValues.cerramiento);
  const [tipoCambio, setTipoCambio] = useState(() => {
    const savedTipoCambio = localStorage.getItem("tipoCambio");
    return savedTipoCambio !== null
      ? parseFloat(savedTipoCambio)
      : initialValues.tipoCambio;
  });
  const [porcentaje, setPorcentaje] = useState(initialValues.porcentaje);
  const [km, setKm] = useState(initialValues.km);
  const [resultado, setResultado] = useState(initialValues.resultado);
  const [cliente, setCliente] = useState(initialValues.cliente);
  const [descripcion, setDescripcion] = useState(initialValues.descripcion);
  const [importeTotal, setImporteTotal] = useState(initialValues.importeTotal);
  const [materiales, setMateriales] = useState(initialValues.materiales);
  const [formasPago, setFormasPago] = useState(initialValues.formaDePago);
  const [lateralesColor, setLateralesColor] = useState(
    initialValues.lateralesColor
  );
  const [techoColor, setTechoColor] = useState(initialValues.techoColor);
  const [chapaColor, setChapaColor] = useState(initialValues.chapaColor);
  const [incluyeIva, setIncluyeIva] = useState(initialValues.incluyeIva);

  useEffect(() => {
    // Guarda el tipo de cambio en localStorage cada vez que se actualiza
    localStorage.setItem("tipoCambio", tipoCambio);
  }, [tipoCambio]);

  useEffect(() => {
    if (resultado) {
      generatePreview();
    }
  }, [resultado]);

  const calcularCosto = (e) => {
    e.preventDefault();
    const areaPiso = ancho * largo;
    const perimetro = 2 * (ancho + largo);
    const areaParedes = perimetro * alto;
    const areaCerramiento = perimetro * cerramiento;
    const areaTotal = areaPiso + areaParedes;

    //SELECCINOAR LISTA DE PRECIOS
    const priceList =
      estructura === "Galpón" ? priceListGalpon : priceListTinglado;
    const interp = interp1d(priceList.area, priceList.precio);
    let precioPorMetro = interp(areaPiso);

    if (estructura === "Tinglado" && areaPiso >= 1000) {
      precioPorMetro = Math.max(precioPorMetro, 74);
    }

    if (material === "Perfil U Ángulo") {
      precioPorMetro += 24;
    } else if (material === "Alma Llena") {
      precioPorMetro += 48;
    }

    //CALCULAR COLUMNAS
    const numColumnasLargo = Math.floor(largo / 5) + 1;
    const totalColumnas = numColumnasLargo * 2;
    const precioColumna =
      material === "Hierro Torsionado"
        ? 38
        : material === "Perfil U Ángulo"
        ? 76
        : 160;
    const costoColumnas =
      alto === 5
        ? 0
        : totalColumnas *
          Math.abs(alto - 5) *
          precioColumna *
          (alto > 5 ? 1 : -1);

    //CALCULAR COSTO CERRAMIENTO
    const costoCerramiento =
      estructura === "Tinglado"
        ? 0
        : Math.abs(cerramiento - 4.5) *
          perimetro *
          27 *
          (cerramiento > 4.5 ? 1 : -1);

    //CALCULAR COSTO CERRAMIENTO COLOR
    const costoCerramientoColor = lateralesColor
      ? areaCerramiento * chapaColor
      : 0;

    //CALCULO COSTO PISO
    const costoPiso = areaPiso * precioPorMetro;

    //CAMBIO DE COSTO TECHO POR CHAPA A COLOR

    const costoTechoColor = techoColor ? areaPiso * chapaColor : 0;

    //CALCULAR COSTO KMS
    const costoKm = km * (areaPiso <= 300 ? 1.8 : areaPiso <= 800 ? 2.1 : 4.2);
    const costoKmArs = costoKm * tipoCambio;

    //CALCULAR PRECIO TOTAL
    let precioTotal =
      costoPiso +
      costoColumnas +
      costoCerramiento +
      costoCerramientoColor +
      costoTechoColor +
      costoKm;

    //CALCULO DE TOTALES EN ARS
    const precioTotalArs = precioTotal * tipoCambio;
    const precioFinalArs = precioTotalArs * (1 + porcentaje / 100);

    //FORMATEO DE RESULTADOS
    const precioTotalArsFormateado = precioTotalArs.toFixed(2);
    const precioFinalArsFormateado = precioFinalArs.toFixed(2);
    const costoKmArsFormateado = costoKmArs.toFixed(2);

    setResultado({
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
    });
  };

  const generatePreview = () => {
    const newDescripcion =
      estructura === "Galpón"
        ? `${estructura} de ${largo}mts x ${ancho}mts x ${alto}mts de altura libre con ${cerramiento}mts cerramiento de chapa en los laterales.`
        : `${estructura} de ${largo}mts x ${ancho}mts x ${alto}mts de altura libre`;

    let newMateriales = materialesMap[estructura]?.[material];

    // Modifica la descripción de materiales si hay color en techo o laterales
    if (techoColor) {
      newMateriales = newMateriales.replace(
        "Chapa de techo: Sincalum",
        "Chapa de techo: Color"
      );
    }
    if (lateralesColor && estructura === "Galpón") {
      newMateriales = newMateriales.replace(
        "Chapa de lateral: Sincalum",
        "Chapa de lateral: Color"
      );
    }

    setDescripcion(newDescripcion);
    setMateriales(newMateriales);
    setImporteTotal(
      Math.floor(resultado.precioFinalArsFormateado / 1000) * 1000
    );
  };

  const handleConvertPDF = () => {
    convertPDF(cliente);
  };

  const handleReset = () => {
    setEstructura(initialValues.estructura);
    setMaterial(initialValues.material);
    setAncho(initialValues.ancho);
    setAlto(initialValues.alto);
    setLargo(initialValues.largo);
    setCerramiento(initialValues.cerramiento);
    setPorcentaje(initialValues.cerramiento);
    setKm(initialValues.km);
    setResultado(initialValues.resultado);
    setCliente(initialValues.cliente);
    setDescripcion(initialValues.descripcion);
    setImporteTotal(initialValues.importeTotal);
    setMateriales(initialValues.materiales);
    setFormasPago(initialValues.formaDePago);
    setIncluyeIva(initialValues.incluyeIva);
  };

  return (
    <div>
      <h2>Calculadora de Costos</h2>
      <Form
        estructura={estructura}
        setEstructura={setEstructura}
        material={material}
        setMaterial={setMaterial}
        ancho={ancho}
        setAncho={setAncho}
        largo={largo}
        setLargo={setLargo}
        alto={alto}
        setAlto={setAlto}
        cerramiento={cerramiento}
        setCerramiento={setCerramiento}
        tipoCambio={tipoCambio}
        setTipoCambio={setTipoCambio}
        porcentaje={porcentaje}
        setPorcentaje={setPorcentaje}
        km={km}
        setKm={setKm}
        calcularCosto={calcularCosto}
        cliente={cliente}
        setCliente={setCliente}
        techoColor={techoColor}
        setTechoColor={setTechoColor}
        lateralesColor={lateralesColor}
        setLateralesColor={setLateralesColor}
        chapaColor={chapaColor}
        setChapaColor={setChapaColor}
        incluyeIva={incluyeIva}
        setIncluyeIva={setIncluyeIva}
      />
      <Resultado resultado={resultado} />
      <VistaPrevia
        cliente={cliente}
        setCliente={setCliente}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        importeTotal={importeTotal}
        setImporteTotal={setImporteTotal}
        materiales={materiales}
        setMateriales={setMateriales}
        formasPago={formasPago}
        setFormasPago={setFormasPago}
      />
      <PDF
        cliente={cliente}
        descripcion={descripcion}
        importeTotal={importeTotal}
        materiales={materiales}
        formasPago={formasPago}
        km={km}
        incluyeIva={incluyeIva}
      />
      <div className="buttons-containers">
        <button
          className="generatePreview-btn"
          onClick={handleReset}>
          Resetear vista
        </button>
        <button
          className="generatePDF-btn"
          onClick={handleConvertPDF}>
          Convertir en PDF
        </button>
      </div>
    </div>
  );
};

export default App;
