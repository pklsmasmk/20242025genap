let count = 1;
let rowBeingEdited = null;

$(document).ready(function() {
  // Tombol Tambahkan / Update
  $("#addButton").on("click", function () {
    const inputText = $("#inputText").val().trim();
    if (inputText === "") return;

    const tableBody = $("#tableBody");

    if (rowBeingEdited) {
      // Update baris yang sedang diedit
      $(rowBeingEdited).find("td").eq(1).text(inputText);
      rowBeingEdited = null;
      $("#addButton").text("Tambahkan");
      $("#inputText").val("");
      return;
    }

    // Membuat elemen <tr> baru
    const row = $("<tr></tr>");

    const noCell = $("<td></td>").text(count++);
    const textCell = $("<td></td>").text(inputText);

    // Untuk waktu, isi sekarang (bisa disesuaikan)
    const waktuCell = $("<td></td>").text(new Date().toLocaleTimeString());

    const actionCell = $("<td></td>");

    // Tombol Edit
    const editBtn = $("<button></button>")
      .addClass("editBtn")
      .text("Edit")
      .on("click", function () {
        $("#inputText").val(textCell.text());
        $("#addButton").text("Update");
        rowBeingEdited = row;
      });

    // Tombol Hapus
    const deleteBtn = $("<button></button>")
      .addClass("deleteBtn")
      .text("Hapus")
      .on("click", function () {
        row.remove();
        updateNumbers();

        if (rowBeingEdited && rowBeingEdited.is(row)) {
          rowBeingEdited = null;
          $("#addButton").text("Tambahkan");
          $("#inputText").val("");
        }
      });

    actionCell.append(editBtn, deleteBtn);
    row.append(noCell, textCell, waktuCell, actionCell);

    tableBody.append(row);
    $("#inputText").val("");
  });

  // Tombol Reset (Hapus Semua) - Tampilkan Modal
  $("#resetButton").on("click", function () {
    $("#resetModal").attr("aria-hidden", "false").show().focus();
  });

  // Tombol Konfirmasi Reset (Hapus Semua)
  $("#confirmReset").on("click", function () {
    $("#tableBody").empty();
    count = 1;
    rowBeingEdited = null;
    $("#addButton").text("Tambahkan");
    $("#inputText").val("");
    $("#resetModal").attr("aria-hidden", "true").hide();
  });

  // Tombol Batal Reset - Tutup Modal
  $("#cancelReset").on("click", function () {
    $("#resetModal").attr("aria-hidden", "true").hide();
  });

  // Fungsi update nomor urut setelah hapus
  function updateNumbers() {
    count = 1;
    $("#tableBody tr").each(function () {
      $(this).find("td").first().text(count++);
    });
  }

  // Modal awal disembunyikan
  $("#resetModal").hide();
});