/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Resultado } from "./components/Resultado";
import { convertPDF } from "./utils/jsPDF";
import { Form } from "./components/Form";
/* import { copiarPrecio } from "./utils/copiarPrecio";
 */ import { VistaPrevia } from "./components/VistaPrevia";
import { PDF } from "./components/PDF";
import { interp1d } from "./utils/calculadorDeArea";
import { priceListGalpon, priceListTinglado } from "./utils/precios";
import { materialesMap } from "./utils/materiales";

const App = () => {
  const [estructura, setEstructura] = useState("Galpón");
  const [material, setMaterial] = useState("Hierro Torsionado");
  const [ancho, setAncho] = useState(15);
  const [largo, setLargo] = useState(25);
  const [alto, setAlto] = useState(5);
  const [cerramiento, setCerramiento] = useState(4.5);
  const [tipoCambio, setTipoCambio] = useState(1);
  const [porcentaje, setPorcentaje] = useState(3);
  const [km, setKm] = useState(0);
  const [resultado, setResultado] = useState(null);
  /*   const [outputToCopy, setOutputToCopy] = useState("");
   */ const [cliente, setCliente] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [importeTotal, setImporteTotal] = useState(0);
  const [materiales, setMateriales] = useState("");
  const [formasPago, setFormasPago] = useState(`
      Pago contado;
      Cheques a 0, 30, 60, 90 días (sin interés);
      Cheques a 150 días (8% de interés);
      Crédito bancario por medio de factura proforma
    `);
  const [lateralesColor, setLateralesColor] = useState(false);
  const [techoColor, setTechoColor] = useState(false);

  const calcularCosto = (e) => {
    e.preventDefault();
    const areaPiso = ancho * largo;
    const perimetro = 2 * (ancho + largo);
    const areaParedes = perimetro * alto;
    const areaTotal = areaPiso + areaParedes;

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

    //CALCULO DE COSTO DE CERRAMIENTO TENIENDO EN CUENTA EL TIPO DE ESTRUCTURA Y EL TIPO DE CHAPA
    const costoCerramiento =
      estructura === "Tinglado"
        ? 0
        : lateralesColor
        ? Math.abs(cerramiento) * perimetro * 27 * 1.6
        : Math.abs(cerramiento - 4.5) *
          perimetro *
          27 *
          (cerramiento > 4.5 ? 1 : -1);

    console.log(costoCerramiento);

    //CAMBIO DE COSTO TECHO POR CHAPA A COLOR
    const costoPiso = techoColor
      ? areaPiso * precioPorMetro * 1.6
      : areaPiso * precioPorMetro;
    let precioTotal = costoPiso + costoColumnas + costoCerramiento;

    const costoKm = km * (areaPiso <= 300 ? 1.8 : areaPiso <= 800 ? 2.1 : 4.2);
    const costoKmArs = costoKm * tipoCambio;

    precioTotal += costoKm;

    const precioTotalArs = precioTotal * tipoCambio;
    const precioFinalArs = precioTotalArs * (1 + porcentaje / 100);

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
    /*     setOutputToCopy(`${precioFinalArsFormateado}`);
     */
  };

  const generatePreview = () => {
    const newDescripcion =
      estructura === "Galpón"
        ? `${estructura} de ${largo}mts x ${ancho}mts x ${alto}mts de altura libre con ${cerramiento}mts cerramiento de chapa en los laterales.`
        : `${estructura} de ${largo}mts x ${ancho}mts x ${alto}mts de altura libre`;

    let newMateriales = materialesMap[estructura]?.[material];

    // Modifica la descripción de materiales si hay color en techo o laterales
    if (techoColor) {
      newMateriales = newMateriales.replace("Sincalum", "Color");
    }
    if (lateralesColor && estructura === "Galpón") {
      newMateriales = newMateriales.replace("Sincalum", "Color");
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

  useEffect(() => {
    if (resultado) {
      generatePreview();
    }
  }, [resultado]);

  const handleReset = () => {
    setEstructura("Galpón");
    setMaterial("Hierro Torsionado");
    setAncho(15);
    setAlto(5);
    setLargo(25);
    setCerramiento(4.5);
    setPorcentaje(3);
    setKm(0);
    setResultado(null);
    /*     setOutputToCopy("");
     */ setCliente("");
    setDescripcion("");
    setImporteTotal("");
    setMateriales("");
    setFormasPago(`
        Pago contado;
        Cheques a 0, 30, 60, 90 días (sin interés);
        Cheques a 150 días (8% de interés);
        Crédito bancario por medio de factura proforma
      `);
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
      />
      {/*      <button
        className="copy-btn"
        onClick={() => copiarPrecio(outputToCopy)}>
        Copiar Precio Final
      </button> */}
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
