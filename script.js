$(document).ready(function () {
  function tambahData() {
    const nama = $("#nama").val().trim();
    const umur = $("#umur").val().trim();
    const email = $("#email").val().trim();

    if (!nama || !umur || !email) {
      alert("Dimohon isi semua kolomnya!");
      return;
    }

    const $tabelBody = $("#dataTabel tbody");
    const $baris = $("<tr>");

    $("<td>").text(nama).appendTo($baris);
    $("<td>").text(umur).appendTo($baris);
    $("<td>").text(email).appendTo($baris);

    const $aksiCell = $("<td>");

    const $tombolEdit = $("<button>")
      .text("Edit")
      .addClass("edit-btn")
      .on("click", function () {
        $("#nama").val($baris.find("td:eq(0)").text());
        $("#umur").val($baris.find("td:eq(1)").text());
        $("#email").val($baris.find("td:eq(2)").text());

        $("#tambahBtn")
          .text("Simpan")
          .off("click")
          .on("click", function simpanEdit() {
            $baris.find("td:eq(0)").text($("#nama").val());
            $baris.find("td:eq(1)").text($("#umur").val());
            $baris.find("td:eq(2)").text($("#email").val());

            $("#nama").val("");
            $("#umur").val("");
            $("#email").val("");

            $("#tambahBtn").text("Tambah").off("click").on("click", tambahData);
          });
      });

    const $tombolHapus = $("<button>")
      .text("Hapus")
      .addClass("delete-btn")
      .on("click", function () {
        $baris.remove();
      });

    $aksiCell.append($tombolEdit, $tombolHapus);
    $baris.append($aksiCell);
    $tabelBody.append($baris);

    $("#nama").val("");
    $("#umur").val("");
    $("#email").val("");
  }

  $("#tambahBtn").on("click", tambahData);
});
