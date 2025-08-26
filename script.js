let count = 1;
let rowBeingEdited = null;

document.getElementById('addButton').addEventListener('click', function () {
  const input = document.getElementById('inputText');
  const inputText = input.value.trim();
  if (inputText === '') return;

  const tableBody = document.getElementById('tableBody');

 
  if (rowBeingEdited) {
    rowBeingEdited.cells[1].textContent = inputText;
    rowBeingEdited = null;
    document.getElementById('addButton').textContent = "Tambahkan";
    input.value = '';
    return;
  }

 
  const row = document.createElement('tr');

  const noCell = document.createElement('td');
  noCell.textContent = count++;

  const textCell = document.createElement('td');
  textCell.textContent = inputText;


  const actionCell = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'editBtn';
  editBtn.addEventListener('click', function () {
    document.getElementById('inputText').value = textCell.textContent;
    document.getElementById('addButton').textContent = "Update";
    rowBeingEdited = row;
  });


  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Hapus';
  deleteBtn.className = 'deleteBtn';
  deleteBtn.addEventListener('click', function () {
    tableBody.removeChild(row);
    updateNumbers();

    if (rowBeingEdited === row) {
      rowBeingEdited = null;
      document.getElementById('addButton').textContent = "Tambahkan";
      input.value = '';
    }
  });

  actionCell.appendChild(editBtn);
  actionCell.appendChild(deleteBtn);

  row.appendChild(noCell);
  row.appendChild(textCell);
  row.appendChild(actionCell);

  tableBody.appendChild(row);

  input.value = '';
});


function updateNumbers() {
  const rows = document.querySelectorAll('#tableBody tr');
  count = 1;
  rows.forEach(row => {
    row.firstElementChild.textContent = count++;
  });
}


document.getElementById('resetButton').addEventListener('click', function () {
  if (confirm("Yakin ingin menghapus semua data?")) {
    document.getElementById('tableBody').innerHTML = '';
    count = 1;
    rowBeingEdited = null;
    document.getElementById('addButton').textContent = "Tambahkan";
    document.getElementById('inputText').value = '';
  }
});
