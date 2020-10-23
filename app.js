class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.title = "";
    this.text = "";
    this.id = "";

    this.$placeholderContainer = document.querySelector(
      ".placeholder-container"
    );
    this.$form = document.querySelector(".note-container");
    this.$noteTitleContainer = document.querySelector(".note-title-container");
    this.$noteTextContainer = document.querySelector(".note-text-container");
    this.$noteTitle = document.querySelector(".note-title");
    this.$noteText = document.querySelector(".note-text");
    this.$displayNotesContainer = document.querySelector(
      ".display-notes-container"
    );
    this.$displayNotesStructure = document.querySelector(
      ".display-notes-structure"
    );
    this.$displayNotesTitle = document.querySelector(".display-notes-title");
    this.$displayNotesText = document.querySelector(".display-notes-text");
    this.$formButtonsContainer = document.querySelector(
      ".form-buttons-container"
    );
    this.$formCloseButton = document.querySelector(".btn-close");
    this.$modal = document.querySelector(".modal");
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton = document.querySelector(".modal-close-button");

    this.$colorTooltip = document.querySelector(".color-tooltip");
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener("mouseover", (event) => {
      this.openTooltip(event);
    });

    document.body.addEventListener("mouseout", (event) => {
      this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    this.$colorTooltip.addEventListener("click", (event) => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
      event.stopPropagation();
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        //create a note
        this.addNote({ title, text });
      }
    });

    this.$formCloseButton.addEventListener("click", (event) => {
      this.closeForm();
      event.stopPropagation();
    });

    this.$modalCloseButton.addEventListener("click", (event) => {
      this.closeModal(event);
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;
    if (isFormClicked) {
      //open form
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      //close form
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add("note-open");
    this.$noteTextContainer.classList.remove("note-text-container-shadow");
    this.$noteTitleContainer.style.display = "block";
    this.$formButtonsContainer.style.display = "block";
  }

  closeForm() {
    this.$form.classList.remove("note-open");
    this.$noteTextContainer.classList.add("note-text-container-shadow");
    this.$noteTitleContainer.style.display = "none";
    this.$formButtonsContainer.style.display = "none";
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

  addNote({ title, text }) {
    const newNote = {
      title: title,
      text: text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map((note) => {
      console.log(this);
      return note.id === Number(this.id) ? { ...note, title, text } : note;
    });
    this.render();
  }

  editNoteColor(color) {
    this.notes = this.notes.map((note) => {
      return note.id === Number(this.id) ? { ...note, color } : note;
    });
    this.render();
  }

  selectNote(event) {
    const $selectedNote = event.target.closest(".display-notes-structure");
    if (!$selectedNote) return;
    const [$selectedNoteTitle, $selectedNoteText] = $selectedNote.children;
    this.title = $selectedNoteTitle.textContent;
    this.text = $selectedNoteText.textContent;
    this.id = $selectedNote.dataset.id;
  }

  openModal(event) {
    if (
      event.target.matches(".toolbar-delete") ||
      event.target.matches(".toolbar-color-palette")
    )
      return;
    if (event.target.closest(".display-notes-structure")) {
      this.$modal.classList.toggle("open-modal");
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
    this.editNote();
    this.$modal.classList.toggle("open-modal");
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter((note) => {
      return note.id != Number(id);
    });
    this.render();
  }

  openTooltip(event) {
    const isMatching = event.target.matches(".toolbar-color-palette");
    if (!isMatching) return;
    this.id = event.target.dataset.id;
    const noteCoordinates = event.target.getBoundingClientRect();
    const horizontal = noteCoordinates.left + window.scrollX;
    const vertical = noteCoordinates.top + window.scrollY;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = `flex`;
  }

  closeTooltip(event) {
    const isMatching = event.target.matches(".toolbar-color-palette");
    if (!isMatching) return;
    this.$colorTooltip.style.display = "none";
  }

  render() {
    this.saveNotes();
    this.displayNotes();
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholderContainer.style.display = hasNotes ? "none" : "flex";
    this.$displayNotesContainer.innerHTML = this.notes
      .map((note) => {
        return `<div class="display-notes-structure" style="background:${note.color};" data-id = "${note.id}">
            <div class="display-note-title">${note.title}</div>
            <div class="display-note-text" >${note.text}</div>
            <div class="toolbar-container">
              <div class="toolbar">
                <img class="toolbar-color-palette" src="./assets/color-palette.png" data-id = ${note.id}>
                <img class="toolbar-delete" src="./assets/garbage.png" data-id = ${note.id}>
              </div>
            </div>
          </div>
          `;
      })
      .join("");
  }
}
new App();
