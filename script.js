let count = 1;
let rowBeingEdited = null;

$(document).ready(function () {
  loadFromLocalStorage();

  $("#addButton").on("click", function () {
    const Kegiatan = $("#inputKegiatan").val().trim();
    const Tempat = $("#inputTempat").val().trim();
    const Waktu = $("#inputTime").val().trim();

    if (Kegiatan === "" || Tempat === "" || Waktu === "") {
      alert("Isi semua data dulu!");
      return;
    }

    const tableBody = $("#tableBody");

    if (rowBeingEdited) {
      $(rowBeingEdited).find("td").eq(1).text(Kegiatan);
      $(rowBeingEdited).find("td").eq(2).text(Tempat);
      $(rowBeingEdited).find("td").eq(3).text(Waktu);

      rowBeingEdited = null;
      $("#addButton").text("Tambahkan");
      $("#inputKegiatan").val("");
      $("#inputTempat").val("");
      $("#inputTime").val("");

      saveToLocalStorage();
      return;
    }

    $("#tableBody .emptyRow").remove();

    const row = $("<tr></tr>");
    const noCell = $("<td></td>").text(count++);
    const kegiatanCell = $("<td></td>").text(Kegiatan);
    const tempatCell = $("<td></td>").text(Tempat);
    const waktuCell = $("<td></td>").text(Waktu);
    const actionCell = $("<td></td>");

    const editBtn = $("<button></button>")
      .addClass("editBtn btn btn-warning btn-sm me-1")
      .text("Edit")
      .on("click", function () {
        $("#inputKegiatan").val(kegiatanCell.text());
        $("#inputTempat").val(tempatCell.text());
        $("#inputTime").val(waktuCell.text());
        $("#addButton").text("Update");
        rowBeingEdited = row;
        new bootstrap.Tab(document.querySelector("#input-tab")).show();
      });

    const deleteBtn = $("<button></button>")
      .addClass("deleteBtn btn btn-danger btn-sm")
      .text("Hapus")
      .on("click", function () {
        row.remove();
        updateNumbers();
        if ($("#tableBody tr").length === 0) {
          showEmptyMessage();
        }
        saveToLocalStorage();
      });

    actionCell.append(editBtn, deleteBtn);
    row.append(noCell, kegiatanCell, tempatCell, waktuCell, actionCell);

    tableBody.append(row);
    $("#inputKegiatan").val("");
    $("#inputTempat").val("");
    $("#inputTime").val("");

    saveToLocalStorage();

    new bootstrap.Tab(document.querySelector("#data-tab")).show();
  });

  $("#resetButton").on("click", function () {
    let resetModal = new bootstrap.Modal(document.getElementById("resetModal"));
    resetModal.show();
  });

  $("#confirmReset").on("click", function () {
    $("#tableBody").empty();
    count = 1;
    rowBeingEdited = null;
    $("#addButton").text("Tambahkan");
    $("#inputKegiatan").val("");
    $("#inputTempat").val("");
    $("#inputTime").val("");

    let resetModal = bootstrap.Modal.getInstance(document.getElementById("resetModal"));
    resetModal.hide();

    // tampilkan notif di atas tabel
    showNotification();

    saveToLocalStorage();
  });

  $("#cancelReset").on("click", function () {
    let resetModal = bootstrap.Modal.getInstance(document.getElementById("resetModal"));
    resetModal.hide();
  });

  function updateNumbers() {
    count = 1;
    $("#tableBody tr").each(function () {
      $(this).find("td").first().text(count++);
    });
  }

  function showNotification() {
    const notif = $("#notifContainer");
    notif.removeClass("d-none");
    setTimeout(() => {
      notif.addClass("d-none");
    }, 3000);
  }

  function saveToLocalStorage() {
    let data = [];
    $("#tableBody tr").each(function () {
      if (!$(this).hasClass("emptyRow")) {
        const row = {
          kegiatan: $(this).find("td").eq(1).text(),
          tempat: $(this).find("td").eq(2).text(),
          waktu: $(this).find("td").eq(3).text(),
        };
        data.push(row);
      }
    });
    localStorage.setItem("tableData", JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tableData")) || [];
    if (data.length === 0) {
      return;
    }

    $("#tableBody").empty();
    data.forEach((item) => {
      const row = $("<tr></tr>");
      const noCell = $("<td></td>").text(count++);
      const kegiatanCell = $("<td></td>").text(item.kegiatan);
      const tempatCell = $("<td></td>").text(item.tempat);
      const waktuCell = $("<td></td>").text(item.waktu);
      const actionCell = $("<td></td>");

      const editBtn = $("<button></button>")
        .addClass("editBtn btn btn-warning btn-sm me-1")
        .text("Edit")
        .on("click", function () {
          $("#inputKegiatan").val(kegiatanCell.text());
          $("#inputTempat").val(tempatCell.text());
          $("#inputTime").val(waktuCell.text());
          $("#addButton").text("Update");
          rowBeingEdited = row;
          new bootstrap.Tab(document.querySelector("#input-tab")).show();
        });

      const deleteBtn = $("<button></button>")
        .addClass("deleteBtn btn btn-danger btn-sm")
        .text("Hapus")
        .on("click", function () {
          row.remove();
          updateNumbers();
          if ($("#tableBody tr").length === 0) {
            showNotification();
          }
          saveToLocalStorage();
        });

      actionCell.append(editBtn, deleteBtn);
      row.append(noCell, kegiatanCell, tempatCell, waktuCell, actionCell);
      $("#tableBody").append(row);
    });
  }
});