const inputKegiatan = document.getElementById('inputKegiatan');
const inputDeskripsi = document.getElementById('inputDeskripsi');
const addBtn = document.getElementById('addBtn');
const tableBody = document.getElementById('tableBody');
const clearAllBtn = document.getElementById('clearAll');
const notif = document.getElementById('notification')

let count = 1;
let dataList = [];

function showNotification(message, type= "info"){
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.className = `notification show ${type}`;

  setTimeout(() => {
    notif.className = "notification";
  }, 3000);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('tableData');
  if (savedData) {
    dataList = JSON.parse(savedData);
    dataList.forEach(item => addRow(item.kegiatan, item.deskripsi, false));
  }
});

addBtn.addEventListener('click', () => {
  const kegiatan = inputKegiatan.value.trim();
  const deskripsi = inputDeskripsi.value.trim();

  if (kegiatan && deskripsi) {
    addRow(kegiatan, deskripsi);
    inputKegiatan.value = "";
    inputDeskripsi.value = "";
    showNotification("Data tersimpan","success")
  } else {
    showNotification("Mohon isi kedua kolom","error")
  }
});

function addRow(kegiatan, deskripsi, save = true) {
  const newRow = document.createElement('tr');

  const noCell = document.createElement('td');
  noCell.textContent = count++;

  const kegiatanCell = document.createElement('td');
  kegiatanCell.textContent = kegiatan;

  const deskripsiCell = document.createElement('td');
  deskripsiCell.textContent = deskripsi;

  const actionCell = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener('click', () => {
    const newKegiatan = prompt("Edit Nama Kegiatan:", kegiatanCell.textContent);
    const newDeskripsi = prompt("Edit Deskripsi:", deskripsiCell.textContent);

    if (newKegiatan && newDeskripsi) {
      kegiatanCell.textContent = newKegiatan;
      deskripsiCell.textContent = newDeskripsi;

      const index = [...tableBody.children].indexOf(newRow);
      dataList[index] = { kegiatan: newKegiatan, deskripsi: newDeskripsi };
      saveData();
      showNotification("Data Tersimpan","success")
    } else {
      showNotification("Perubahan dibatalkan","error")
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Hapus";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener('click', () => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const index = [...tableBody.children].indexOf(newRow);
      dataList.splice(index, 1);
      tableBody.removeChild(newRow);
      updateRowNumbers();
      saveData();
      showNotification("Data tersimpan","success")
    }
  });

  actionCell.appendChild(editBtn);
  actionCell.appendChild(deleteBtn);

  newRow.appendChild(noCell);
  newRow.appendChild(kegiatanCell);
  newRow.appendChild(deskripsiCell);
  newRow.appendChild(actionCell);

  tableBody.appendChild(newRow);

  if (save) {
    dataList.push({ kegiatan, deskripsi });
    saveData();
  }
}

function updateRowNumbers() {
  const rows = tableBody.querySelectorAll('tr');
  count = 1;
  rows.forEach((row) => {
    row.firstElementChild.textContent = count++;
  });
}

function saveData() {
  localStorage.setItem('tableData', JSON.stringify(dataList));
}

clearAllBtn.addEventListener('click', () => {
  if (confirm("Yakin ingin menghapus SEMUA data?")) {
    tableBody.innerHTML = "";
    count = 1;
    dataList = [];
    saveData();
    showNotification("Semua data dihapus","success")
  }
});