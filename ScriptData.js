$(function () {
  const $form = $("#dataForm");
  const $inputs = $form.find("input");
  const $tableBody = $("#dataTable tbody");
  const $modal = $("#alertModal");
  const $resetModal = $("#resetModal");
  const $modalText = $("#modalText");
  const $tabTriggers = $("#tabMenu button");
  const $resetAllBtn = $("#resetAllBtn");
  const $searchInput = $("#searchInput");
  const $searchResults = $("#searchResults");
  const $btnGoToSearch = $("#btnGoToSearch");

  let savedData = JSON.parse(localStorage.getItem("dataUsers")) || [];
  let editingId = null;

  renderTable();

  function showModal(message) {
    $modalText.text(message);
    $modal.addClass("show");
  }

  $("#closeModal, #cancelReset").on("click", function () {
    $(this).closest(".modal").removeClass("show");
  });

  function switchTab(id) {
    const $btn = $tabTriggers.filter(`[data-bs-target="#${id}"]`);
    const tab = bootstrap.Tab.getInstance($btn[0]) || new bootstrap.Tab($btn[0]);
    tab.show();
  }

  $("#btnAddData").on("click", () => {
    $form[0].reset();
    editingId = null;
    switchTab("formTab");
    $inputs.eq(0).focus();
  });

  $btnGoToSearch.on("click", () => {
    switchTab("searchTab");
    $searchInput.focus();
    performSearch($searchInput.val().trim());
  });

  $form.on("submit", function (e) {
    e.preventDefault();
    const [nama, usia, berat, tinggi] = $inputs.map((_, el) => $(el).val().trim()).get();
    if (!nama || !usia || !berat || !tinggi) return showModal("Isi semua data yaa!");
    const item = { id: editingId || Date.now(), nama, usia, berat, tinggi };

    if (editingId) {
      const idx = savedData.findIndex(d => d.id === editingId);
      savedData[idx] = item;
    } else {
      savedData.push(item);
    }

    editingId = null;
    localStorage.setItem("dataUsers", JSON.stringify(savedData));
    renderTable();
    $form[0].reset();
    switchTab("tableTab");
  });

  $resetAllBtn.on("click", () => {
    if (savedData.length) $resetModal.addClass("show");
  });

  $("#confirmReset").on("click", () => {
    savedData = [];
    localStorage.removeItem("dataUsers");
    renderTable();
    $resetModal.removeClass("show");
  });

  function renderTable() {
    $tableBody.empty();
    savedData.forEach((item, i) => {
      $tableBody.append(`
        <tr data-id="${item.id}">
          <td>${i + 1}</td>
          <td>${item.nama}</td>
          <td>${item.usia}</td>
          <td>${item.berat}</td>
          <td>${item.tinggi}</td>
          <td>
            <button class="btn btn-sm edit-btn">Edit</button>
            <button class="btn btn-sm delete-btn">Hapus</button>
          </td>
        </tr>
      `);
    });
  }

  $tableBody.on("click", ".edit-btn", function () {
    const id = +$(this).closest("tr").data("id");
    const item = savedData.find(d => d.id === id);
    if (!item) return;

    $("#nama").val(item.nama);
    $("#usia").val(item.usia);
    $("#berat").val(item.berat);
    $("#tinggi").val(item.tinggi);

    editingId = id;
    switchTab("formTab");
    $inputs.eq(0).focus();
  });

  $tableBody.on("click", ".delete-btn", function () {
    const id = +$(this).closest("tr").data("id");
    savedData = savedData.filter(d => d.id !== id);
    localStorage.setItem("dataUsers", JSON.stringify(savedData));
    renderTable();
    if (editingId === id) {
      editingId = null;
      $form[0].reset();
    }
  });

  $inputs.on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const idx = $inputs.index(this);
      if (idx + 1 < $inputs.length) {
        $inputs.eq(idx + 1).focus();
      } else {
        const allFilled = $inputs.toArray().every(i => $(i).val().trim());
        allFilled ? $form.submit() : showModal("Isi semua data yaa!");
      }
    }
  });

  function performSearch(query) {
    $searchResults.empty();

    if (!query) return;

    const results = savedData.filter(item =>
      item.nama.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      $searchResults.append(`<tr><td colspan="5" class="text-center">Data tidak ditemukan</td></tr>`);
      return;
    }

    results.forEach((item, i) => {
      $searchResults.append(`
        <tr>
          <td>${i + 1}</td>
          <td>${item.nama}</td>
          <td>${item.usia}</td>
          <td>${item.berat}</td>
          <td>${item.tinggi}</td>
        </tr>
      `);
    });
  }

  $searchInput.on("input", function () {
    const query = $(this).val().trim();
    performSearch(query);
  });

  $('#search-tab').on('shown.bs.tab', function () {
    $searchInput.val('');
    $searchResults.empty();
    $searchInput.focus();
  });
});