class FormioBuilderCustom {
  constructor(initial_data = [], containerBuilderId, tableConstructor) {
    this.initial_data = initial_data;
    this.containerBuilderId = containerBuilderId;
    this.components = [];
    this.tableConstructor = tableConstructor; // Referencia a FormioTableConstructor

    this.generateForm();
  }

  generateForm() {
    Formio.builder(document.getElementById(this.containerBuilderId), this.initial_data).then((form) => {
      this.form = form;

      // Fetch initial components
      this.updateComponents();

      // Listen for changes
      form.on("change", () => {
        this.updateComponents();
      });
    });
  }

  updateComponents() {
    this.components = this.form.schema.components || [];
    this.tableConstructor.updateComponents(this.components); // Actualiza la tabla con los nuevos componentes
  }
}

window.FormioBuilderCustom = FormioBuilderCustom;