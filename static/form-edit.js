function formBuilder(initialForm) {
  return {
    form: initialForm,

    optionIndexText(index) {
      return `Option ${index + 1}`;
    },

    hasOptions(field) {
      // Return true for field types that require options
      return ["choose-one", "checkbox", "dropdown", "rating", "range"].includes(
        field.type
      );
    },

    initializeOptions(field) {
      // Initialize options only if the field type requires it
      if (this.hasOptions(field) && !field.options) {
        field.options = [""];
      } else if (!this.hasOptions(field)) {
        delete field.options;
      }
    },

    addField() {
      this.form.fields.push({
        type: "text",
        question: "",
        description: "",
        options: [],
      });
    },

    removeField(index) {
      this.form.fields.splice(index, 1);
    },

    addOption(fieldIndex) {
      this.form.fields[fieldIndex].options.push("");
    },

    removeOption(fieldIndex, optionIndex) {
      this.form.fields[fieldIndex].options.splice(optionIndex, 1);
    },

    submitForm() {
      console.log(this.form);
      // Send the updated form as JSON
      fetch(`/forms/${this.form.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.form),
      })
        .then((response) => {
          if (response.redirected) {
            globalThis.location.href = response.url;
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log("Form updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating form:", error);
        });
    },
  };
}

globalThis.formBuilder = formBuilder;
