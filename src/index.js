class ToDoList {
    constructor() {
        const form = document.querySelector('.form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fromData = new FormData(e.target);
            const formTitle = fromData.get('title').trim();
            const formText = fromData.get('text').trim();

            if (formTitle && formText) {
                this.addNote(formTitle, formText);
            }
            e.target.reset();

            this.renderList();
        });

        const card = document.querySelector('.notes__list');
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('notes__button_remove')) {
                const idTitle = e.target.closest('.notes__item').getAttribute('id');
                this.deleteNote(idTitle);
            }

            this.renderList();
        });

        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('notes__button_done')) {
                const idTitle = e.target.closest('.notes__item').getAttribute('id');
                this.toggleIsDone(idTitle);
            }

            this.renderList();
        });

        this.renderList();
    }

    renderList() {
        const list = document.querySelector('.notes__list');
        list.innerHTML = '';

        const listTodo = document.createElement('ul');
        listTodo.classList.add('notes__list_todo');

        const listDone = document.createElement('ul');
        listDone.classList.add('notes__list_done');

        function allStorage() {
            const values = [];
            const keys = Object.keys(localStorage);

            for (let i = 0; i < keys.length; i++) {
                values.push( localStorage.getItem(keys[i]) );
            }

            const result = values.map(item => {
                let res = item
                res = JSON.parse(item);
                return res;
            });

            return result;
        }

        const NotesStorage = allStorage();

        for (const note of NotesStorage) {
            const listItem = document.createElement('li');
            listItem.classList.add('notes__item');
            listItem.setAttribute('id', `${note.title}`);

            const title = document.createElement('h2');
            title.classList.add('notes__title');
            title.textContent = `${note.title}`;

            const text = document.createElement('p');
            text.classList.add('notes__text');
            text.setAttribute('readonly', 'readonly');
            text.textContent = `${note.text}`;

            const wrap = document.createElement('div');
            wrap.classList.add('notes__wrap');

            const doneButton = document.createElement('button');
            doneButton.classList.add('notes__button', 'notes__button_done');
            doneButton.textContent = 'Done';

            const removeButton = document.createElement('button');
            removeButton.classList.add('notes__button', 'notes__button_remove');
            removeButton.textContent = 'Remove';

            wrap.append(doneButton, removeButton);
            listItem.append(title, text, wrap);

            if (note.isDone === true) {
                title.classList.add('done');
                text.classList.add('done');
                doneButton.textContent = 'Undone';
                listDone.append(listItem);
            } else {
                listTodo.append(listItem);
            }
        }
        list.append(listTodo, listDone);
    }

    addNote(noteTitle, noteText) {
        if (!noteTitle.trim() || !noteText.trim()) {
            return;
        }

        const isUnique = this.checkUnique(noteTitle);

        if (isUnique) {
            const note = {
                title: noteTitle,
                text: noteText,
                isDone: false
            };

            localStorage.setItem(noteTitle, JSON.stringify(note));
        }
    }

    checkUnique(noteTitle) {
        return !Object.keys(localStorage).find(note => note === noteTitle);
    }

    deleteNote(noteTitle) {
        localStorage.removeItem(noteTitle);
    }

    toggleIsDone(noteTitle) {
        const task = JSON.parse(localStorage.getItem(noteTitle));
        if (task.isDone === true) {
            task.isDone = false;
        } else {
            task.isDone = true;
        }
        localStorage.setItem(noteTitle, JSON.stringify(task));
    }
}
// eslint-disable-next-line no-unused-vars
const myToDoList = new ToDoList();