$(document).ready(function () {
  const $form = $("#dataForm");
  const $inputs = $form.find("input");
  const $tableBody = $("#dataTable tbody");
  const $resetAllBtn = $("#resetAllBtn");
  const $modal = $("#alertModal");
  const $resetModal = $("#resetModal");
  const $modalText = $("#modalText");
  const $tabTriggers = $("#tabMenu button");

  let nomorUrut = 1;
  let rowBeingEdited = null;
  let savedData = JSON.parse(localStorage.getItem("dataUsers")) || [];

  if (savedData.length > 0) {
    savedData.forEach(item => tambahBarisDariStorage(item));
  }

  function showModal(message) {
    $modalText.text(message);
    $modal.addClass("show");
  }

  $("#closeModal").on("click", () => $modal.removeClass("show"));
  $("#cancelReset").on("click", () => $resetModal.removeClass("show"));

  function switchTab(tabId) {
    const $trigger = $tabTriggers.filter(`[data-bs-target="#${tabId}"]`);
    if ($trigger.length) {
      const tabInstance = bootstrap.Tab.getInstance($trigger[0]) || new bootstrap.Tab($trigger[0]);
      tabInstance.show();
    }
  }

  $("#btnAddData").on("click", function () {
    $form[0].reset();
    rowBeingEdited = null;
    switchTab("formTab");
    $inputs.eq(0).focus();
  });

  window.editData = function (btn) {
    const $row = $(btn).closest("tr");
    const index = parseInt($row.attr("data-index"));
    const item = savedData[index];

    $("#nama").val(item.nama);
    $("#usia").val(item.usia);
    $("#berat").val(item.berat);
    $("#tinggi").val(item.tinggi);

    rowBeingEdited = $row;
    switchTab("formTab");
    $inputs.eq(0).focus();
  };

  $form.on("submit", function (e) {
    e.preventDefault();
    const nama = $("#nama").val().trim();
    const usia = $("#usia").val().trim();
    const berat = $("#berat").val().trim();
    const tinggi = $("#tinggi").val().trim();

    if (!nama || !usia || !berat || !tinggi) {
      return showModal("Isi semua data yaa!");
    }

    const dataItem = { nama, usia, berat, tinggi };

    if (rowBeingEdited) {
      const index = parseInt(rowBeingEdited.attr("data-index"));
      savedData[index] = dataItem;
      rowBeingEdited = null;
    } else {
      savedData.push(dataItem);
    }

    localStorage.setItem("dataUsers", JSON.stringify(savedData));
    updateTableFromStorage();
    $form[0].reset();
    switchTab("tableTab");
    $("#btnAddData").focus();
  });

  $resetAllBtn.on("click", function () {
    if (savedData.length > 0) {
      $resetModal.addClass("show");
    }
  });

  $("#confirmReset").on("click", function () {
    savedData = [];
    localStorage.removeItem("dataUsers");
    updateTableFromStorage();
    $resetModal.removeClass("show");
  });

  function tambahBarisDariStorage(item) {
    const index = savedData.indexOf(item);
    const row = `
      <tr data-index="${index}">
        <td>${nomorUrut}</td>
        <td>${item.nama}</td>
        <td>${item.usia}</td>
        <td>${item.berat}</td>
        <td>${item.tinggi}</td>
        <td>
          <button class="edit-button btn btn-sm" onclick="editData(this)">Edit</button>
          <button class="delete-button btn btn-sm" onclick="hapusBaris(this)">Hapus</button>
        </td>
      </tr>
    `;
    $tableBody.append(row);
    nomorUrut++;
  }

  function updateTableFromStorage() {
    $tableBody.empty();
    nomorUrut = 1;
    savedData.forEach(item => tambahBarisDariStorage(item));
  }

  window.hapusBaris = function (btn) {
    const $row = $(btn).closest("tr");
    const index = parseInt($row.attr("data-index"));
    savedData.splice(index, 1);
    localStorage.setItem("dataUsers", JSON.stringify(savedData));
    updateTableFromStorage();

    if (rowBeingEdited && rowBeingEdited.is($row)) {
      rowBeingEdited = null;
      $form[0].reset();
    }
  };

  $inputs.on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const index = $inputs.index(this);
      const $nextInput = $inputs.eq(index + 1);
      if ($nextInput.length) {
        $nextInput.focus();
      } else {
        const allFilled = $inputs.toArray().every(input => $(input).val().trim() !== "");
        allFilled ? $form.submit() : showModal("Isi semua data yaa!");
      }
    }
  });
});