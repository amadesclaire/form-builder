function responseFormBuilder(form) {
  return {
    form,
    response: {},

    initializeResponse() {
      this.form.fields.forEach((field) => {
        if (field.type === "checkbox") {
          this.response[field.question] = [];
        } else {
          this.response[field.question] = "";
        }
      });
    },

    submitResponse() {
      console.log(this.response);

      fetch(`/form/${this.form.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.response),
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log("Response submitted successfully:", data);
        })
        .catch((error) => {
          console.error("Error submitting response:", error);
        });
    },
  };
}

globalThis.responseFormBuilder = responseFormBuilder;
