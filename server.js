let editingId = null;
const baseUrl = "http://localhost:8000/notes";

// Fetch all notes
function fetchNotes() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${baseUrl}`);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const notes = JSON.parse(xhr.responseText);
      displayNotes(notes);
    }
  };

  xhr.send();
}

// Display notes in the container
function displayNotes(notes) {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";

  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note";
    noteElement.innerHTML = `
              <h3>${note.title}</h3>
              <p>${note.description}</p>
              <div class="note-actions">
                  <button class="edit-btn" onclick="editNote('${note.id}', '${note.title}', '${note.description}')">Edit</button>
                  <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
              </div>
          `;
    container.appendChild(noteElement);
  });
}

// Save or update note
function saveNote() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  if (!title || !description) {
    alert("Please fill in all fields");
    return;
  }

  if (title.length <= 6) {
    alert("Title must be more than 6 characters");
    return;
  }

  if (description.length <= 20) {
    alert("Description must be more than 20 characters");
    return;
  }

  const xhr = new XMLHttpRequest();
  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${baseUrl}/${editingId}` : `${baseUrl}`;

  xhr.open(method, url);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      clearForm();
      fetchNotes();
    }
  };

  const data = JSON.stringify({
    title: title,
    description: description,
  });

  xhr.send(data);
}

// Delete note
function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;

  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${baseUrl}/${id}`);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      fetchNotes();
    }
  };

  xhr.send();
}

// Edit note
function editNote(id, title, description) {
  editingId = id;
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
}

// Clear form
function clearForm() {
  editingId = null;
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

// Initial load
fetchNotes();
