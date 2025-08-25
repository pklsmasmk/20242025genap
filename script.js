document.getElementById("tambahBtn").addEventListener("click", tambahBaris);

function tambahBaris() {
  const nama = document.getElementById("nama").value.trim();
  const umur = document.getElementById("umur").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nama || !umur || !email) {
    alert("Dimohon isi semua kolomnya!");
    return;
  }

  const tabelBody = document.querySelector("#dataTabel tbody");
  const baris = tabelBody.insertRow();

  baris.insertCell(0).textContent = nama;
  baris.insertCell(1).textContent = umur;
  baris.insertCell(2).textContent = email;

  const aksiCell = baris.insertCell(3);
  const tombolEdit = document.createElement("button");
  tombolEdit.textContent = "Edit";
  tombolEdit.className = "edit-btn";
  tombolEdit.onclick = function () {
    document.getElementById("nama").value = baris.cells[0].textContent;
    document.getElementById("umur").value = baris.cells[1].textContent;
    document.getElementById("email").value = baris.cells[2].textContent;
    tabelBody.removeChild(baris);
  };
  const tombolHapus = document.createElement("button");
  tombolHapus.textContent = "Hapus";
  tombolHapus.className = "delete-btn";
  tombolHapus.onclick = function () {
    tabelBody.removeChild(baris);
  };

  aksiCell.appendChild(tombolEdit);
  aksiCell.appendChild(tombolHapus);
  

  document.getElementById("nama").value = "";
  document.getElementById("umur").value = "";
  document.getElementById("email").value = "";
}
