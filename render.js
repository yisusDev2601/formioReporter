class TableRenderer {
  constructor(containerId) {
    this.containerId = containerId;
    this.tableElement = null; // Almacena la referencia a la tabla
  }

  renderTable(headers, rows, dataAccessMethods) {
    const containerMain = document.getElementById(this.containerId);
    
    containerMain.innerHTML = '';

    // Crear nueva tabla
    this.tableElement = document.createElement('table');
    this.tableElement.className = 'table table-striped';
    
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Crear encabezado
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
      const th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    this.tableElement.appendChild(thead);

    // Renderizar datos
    this.renderDataTable(tbody, rows, dataAccessMethods);
    
    this.tableElement.appendChild(tbody);
    containerMain.appendChild(this.tableElement);
  }

  renderDataTable(tbody, rows, dataAccessMethods) {
    tbody.innerHTML = ''; // Limpiar el cuerpo previo
    rows.forEach(row => {
      const tr = document.createElement('tr');
      dataAccessMethods.forEach(accessMethod => {
        const td = document.createElement('td');
        const value = this.evaluateAccessMethod(row, accessMethod); // Usar la función para obtener el valor
        td.innerText = value !== null ? value : ''; // Mostrar el dato o vacío si no existe
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  evaluateAccessMethod(data, accessMethod) {
    try {
      return eval(`(${JSON.stringify(data)}).${accessMethod}`);
    } catch (e) {
      console.error("Error evaluating access method:", e);
      return null; // O cualquier valor por defecto que desees
    }
  }
}

window.TableRenderer = TableRenderer;