let count = 1;
let rowBeingEdited = null;

// Tombol Tambahkan / Update
$("#addButton").on("click", function () {
  const input = document.getElementById("inputText");
  const inputText = input.value.trim();
  if (inputText === "") return;

  const tableBody = document.getElementById("tableBody");

  if (rowBeingEdited) {
    rowBeingEdited.cells[1].textContent = inputText;
    rowBeingEdited = null;
    $("#addButton").text("Tambahkan"); // jQuery
    input.value = "";
    return;
  }

  const row = document.createElement("tr");

  const noCell = document.createElement("td");
  noCell.textContent = count++;

  const textCell = document.createElement("td");
  textCell.textContent = inputText;

  const actionCell = document.createElement("td");

  // Tombol Edit
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "editBtn";
  $(editBtn).on("click", function () {
    $("#inputText").val(textCell.textContent);
    $("#addButton").text("Update");
    rowBeingEdited = row;
  });

  // Tombol Hapus
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Hapus";
  deleteBtn.className = "deleteBtn";
  $(deleteBtn).on("click", function () {
    $(row).remove();
    updateNumbers();

    if (rowBeingEdited === row) {
      rowBeingEdited = null;
      $("#addButton").text("Tambahkan");
      $("#inputText").val("");
    }
  });

  actionCell.appendChild(editBtn);
  actionCell.appendChild(deleteBtn);

  row.appendChild(noCell);
  row.appendChild(textCell);
  row.appendChild(actionCell);

  tableBody.appendChild(row);

  input.value = "";
});

// Reset semua data
$("#resetButton").on("click", function () {
  if (confirm("Yakin ingin menghapus semua data?")) {
    $("#tableBody").empty();
    count = 1;
    rowBeingEdited = null;
    $("#addButton").text("Tambahkan");
    $("#inputText").val("");
  }
});

// Update nomor urut
function updateNumbers() {
  count = 1;
  $("#tableBody tr").each(function () {
    $(this).find("td:first").text(count++);
  });
}
