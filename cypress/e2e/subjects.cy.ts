// Uses NIN11 (Negocios Internacionales) pensum.
// Period 1 has all no-prerequisite subjects.
// Period 2 has MAT121 (requires MAT010), ESP106 (requires ESP101), etc.
// Chain for cascade test: MAT010 -> MAT121 -> MAT131

describe("Subject related tests", () => {
  beforeEach(() => {
    cy.selectCareer("NIN11");
    // Clear localStorage to start fresh each test
    cy.clearLocalStorage();
    cy.reload();
    cy.contains("Informacion").should("be.visible");
  });

  it("Select a single subject (MAT010 enables MAT121)", () => {
    // MAT121 requires MAT010 — should be disabled initially
    cy.contains("MAT121").closest("tr").should("have.attr", "data-disabled", "true");

    // Select MAT010
    cy.contains("MAT010").closest("tr").click();
    cy.contains("MAT010").closest("tr").should("have.attr", "data-selected", "true");

    // MAT121 should now be enabled
    cy.contains("MAT121").closest("tr").should("have.attr", "data-disabled", "false");
  });

  it("Deselect a single subject", () => {
    // Select MAT010
    cy.contains("MAT010").closest("tr").click();
    cy.contains("MAT010").closest("tr").should("have.attr", "data-selected", "true");

    // Deselect MAT010
    cy.contains("MAT010").closest("tr").click();
    cy.contains("MAT010").closest("tr").should("have.attr", "data-selected", "false");
  });

  it("Select multiple subjects at once (select all checkbox)", () => {
    cy.get("[data-testid='select-all-checkbox']:first").click();

    // All rows in cuatrimestre 1 should be selected
    cy.contains("Cuatrimestre 1")
      .closest(".rounded-md")
      .find("tbody tr")
      .should("have.attr", "data-selected", "true");
  });

  it("Deselecting a subject cascade-deselects its dependents", () => {
    // Build chain: MAT010 -> MAT121 -> MAT131
    cy.contains("MAT010").closest("tr").click();
    cy.contains("MAT121").closest("tr").click();
    cy.contains("MAT131").closest("tr").click();

    // Deselect MAT010 — should remove MAT121 and MAT131 too
    cy.contains("MAT010").closest("tr").click();

    cy.contains("MAT121").closest("tr").should("have.attr", "data-disabled", "true");
    cy.contains("MAT131").closest("tr").should("have.attr", "data-disabled", "true");
  });

  it("Clicking a disabled subject shows prerequisite alert dialog", () => {
    // MAT121 requires MAT010, so it is disabled initially
    cy.contains("MAT121").closest("tr").click();
    cy.get("[role='alertdialog']").should("be.visible");
  });

  it("Shows correct credit count after selecting subjects", () => {
    cy.get("[data-testid='select-all-checkbox']:first").click();

    let sumOfCredits = 0;
    cy.contains("Cuatrimestre 1")
      .closest(".rounded-md")
      .find("tbody tr[data-selected='true'] td:nth-of-type(4)")
      .then(($cells) => {
        $cells.each((_, el) => {
          sumOfCredits += Number(el.innerText.trim());
        });
        cy.get("[data-testid='credits-count']").should(
          "contain.text",
          sumOfCredits
        );
      });
  });

  it("Shows correct subject count after selecting subjects", () => {
    cy.get("[data-testid='select-all-checkbox']:first").click();

    cy.get("[data-testid='subjects-count']")
      .invoke("text")
      .then((text) => {
        const count = Number(text.trim());
        cy.get("tbody tr[data-selected='true']").should("have.length", count);
      });
  });
});
