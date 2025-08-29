$(function () {
  let count = 1
  let dataList = []

  function renderTable() {
    const $tbody = $("#tableBody").empty()
    $.each(dataList, function (index, data) {
      let prioritasClass = data.prioritas === "Tinggi" ? "label-prioritas-tinggi" :
                           data.prioritas === "Sedang" ? "label-prioritas-sedang" :
                           "label-prioritas-rendah"
      let statusClass = data.status === "Belum" ? "label-status-belum" : "label-status-sudah"

      $tbody.append(`
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${escapeHtml(data.kegiatan)}</td>
          <td>${escapeHtml(data.deskripsi)}</td>
          <td class="text-center"><span class="label ${prioritasClass}">${data.prioritas}</span></td>
          <td class="text-center"><span class="label ${statusClass}">${data.status}</span></td>
          <td class="text-center">
            <button class="btn btn-primary btn-xs btn-edit" data-id="${data.id}">Edit</button>
            <button class="btn btn-danger btn-xs btn-delete" data-id="${data.id}">Hapus</button>
            <button class="btn btn-warning btn-xs btn-done" data-id="${data.id}">Selesai</button>
          </td>
        </tr>
      `)
    })
  }

  function showNotification(message, type) {
    $("#notification").stop(true, true).text(message).removeClass().addClass(`notification show ${type}`).fadeIn(200).delay(2000).fadeOut(500)
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"'`=\/]/g, s =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'}[s])
    )
  }

  $("#addBtn").on("click", function () {
    const kegiatan = $("#inputKegiatan").val().trim()
    const deskripsi = $("#inputDeskripsi").val().trim()
    const prioritas = $("#inputPrioritas").val()
    const status = $("#inputStatus").val()
    if (kegiatan && deskripsi) {
      dataList.push({ id: count++, kegiatan, deskripsi, prioritas, status })
      renderTable()
      showNotification("Kegiatan berhasil ditambahkan", "success")
      $("#inputKegiatan, #inputDeskripsi").val("")
      $('a[href="#tabData"]').tab('show')
    } else {
      showNotification("Isi dulu", "error")
    }
  })

  $("#clearAll").on("click", function () {
    if (dataList.length === 0) {
      showNotification("Mana wok yang dihapus", "warning")
      return
    }
    if (confirm("Udah ga penting?")) {
      dataList = []
      count = 1
      renderTable()
      showNotification("Semua data berhasil dihapus", "success")
    }
  })

  $("#clearAllInput").on("click", function () {
    $("#inputForm")[0].reset()
    showNotification("Form direset", "info")
  })

  $(document).on("click", ".btn-delete", function () {
    const id = Number($(this).data("id"))
    dataList = dataList.filter(d => d.id !== id)
    renderTable()
    showNotification("Data dihapus", "success")
  })

  $(document).on("click", ".btn-edit", function () {
    const id = Number($(this).data("id"))
    const data = dataList.find(d => d.id === id)
    if (data) {
      $("#inputKegiatan").val(data.kegiatan)
      $("#inputDeskripsi").val(data.deskripsi)
      $("#inputPrioritas").val(data.prioritas)
      $("#inputStatus").val(data.status)
      dataList = dataList.filter(d => d.id !== id)
      renderTable()
      $('a[href="#tabInput"]').tab('show')
      showNotification("Edit data, Simpan lagi", "info")
    }
  })

  $(document).on("click", ".btn-done", function () {
    const id = Number($(this).data("id"))
    const data = dataList.find(d => d.id === id)
    if (data) {
      data.status = data.status === "Sudah" ? "Belum" : "Sudah"
      renderTable()
      showNotification("Status diubah menjadi " + data.status, "info")
    }
  })
})
