import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';  // Importar SweetAlert

function App() {
  const [productos, setProductos] = useState([]);
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [deshabilitado, setDeshabilitado] = useState(false);

  useEffect(() => {
    const sheetdbUrl = 'https://sheetdb.io/api/v1/erfd2zxfru75c';

    axios.get(sheetdbUrl)
      .then(response => {
        const productosNoMarcados = response.data.filter(producto => producto.estado === '0');
        setProductos(productosNoMarcados);
      })
      .catch(error => console.error('Error al obtener datos de SheetDB:', error));
  }, []);

  const handleSeleccionar = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleConfirmar = () => {
    if (!correoUsuario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa tu dirección de correo electrónico.',
      });
      return;
    }

    const updatedProducto = {
      estado: "1",
      correo: correoUsuario
    };

    const sheetdbUrl = `https://sheetdb.io/api/v1/erfd2zxfru75c/id/${productoSeleccionado.id}`;

    axios.patch(sheetdbUrl, updatedProducto)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Regalo seleccionado y almacenado correctamente.',
        });
        setProductos(productos.filter(prod => prod.id !== productoSeleccionado.id));
        setProductoSeleccionado(null);
        setCorreoUsuario("");
        setDeshabilitado(true); // Deshabilitar la lista después de la confirmación
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el regalo.',
        });
        console.error('Error al actualizar el regalo:', error)
      });
  };

  return (
    <div>
      <h1>Por favor <b>leer</b> Selecciona un Regalo👶 <br /> Recuerda que sólo puedes escoger UN regalo <br /> No se pueden deshacer los cambios.  ​</h1>
      {productoSeleccionado ? (
        <table>
          <tr >
            <td colSpan={2}>
              <h2>Has seleccionado: {productoSeleccionado.producto}</h2>
              <br />
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={correoUsuario}
                onChange={e => setCorreoUsuario(e.target.value)}
                disabled={deshabilitado}
              />

            </td>

          </tr>
          <tr>
            <td>
              <button onClick={handleConfirmar} disabled={deshabilitado}>
                <FontAwesomeIcon icon={faCheckCircle} /> Confirmar Selección
              </button>
            </td>
            <td>
              <button id='btn-cancelar' onClick={() => setProductoSeleccionado(null)} disabled={deshabilitado}>
                <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
              </button>
            </td>
          </tr>



        </table>
      ) : (
        <table>
          <thead>
            <th>Regalo</th>
            <th>Escoge presionando el botón "Seleccionar"</th>
          </thead>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.producto}</td>
              <td>
                <button onClick={() => handleSeleccionar(producto)} disabled={deshabilitado}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default App;
