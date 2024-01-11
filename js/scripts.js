(function (Drupal) {

  Drupal.behaviors.jsvalidate = {
    attach: function () {
      once("helper__jsvalidate", "[data-jsvalidate]", document.body).forEach(
        (input) => {
          input.addEventListener("blur", (e) => {
            const { target } = e;

            // Skips validation to fields that are empty and not required
            if (!target.value && !e.target.hasAttribute("required")) return;

            // Clean old errors
            input
              .closest("label")
              .querySelectorAll(".field-error")
              .forEach((msg) => msg.remove());

            // Write Error
            var error_msg = `<div class="field-error text-danger"><b>${target.validationMessage}</b></div>`;

            if (!target.reportValidity()) {
              target
                .closest("label [data-jsvalidate]")
                .insertAdjacentHTML("beforebegin", error_msg);
              target.setAttribute("data-jsvalidate", "error");
            } else target.setAttribute("data-jsvalidate", "success");
          });
        }
      );
    },
  };

  Drupal.behaviors.formjsvalidate = {
    attach: function () {
      once("helper__jsvalidate", "form[novalidate]", document.body).forEach(
        (form) => {
          form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Clean old errors
            form
              .querySelectorAll(".field-error")
              .forEach((msg) => msg.remove());

            var badfields = form.querySelectorAll(":invalid");
            if (!badfields.length) form.submit();

            badfields.forEach((field) => {
              // Write Error
              var error_mgs = `<div class="field-error text-danger"><b>${field.validationMessage}</b></div>`;
              field.insertAdjacentHTML("beforebegin", error_mgs);
              field.checkValidity();
            });
          });
        }
      );
    },
  };

  Drupal.behaviors.dismissibleAlerts = {
    attach: function () {
      once(
        "helper__dismissiblealerts",
        "[data-bs-dismiss='alert']",
        document.body
      ).forEach((closeButton) => {
        const alert = closeButton.closest("[role='alert']");
        const id = "alertdismiss-" + alert.getAttribute("id");

        // First check if alert has been dismissed in the past
        if (localStorage.getItem(id) || sessionStorage.getItem(id))
          alert.remove();

        // Then have browser remember new dismissed alerts
        closeButton.addEventListener("click", (e) => {
          var howlong = e.target.getAttribute("data-dismiss-for");
          if (howlong) {
            if (howlong === "good")
              localStorage.setItem(id, true);
            else sessionStorage.setItem(id, true);
          }
        });
      });
    },
  };

  Drupal.behaviors.comboBox = {
    attach: function () {
      once("helper__combobox", ".combobox", document.body).forEach((cmbx) => {
        const showlist = (_) => {
          cmbx.firstElementChild.style.outline = _
            ? "5px solid var(--bs-info)"
            : "";
          if (_) cmbx.lastElementChild.classList.remove("d-none");
          else cmbx.lastElementChild.classList.add("d-none");
        };

        const filterlist = (a, b) => {
          a.forEach((_) => {
            var exp = _.innerText.toLowerCase().includes(b.toLowerCase());
            _.style.display = exp ? "block" : "none";
          });
        };

        document.body.addEventListener("click", (e) =>
          showlist(cmbx.contains(e.target))
        );
        document.body.addEventListener("keyup", (e) => {
          if (e.key == "Escape") showlist(false);
        });

        // Handles options filtering
        const input = cmbx.querySelector("input");
        const options = cmbx.querySelectorAll("a");
        const clear = cmbx.querySelector("button i:first-child");
        input.addEventListener("keyup", (e) => {
          if (e.target.value.length) clear.classList.remove("d-none");
          else clear.classList.add("d-none");

          filterlist(options, e.target.value);
        });

        // Handles clearing the input
        clear.addEventListener("click", (e) => {
          input.value = "";
          filterlist(options, "");
        });

        // Handles Options
        options.forEach((option) => {
          option.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            input.value = e.target.innerText;
            showlist(false);
          });
        });
      });
    },
  };

  Drupal.behaviors.anchorLink = {
    attach: function (context) {
      if (context.querySelector("article") == null) return;
      // Produce an anchor icon for all the headings with class ".anchor"
      once("helper__anchorLink", ".anchor", document.body).forEach((anchorElement) => {
        let innerText = anchorElement.innerText;
        let anchor = innerText.replace(/\s+/g, '-').toLowerCase();
        anchorElement.setAttribute("id", anchor)

        anchorElement.innerHTML += `<a href="#${anchor}">#</a>`;
      });
    },
  };

  Drupal.behaviors.redirectBanner = {
    attach: function (context) {
      once("helper__anchorLink", "#redirect-banner", document.body).forEach((redirBanner) => {
        let redirect = window.location.href.includes("redirected");
        if (redirect) redirBanner.classList.remove("d-none");
      });
    },
  };

  Drupal.behaviors.bootstrapTable = {
    attach: function (context) {

      once("helper__bsTable", "[data-toggle='table']", document.body).forEach((table) => {
        //const tableAccent = table.querySelector("thead").getAttribute("class").split("-")[1];
        const thresh = 1120;
        let card = false;

        // Initialize the table as jQuery element
        // Unfortunately this is still needed as the plugin requires jQuery
        // @see: https://github.com/wenzhixin/bootstrap-table/issues/4796
        let $table = jQuery(table);

        // Localizations
        $table.bootstrapTable({
          formatSearch: () => "Keyword filter"
        });

        // Default Classess (this removes the table-hover which is unwanted)
        $table.bootstrapTable('refreshOptions', {
          classes: $table.attr("class").replace("table-hover", "")
        })

        // Automatically handles responsive table layout
        jQuery(window).on("resize", () => {
          let w = window.innerWidth;
          console.log(w, card);
          if (w < thresh && !card) {
            $table.bootstrapTable("toggleView");
            card = true;
          } else if (w >= thresh && card) {
            $table.bootstrapTable("toggleView");
            card = false;
          }
        });

        // Automatically set table/card view on page load
        if (window.innerWidth < 1120 && !card) {
          $table.bootstrapTable("toggleView");
          card = true;
        }
      });
    },
  };

  Drupal.behaviors.tooltips = {
    attach: function (context) {
      once("helper__bsTable", "[data-bs-toggle='tooltip']", document.body).forEach((tooltip) => new bootstrap.Tooltip(tooltip))
    }
  }

})(Drupal);