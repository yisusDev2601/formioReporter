class FormioTableConstructor {
  constructor(components = [], idContainer) {
    this.components = components;
    this.idContainer = idContainer;
    this.selectedComponents = [];
    this.rows = []; // Aquí almacenarás los datos a mostrar
    this.createContainerMain();
  }

  updateComponents(newComponents) {
    const extractInputComponents = (components) => {
      let inputComponents = [];

      components.forEach(comp => {
        if (comp.input && comp.type !== 'button' && comp.key !== 'submit') {
          inputComponents.push(comp);
        }
        if (comp.components) {
          inputComponents = inputComponents.concat(extractInputComponents(comp.components));
        }
      });

      return inputComponents;
    };

    this.components = extractInputComponents(newComponents);
    console.log(this.components);
    this.renderOptions();
  }

  createContainerMain() {
    const containerMain = document.getElementById(this.idContainer);
    containerMain.innerHTML = '<div class="mb-4"><h1>Generador de tablas</h1></div>';

    this.createModal();
    this.renderOptions();

    const button = document.createElement('button');
    button.innerText = 'Abrir Modal';
    button.className = 'btn btn-primary';
    button.onclick = () => this.openModal();
    containerMain.appendChild(button);
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal fade';
    this.modal.style.display = 'none';
    this.modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Selecciona Componentes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <select class="js-example-basic-multiple form-select" multiple="multiple" id="select-data"></select>
            <div class="mt-3">
              <label for="headers">Headers</label>
              <input type="text" id="headers" class="form-control" />
              <label for="rows" class="mt-2">Rows</label>
              <input type="text" id="rows" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button id="submit-selection" class="btn btn-success">Generar Tabla</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);

    document.getElementById('submit-selection').onclick = () => {
      this.selectedComponents = Array.from(document.getElementById('select-data').selectedOptions)
        .map(option => option.value);
      this.renderTable();
      this.closeModal();
    };
  }

  openModal() {
    const modalElement = new bootstrap.Modal(this.modal);
    modalElement.show();
  }

  closeModal() {
    const modalElement = bootstrap.Modal.getInstance(this.modal);
    modalElement.hide();
  }

  renderOptions() {
    const selectContainer = document.getElementById('select-data');
    // selectContainer.innerHTML = ''; // Limpiar el contenedor previo

    this.components.forEach(component => {
      const option = document.createElement('option');
      option.value = component.key;
      option.textContent = component.label;
      selectContainer.appendChild(option);
    });

    // Inicializa Select2
    $(selectContainer).select2({
      placeholder: "Selecciona componentes",
      allowClear: true
    });
  }

  renderTable() {
    const containerMain = document.getElementById(this.idContainer);
    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = '';

    // Crear tabla
    const table = document.createElement('table');
    table.className = 'table table-striped';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Crear encabezado
    const headerRow = document.createElement('tr');
    this.selectedComponents.forEach(key => {
      const th = document.createElement('th');
      th.innerText = this.components.find(comp => comp.key === key)?.label || key;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Renderizar datos
    this.renderDataTable(tbody);

    table.appendChild(tbody);
    tableContainer.appendChild(table);
    containerMain.appendChild(tableContainer);
  }

  renderDataTable(tbody) {
    tbody.innerHTML = ''; // Limpiar el cuerpo previo
    this.rows.forEach(row => {
      const tr = document.createElement('tr');
      this.selectedComponents.forEach(key => {
        const td = document.createElement('td');
        td.innerText = row[key] || ''; // Mostrar el dato o vacío si no existe
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
}

window.FormioTableConstructor = FormioTableConstructor;
