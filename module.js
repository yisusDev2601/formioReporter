class FormioTableConstructor {
  constructor(components = [], idContainerConstructor) {
    this.components = components;
    this.idContainerConstructor = idContainerConstructor;
    this.selectedComponents = [];
    this.rows = []; // Aquí almacenarás los datos a mostrar
    this.headers = []; // Para almacenar los nombres de los headers
    this.dataAccessMethods = []; // Para almacenar los métodos de acceso a la data
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
    this.renderOptions();
  }

  createContainerMain() {
    const containerMain = document.getElementById(this.idContainerConstructor);
    containerMain.innerHTML = '<div class="mb-4"><h1>Generador de tablas</h1></div>';
    this.createModal();
    this.renderOptions();

    const button = document.createElement('button');
    button.innerText = 'Configurar tabla';
    button.className = 'btn btn-primary';
    button.onclick = () => this.openModal();
    containerMain.appendChild(button);
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal fade';
    this.modal.style.display = 'none';
    this.modal.setAttribute('tabindex', '-1');

    this.modal.innerHTML = `
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Selecciona Componentes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Visible</th>
                  <th>Header Name</th>
                  <th>Data Access Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="components-table-body"></tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button id="submit-selection" class="btn btn-success">Generar Tabla</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.buttonGenerate = document.getElementById('submit-selection');
    this.setupTableEvents();
  }

  setupTableEvents() {
    const tableBody = document.getElementById('components-table-body');

    // Manejar el evento de submit
    document.getElementById('submit-selection').onclick = () => {
      this.selectedComponents = [];
      this.headers = [];
      this.dataAccessMethods = [];

      tableBody.querySelectorAll('tr').forEach(row => {
        const checkbox = row.querySelector('.visibility-toggle');
        const headerName = row.querySelector('.header-name').value;
        const dataAccess = row.querySelector('.data-access').value;

        if (checkbox.checked) {
          this.selectedComponents.push(row.dataset.key);
          this.headers.push(headerName);
          this.dataAccessMethods.push(dataAccess);
        }
      });      
      this.closeModal();
    };

    // Resto de eventos (eliminar, mover)
    tableBody.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-remove')) {
        event.target.closest('tr').remove();
      }

      if (event.target.classList.contains('btn-up')) {
        const row = event.target.closest('tr');
        const prevRow = row.previousElementSibling;
        if (prevRow) {
          tableBody.insertBefore(row, prevRow);
        }
      }

      if (event.target.classList.contains('btn-down')) {
        const row = event.target.closest('tr');
        const nextRow = row.nextElementSibling;
        if (nextRow) {
          tableBody.insertBefore(nextRow, row);
        }
      }
    });
  }

  renderOptions() {
    const data_components = `
      ${this.components.map(component => `
        <tr data-key="${component.key}">
          <td><input type="checkbox" class="visibility-toggle" checked /></td>
          <td><input type="text" class="header-name" value="${component.label}" /></td>
          <td><input type="text" class="data-access" value="data.${component.key}" /></td>
          <td>
            <button class="btn btn-danger btn-remove">Eliminar</button>
            <button class="btn btn-primary btn-up">↑</button>
            <button class="btn btn-primary btn-down">↓</button>
          </td>
        </tr>
      `).join('')}
    `;

    document.getElementById('components-table-body').innerHTML = data_components;
  }
  openModal() {
    const modalElement = new bootstrap.Modal(this.modal);
    modalElement.show();
  }

  closeModal() {
    const modalElement = bootstrap.Modal.getInstance(this.modal);
    modalElement.hide();
  }
}

window.FormioTableConstructor = FormioTableConstructor;
