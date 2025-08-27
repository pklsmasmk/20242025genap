$(document).ready(function () {
  let count = 1;
  let dataList = [];

  function showNotification(message, type = "info") {
    $("#notification")
      .stop(true, true)
      .text(message)
      .removeClass()
      .addClass(`notification show ${type}`)
      .fadeIn(200)
      .delay(2000)
      .fadeOut(500);
  }

  const savedData = localStorage.getItem("tableData");
  if (savedData) {
    dataList = JSON.parse(savedData);
    dataList.forEach((item) => addRow(item.kegiatan, item.deskripsi, false));
  }

  $("#addBtn").on("click", function () {
    const kegiatan = $("#inputKegiatan").val().trim();
    const deskripsi = $("#inputDeskripsi").val().trim();

    if (kegiatan && deskripsi) {
      addRow(kegiatan, deskripsi);
      $("#inputKegiatan, #inputDeskripsi").val("");
      showNotification("Data berhasil ditambahkan", "success");
    } else {
      showNotification("Mohon isi kedua kolom", "error");
    }
  });

  function addRow(kegiatan, deskripsi, save = true) {
    const newRow = $(`
      <tr>
        <td>${count++}</td>
        <td class="kegiatan-cell">${kegiatan}</td>
        <td class="deskripsi-cell">${deskripsi}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Hapus</button>
        </td>
      </tr>
    `);

    newRow.find(".edit-btn").on("click", function () {
      const row = $(this).closest("tr");
      const kegiatanCell = row.find(".kegiatan-cell");
      const deskripsiCell = row.find(".deskripsi-cell");

      if ($(this).text() === "Edit") {
        kegiatanCell.html(`<input type="text" value="${kegiatanCell.text()}">`);
        deskripsiCell.html(`<input type="text" value="${deskripsiCell.text()}">`);
        $(this).text("Simpan");
      } else {
        const newKegiatan = kegiatanCell.find("input").val().trim();
        const newDeskripsi = deskripsiCell.find("input").val().trim();

        if (newKegiatan && newDeskripsi) {
          kegiatanCell.text(newKegiatan);
          deskripsiCell.text(newDeskripsi);

          const index = row.index();
          dataList[index] = { kegiatan: newKegiatan, deskripsi: newDeskripsi };
          saveData();
          showNotification("Data berhasil diedit", "success");
        } else {
          showNotification("Data tidak boleh kosong", "error");
        }
        $(this).text("Edit");
      }
    });

    newRow.find(".delete-btn").on("click", function () {
      const row = $(this).closest("tr");
      const index = row.index();
      dataList.splice(index, 1);
      row.remove();
      updateRowNumbers();
      saveData();
      showNotification("Data berhasil dihapus", "success");
    });

    $("#tableBody").append(newRow);

    if (save) {
      dataList.push({ kegiatan, deskripsi });
      saveData();
    }
  }

  function updateRowNumbers() {
    count = 1;
    $("#tableBody tr").each(function () {
      $(this).find("td:first").text(count++);
    });
  }

  function saveData() {
    localStorage.setItem("tableData", JSON.stringify(dataList));
  }

  $("#clearAll").on("click", function () {
    if (confirm("Yakin ingin menghapus semua data?")) {
      $("#tableBody").empty();
      count = 1;
      dataList = [];
      saveData();
      showNotification("Semua data dihapus", "success");
    }
  });
});