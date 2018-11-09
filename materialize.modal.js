let M_Modal = {};
M_Modal.instances = [];

class Modal {
    constructor(opt) {
        this.name = 'M_Modal_' + M_Modal.instances.length;
        this.title = opt.title || '';
        this.width = opt.width || 70;
        this.height = opt.height || 70;
        this.topMargin = Math.floor((100 - this.height) / 2);
        this.topMarginCSS = 'top:' + this.topMargin + 'vh;';
        this.footerButtons = opt.footerButtons || '';
        this.openButton = opt.openButton || null;
        this.windowButtons = opt.windowButtons === false ? '' : '<div class="modal-windowButtons"><div class="minimize-button-modal modal-windowbutton modal-minimize"><i class="material-icons">minimize</i></div><div class="maximize-button-modal modal-windowbutton modal-maximize"><i class="material-icons">filter_none</i></div><div class="close-button-modal modal-windowbutton modal-close"><i class="material-icons">close</i></div></div>';
        this.type = opt.type == 'default' ? '' : 'modal-fixed-footer';
        this.onOpen = opt.onOpen || null;
        this.onClose = opt.onClose || null;
        this.hasForm = false;
        this.wasOpened = false;
        this.fixedContent = opt.fixedContent || '';
        this.template = '<div id="' + this.name + '" class="modal ' + this.type + '" style="' + this.topMarginCSS + '"><div class="modal-header"><h4><span style="font-size: 22px;">' + this.title + '</span></h4></div><div class="modal-content" style="padding-top: 17px; height: calc(100% - 112px);">' + this.fixedContent + '<div class="modal-content-dynamic"></div></div><div class="modal-footer">' + this.footerButtons + '</div>' + this.windowButtons + '</div>';
        document.body.insertAdjacentHTML('beforeend', this.template);
        this.domElement = document.getElementById(this.name);
        this.domElement = document.getElementById(this.name);
        this.instance = M.Modal.init(this.domElement, {
            dismissible: false,
            startingTop: (this.topMargin - 5) + '%',
            endingTop: this.topMargin + '%',
            outDuration: 50,
            onCloseStart: () => {
                document.querySelectorAll('.minimized-item').forEach(elt => {
                    if (elt.getAttribute('mid') == this.name) {
                        elt.parentNode.removeChild(elt);
                        if (document.querySelectorAll('.minimized-item').length < 1) toggleVisibility(document.getElementById('minimized-wrapper'), 500);
                    }
                });
            },
            onCloseEnd: () => {
                this.setContent('');
                document.getElementById(this.name).classList.remove('maximized', 'minimized');
                if (!this.title) this.setTitle('');
                if (this.onClose) this.onClose(this);
            }
        });
        this.selectAll('.modal-close').forEach(elt => elt.addEventListener('click', () => this.close()));
        if (this.openButton) document.querySelectorAll(this.openButton).forEach(elt => elt.addEventListener('click', () => this.open()));
        if (this.windowButtons) {
            this.select('.modal-minimize').addEventListener('click', () => this.minimize());
            this.select('.modal-maximize').addEventListener('click', () => this.maximize());
        }
        M_Modal.instances.push(this);
    }
    select(el) {
        return this.domElement.querySelector(el);
    }
    selectAll(el) {
        return this.domElement.querySelectorAll(el);
    }
    open(cb) {
        this.instance.open();
        this.domElement.style.height = this.height + 'vh';
        this.domElement.style.maxHeight = this.height + 'vh';
        this.domElement.style.width = this.width + '%';
        this.domElement.style.maxWidth = this.maxWidth + '%';
        this.select('.modal-content').scrollTop = 0;
        delete this.chipsField;
        this.removeImage();
        this.on('keypress', (e) => {
            if (e.which == 13) this.select('.modal-submit-form').click();
        });
        if (this.onOpen) this.onOpen(this, cb);
    }
    isOpen() {
        return this.domElement.classList.contains('open');
    }
    close(cb) {
        this.instance.close();
        this.removeImage();
        if (cb) cb(this);
    }
    on(event, cb) {
        this.domElement.removeEventListener(event, null);
        this.domElement.addEventListener(event, cb);
    }
    setContent(content) {
        let el = this.select('.modal-content-dynamic');
        if (typeof content == 'string') {
            el.innerHTML = content;
        } else {
            el.innerHTML = '';
            el.appendChild(content);
        }
    }
    addContent(content) {
        if (typeof content == 'string') this.select('.modal-content-dynamic').insertAdjacentHTML('beforeend', content);
        else this.select('.modal-content-dynamic').appendChild(content);
    }
    removeContent(selector) {
        this.selectAll(selector).forEach(el => el.parentNode.removeChild(el));
    }
    setTitle(title) {
        this.select('.modal-header h4 span').innerHTML = title;
    }
    getTitle() {
        return this.select('.modal-header h4').innerHTML;
    }
    getTitleText() {
        return this.select('.modal-header h4').textContent;
    }
    setFooterButtons(buttons) {
        this.select('.modal-footer').innerHTML = buttons;
        this.selectAll('.modal-close').forEach(elt => elt.addEventListener('click', () => this.close()));
    }
    setAttribute(attr, val) {
        this.domElement.setAttribute(attr, val);
    }
    getAttribute(attr) {
        return this.domElement.getAttribute(attr);
    }
    insertForm(opt) {
        this.hasForm = true;
        let width = opt.width || 100;
        let container = createElementFromHTML('<div class="modal-form" style="width:' + width + '%"></div>');
        opt.fields.forEach(field => {
            field.modal = this.name;
            container.appendChild(createElementFromHTML(modalFormField(field)));
        });
        this.setContent(container);
        if (opt.imageField) {
            this.addContent('<input class="modal-img-file" type="file">');
            this.addContent('<div class="modal-img-container valign-wrapper"><img class="modal-img" src=""><a href="#!" class="modal-change-img btn btn-large btn-floating amber darken-2"><i class="material-icons">image</i></a><a href="#!" class="modal-delete-img btn btn-large btn-floating red"><i class="material-icons">delete</i></a></div>');
            // Trigger click on file input when clicking the image button
            this.select('.modal-change-img').removeEventListener('click', null);
            this.select('.modal-change-img').addEventListener('click', (e) => this.select('.modal-img-file').click());
            // Display selected image
            this.select('.modal-img-file').removeEventListener('change', null);
            this.select('.modal-img-file').addEventListener('change', (e) => {
                let imgFile = URL.createObjectURL(e.target.files[0]);
                this.select('.modal-img').setAttribute('src', imgFile);
                this.showFormImageDeleteButton();
            });
            // Delete image
            this.select('.modal-delete-img').removeEventListener('click', null);
            this.select('.modal-delete-img').addEventListener('click', (e) => {
                mbox.confirm('Dieses Bild wirklich löschen?', (answer) => {
                    if (answer) {
                        this.select('.modal-img').setAttribute('src', '');
                        this.hideFormImageDeleteButton();
                    }
                });
            });
        }
        if (opt.values) return this.setFormValues(opt.values);
        M.FormSelect.init(document.querySelectorAll('select'));
        M.Datepicker.init(this.selectAll('.datepicker'), M_Modal.datePickerOptions || {});
        M.Timepicker.init(this.selectAll('.timepicker'), M_Modal.timePickerOptions || {});
        M.updateTextFields();
    }
    setFormValues(obj) {
        this.getFormFields().forEach(field => {
            if (field.getAttribute('ftype') == 'custom' || field.getAttribute('ftype') == 'custom_multiple') {
                field.querySelectorAll('#' + field.getAttribute('fid') + ' option').forEach(option => {
                    let label = option.textContent;
                    let value = obj[field.getAttribute('fname')];
                    if (value && typeof value == 'object') {
                        value.forEach(chip => {
                            if (label == chip) option.selected = true;
                        });
                    } else if (value && typeof value == 'string') {
                        if (label == value) option.selected = true;
                    }
                });
            } else if (field.getAttribute('ftype') == 'checkbox') {
                field.querySelector('#' + field.getAttribute('fid')).checked = obj[field.getAttribute('fname')] === true ? true : false;
            } else if (field.getAttribute('ftype') == 'text_long') {
                field.querySelector('#' + field.getAttribute('fid')).value = obj[field.getAttribute('fname')];
                M.textareaAutoResize(field.querySelector('#' + field.getAttribute('fid')));
            } else {
                field.querySelector('#' + field.getAttribute('fid')).value = obj[field.getAttribute('fname')];
            }
        });
        if (obj.type) {
            if (obj.type == 'custom' || obj.type == 'custom_multiple') this.addChipsField(obj.chips);
        }
        M.FormSelect.init(document.querySelectorAll('select'));
        M.updateTextFields();
    }
    getFormValues(_mode) {
        if (_mode && _mode != 'single' && _mode != 'combined') return console.error('Mode "' + _mode + '" is not supported. Supported modes are: single, combined');
        let mode = _mode || 'combined';
        let requiredFieldMissing = false;
        let result = [];
        if (mode == 'combined') result = {};
        this.getFormFields().forEach(field => {
            if (field.getAttribute('required') && !document.getElementById(field.getAttribute('fid')).value) {
                requiredFieldMissing = true;
                field.style.backgroundColor = 'rgba(255,30,30,0.2)';
            } else {
                field.style.backgroundColor = 'transparent';
            }
            if (mode == 'single') {
                if (field.getAttribute('ftype') == 'checkbox') {
                    result.push({
                        field: field.getAttribute('fname'),
                        value: document.getElementById(field.getAttribute('fid')).checked
                    });
                } else {
                    result.push({
                        field: field.getAttribute('fname'),
                        value: document.getElementById(field.getAttribute('fid')).value
                    });
                }
            } else if (mode == 'combined') {
                if (field.getAttribute('ftype') == 'checkbox') {
                    result[field.getAttribute('fname')] = document.getElementById(field.getAttribute('fid')).checked;
                } else if (field.getAttribute('ftype') == 'custom' || field.getAttribute('ftype') == 'custom_multiple') {
                    let selected = Array.from(document.querySelectorAll('#' + field.getAttribute('fid') + ' option:checked')).map((el) => el.value);
                    if (selected.length > 1) selected.splice(0, 1);
                    result[field.getAttribute('fname')] = selected;
                } else {
                    result[field.getAttribute('fname')] = document.getElementById(field.getAttribute('fid')).value;
                }
            }
        });

        if (this.chipsField) {
            if (mode == 'combined') {
                result.chips = this.chipsField[0].M_Chips.chipsData;
            } else if (mode == 'single') {
                result.push({
                    field: 'chips',
                    value: this.chipsField[0].M_Chips.chipsData
                });
            }
        }
        if (requiredFieldMissing) {
            return {
                requiredFieldMissing: true
            }
        } else {
            return result;
        }
    }
    getFormFields() {
        return this.selectAll('.modal-form > .input-field');
    }
    getFormField(field) {
        return document.getElementById(this.select('.modal-form .input-field[fname="' + field + '"]').getAttribute('fid'));
    }
    clearForm() {
        this.getFormFields().forEach(field => {
            if (field.getAttribute('ftype') == 'custom' || field.getAttribute('ftype') == 'custom_multiple') {
                field.querySelectorAll('#' + field.getAttribute('fid') + ' option').forEach(option => option.selected = false);
            } else if (field.getAttribute('ftype') == 'checkbox') {
                field.querySelector('#' + field.getAttribute('fid')).checked = false;
            } else {
                document.getElementById(field.getAttribute('fid')).value = '';
            }
        });
        M.FormSelect.init(document.querySelectorAll('select'));
        M.updateTextFields();
    }
    hideFormField(arr) {
        this.selectAll('.modal-form .input-field').forEach(field => {
            for (let el of arr) {
                if (field.getAttribute('fname') == el) field.parentNode.removeChild(field);
            }
        });
    }
    formFieldChange(event, field, cb) {
        const fieldDOM = this.select('.modal-form .input-field[fname="' + field + '"]');
        const fid = fieldDOM.getAttribute('fid');
        document.getElementById(fid).removeEventListener(event, null);
        document.getElementById(fid).addEventListener(event, (e) => {
            cb(fieldDOM, this, e);
            M.updateTextFields();
        });
    }
    displayImage(img) {
        this.addContent('<div class="modal-img-container valign-wrapper"><img class="modal-img" src="' + img + '"></div>');
    }
    displayFormImage(img) {
        if (this.select('.modal-img')) this.select('.modal-img').setAttribute('src', img);
    }
    hideFormImageDeleteButton() {
        let btn = this.select('.modal-delete-img');
        if (btn) btn.style.display = 'none';
    }
    showFormImageDeleteButton() {
        let btn = this.select('.modal-delete-img');
        if (btn) btn.style.display = 'block';
    }
    removeImage() {
        if (this.select('.modal-img')) this.select('.modal-img').setAttribute('src', '');
    }
    getImage() {
        const file = this.select('.modal-img-file').files[0];
        if (file) {
            let imgData = new FormData();
            imgData.append('image', file);
            return imgData;
        } else {
            return this.select('.modal-img').getAttribute('src');
        }
    }
    addChipsField(_chips) {
        let chips = _chips || [];
        this.chipsField = createElementFromHTML('<div class="chips chips-placeholder" id="' + this.name + '_formChips' + '"></div>');
        this.addContent(this.chipsField);
        M.Chips.init(this.chipsField, {
            data: chips,
            placeholder: '+Option',
            secondaryPlaceholder: '+Option',
            onChipAdd: () => {
                let instance = M.Chips.getInstance(this.chipsField);
                this.chipsField.querySelectorAll('div').forEach(el => el.parentNode.removeChild(el));
                instance.chipsData.sort(dynamicSort('tag', 'asc'));
                instance.chipsData.forEach(chip => {
                    this.chipsField.querySelector('input').insertAdjacentHTML('beforebegin', '<div class="chip">' + chip.tag + '<i class="close material-icons">close</i></div>');
                });
            }
        });
    }
    insertCollection(opt) {
        const width = opt.width || 100;
        let container = document.createElement('UL');
        container.classList.add('collection');
        container.style.width = width + '%';
        opt.items.forEach(item => {
            let style = item.style || '';
            let itemDOM = '';
            if (item.customTemplate) {
                itemDOM = createElementFromHTML(item.customTemplate);
            } else {
                itemDOM = document.createElement('LI');
                itemDOM.classList.add('collection-item');
                itemDOM.appendChild(createElementFromHTML('<div class="collection-item-content"><span class="title" style="' + style + '">' + item.label + '</span></div>'));
            }
            if (item.attributes) {
                Object.keys(item.attributes).forEach(key => {
                    if (item.attributes.hasOwnProperty(key)) itemDOM.setAttribute(key, item.attributes[key])
                });
            }
            if (item.secondaryContent) {
                item.secondaryContent.reverse().forEach(secItem => {
                    let secItemDOM = createElementFromHTML('<a href="#!" class="secondary-content"></a>');
                    let iconDOM = createElementFromHTML('<i class="material-icons">' + secItem.icon + '</i>');
                    if (secItem.class) secItemDOM.classList.add(secItem.class);
                    if (secItem.color) iconDOM.style.color = secItem.color;
                    secItemDOM.appendChild(iconDOM);
                    if (secItem.tooltip) {
                        secItemDOM.classList.add('tooltipped');
                        secItemDOM.setAttribute('data-tooltip', secItem.tooltip);
                    }
                    itemDOM.querySelector('.collection-item-content').appendChild(secItemDOM);
                });
            }
            container.appendChild(itemDOM);
        });
        this.setContent(container);
        if (opt.searchBar) {
            let searchBar = document.createElement('DIV');
            searchBar.classList.add('modal-search-ctn');
            searchBar.innerHTML = '<i class="material-icons icon">search</i><input type="text" placeholder="' + (M_Modal.searchBarPlaceholderText || 'Search..') + '" /><i class="material-icons modal-search-clear">clear</i>';
            if (!this.wasOpened) document.querySelector('#' + this.name + ' .modal-header').appendChild(searchBar);
            else document.querySelector('#' + this.name + ' .modal-search-ctn input').value = '';
            searchInCollection({
                input: searchBar.getElementsByTagName('input')[0],
                elements: this.selectAll('.collection .collection-item'),
                text: '.title',
                clearBtn: searchBar.querySelector('.modal-search-clear')
            });
        }
        this.wasOpened = true;
        if (opt.onInserted) opt.onInserted();
    }
    getCollection() {
        return this.select('.collection');
    }
    getCollectionItems() {
        return this.selectAll('.collection .collection-item');
    }
    minimize() {
        const title = this.getTitleText();
        let leftMinimized = document.querySelectorAll('.minimized-item').length > 0 ? Math.floor(document.querySelector('.minimized-item:last-child').offsetLeft + document.querySelector('.minimized-item:last-child').offsetWidth) : 0;
        const leftModal = Math.floor(this.domElement.offsetLeft);
        let modalMinimized = false;
        document.querySelectorAll('.minimized-item').forEach(item => {
            if (item.getAttribute('mid') == this.name) {
                item.querySelector('.title').textContent = title;
                modalMinimized = true;
                leftMinimized = Math.floor(item.offsetLeft);
            }
        });
        let template = createElementFromHTML('<div class="minimized-item" mid="' + this.name + '"><div class="title">' + title + '</div><div class="minimized-windowbuttons"><div class="modal-minimized-maximize"><i class="material-icons">filter_none</i></div><div class="modal-minimized-close"><i class="material-icons">close</i></div></div></div>');
        if (document.getElementById('minimized-wrapper').style.display == 'none') document.getElementById('minimized-wrapper').style.display = 'block';
        if (!modalMinimized) document.getElementById('minimized-wrapper').appendChild(template);
        const minimizedItemCount = document.querySelectorAll('.minimized-item').length;
        document.querySelectorAll('.minimized-item').forEach(item => {
            if (minimizedItemCount > 5) {
                item.style.width = (100 / document.querySelectorAll('.minimized-item').length).toFixedDecimals(2) + '%';
            } else {
                item.style.width = '20%';
            }
        });
        this.domElement.style.height = 0;
        this.domElement.style.width = 0;
        this.domElement.style.opacity = 0;
        this.domElement.classList.add('minimized');
        this.domElement.nextElementSibling.style.display = 'none';
        document.body.style.overflowY = 'scroll';

        // Restore minimized modal
        template.querySelector('.title').addEventListener('click', (e) => {
            let height = this.domElement.classList.contains('maximized') ? '100' : this.height;
            let topMargin = this.domElement.classList.contains('maximized') ? '0' : this.topMargin;
            let width = this.domElement.classList.contains('maximized') ? '100' : this.width;
            let left = (100 - this.width) / 2;
            this.domElement.style.height = height + 'vh';
            this.domElement.style.width = width + '%';
            this.domElement.style.top = topMargin + 'vh';
            this.domElement.style.display = 'block';
            this.domElement.style.opacity = 1;
            this.domElement.nextElementSibling.style.display = 'block';
            this.domElement.classList.remove('minimized');
            this.domElement.style.overflowY = 'hidden';
            e.target.closest('.minimized-item').parentNode.removeChild(e.target.closest('.minimized-item'));
            const itemCount = document.querySelectorAll('.minimized-item').length;
            if (itemCount > 5) {
                document.querySelectorAll('.minimized-item').forEach(item => item.style.width = (100 / itemCount).toFixedDecimals(2) + '%');
            } else if (itemCount <= 5 && itemCount > 0) {
                document.querySelectorAll('.minimized-item').forEach(item => item.style.width = '20%');
            } else {
                document.getElementById('minimized-wrapper').style.display = 'none';
            }
        });

        // Maximize minimized modal
        template.querySelector('.modal-minimized-maximize').addEventListener('click', (e) => {
            this.domElement.style.display = 'block';
            this.domElement.style.opacity = 1;
            this.domElement.style.overflowY = 'hidden';
            this.maximize('restore');
            this.domElement.classList.remove('minimized');
            this.domElement.nextElementSibling.style.display = 'block';
            e.target.closest('.minimized-item').parentNode.removeChild(e.target.closest('.minimized-item'));
            const itemCount = document.querySelectorAll('.minimized-item').length;
            if (itemCount > 5) {
                document.querySelectorAll('.minimized-item').forEach(item => item.style.width = (100 / itemCount).toFixedDecimals(2) + '%');
            } else if (itemCount <= 5 && itemCount > 0) {
                document.querySelectorAll('.minimized-item').forEach(item => item.style.width = '20%');
            } else {
                document.getElementById('minimized-wrapper').style.display = 'none';
            }
        });

        // Close minimized modal
        template.querySelector('.modal-minimized-close').addEventListener('click', (e) => {
            this.close();
            const itemCount = document.querySelectorAll('.minimized-item').length;
            if (itemCount > 5) {
                document.querySelectorAll('.minimized-item').forEach(item => item.style.width = (100 / itemCount).toFixedDecimals(2) + '%');
            } else if (itemCount <= 5 && itemCount > 0) {
                document.querySelectorAll('.minimized-item').forEach(item => item.style.width = '20%');
            } else {
                document.getElementById('minimized-wrapper').style.display = 'none';
            }
        });
    }
    maximize(mode) {
        if (this.domElement.classList.contains('maximized') && !mode) {
            this.domElement.style.height = this.height + 'vh';
            this.domElement.style.maxHeight = this.height + 'vh';
            this.domElement.style.width = this.width + '%';
            this.domElement.style.maxWidth = this.width + '%';
            this.domElement.style.top = this.topMargin + '%';
            this.domElement.classList.remove('maximized');
        } else {
            this.domElement.style.transition = '0.2s';
            this.domElement.style.height = '100vh';
            this.domElement.style.maxHeight = '100vh';
            this.domElement.style.width = '100%';
            this.domElement.style.maxWidth = '100%';
            this.domElement.style.top = 0;
            this.domElement.classList.add('maximized');
        }
    }
}



// Modal minimized container
document.body.appendChild(createElementFromHTML('<div id="minimized-wrapper" style="display: none;"></div>')); // container for the minimized items



// Constructing the HTML form element
function modalFormField(opt) {
    const id = opt.name.toLowerCase() + '_' + 'modalFormField' + '_' + opt.modal;
    opt.labelClear = opt.label.replace(/_/g, ' ');
    const disabled = opt.disabled ? 'disabled' : '';
    const width = opt.width || 100;
    const value = opt.value || '';
    let attributes = '';
    if (opt.attributes) {
        opt.attributes.forEach(function (attribute) {
            attributes += attribute.key + '="' + attribute.val + '" ';
        });
    }
    const icon = opt.icon ? '<i class="material-icons prefix">' + opt.icon + '</i>' : '';
    let contentToAppend = opt.append || '';
    let options = '';
    switch (opt.type) {
        case 'text_short':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' class="form-field" id="' + id + '" value="' + value + '" type="text">' + contentToAppend + '</div>';
            break;
        case 'password':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' class="form-field" id="' + id + '" value="' + value + '" type="password">' + contentToAppend + '</div>';
            break;
        case 'text_long':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><textarea ' + disabled + ' id="' + id + '" class="materialize-textarea form-field">' + value + '</textarea>' + contentToAppend + '</div>';
            break;
        case 'checkbox':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%"><p>' + icon + '<label for="' + id + '"><input ' + disabled + ' id="' + id + '" value="' + value + '" type="checkbox" class="filled-in form-field" /><span>' + opt.labelClear + '</span></label></p>' + contentToAppend + '</div>';
            break;
        case 'date':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' id="' + id + '" value="' + value + '" class="form-field datepicker" type="text">' + contentToAppend + '</div>';
            break;
        case 'time':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' id="' + id + '" value="' + value + '" class="form-field timepicker" type="text">' + contentToAppend + '</div>';
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' id="' + id + '" value="' + value + '" class="form-field timepicker" type="text">' + contentToAppend + '</div>';
            break;
        case 'custom':
            for (let i = 0; i < opt.chips.length; i++) {
                if (opt.chips[i].tag == value) {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '" selected>' + opt.chips[i].tag + '</option>';
                } else {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '">' + opt.chips[i].tag + '</option>';
                }
            }
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<select ' + disabled + ' class="form-field" id="' + id + '"><option value="" disabled selected>Auswählen..</option>' + options + '</select><label>' + opt.labelClear + '</label>' + contentToAppend + '</div>';
            break;
        case 'custom_multiple':
            for (let i = 0; i < opt.chips.length; i++) {
                if (opt.chips[i].tag == value) {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '" selected>' + opt.chips[i].tag + '</option>';
                } else {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '">' + opt.chips[i].tag + '</option>';
                }
            }
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<select ' + disabled + ' multiple class="form-field" id="' + id + '"><option  value="" disabled selected>Auswählen..</option>' + options + '</select><label>' + opt.labelClear + '</label>' + contentToAppend + '</div>';
            break;
        default:
            return console.error('type "' + opt.type + '" is not defined in the modalFormField function');
    }
}



// Alternative to the toFixed() method. The toFixed() method sometimes returns rounded values (i.e. 16.666666668 becomes 16.667 or 16.7 when using the toFixed() method)
// This is not correct since we want a fixed number of decimals of the existing number, not of the rounded number.
Number.prototype.toFixedDecimals = function (n) {
    return this.toString().match(/[^.]*/i)[0] + '.' + this.toString().match(/\.(.*)/)[1].substring(0, n);
}



// Sort an array of objects by an objects' property
function dynamicSort(property, order) {
    let sortOrder = 0;
    if (order == 'asc') {
        sortOrder = 1;
    } else if (order == 'desc') {
        sortOrder = -1;
    } else {
        return console.error('sort order ' + order + ' not defined in the dynamicSort function');
    }
    return function (a, b) {
        let aTemp, bTemp;
        if (typeof a[property] === 'string') {
            aTemp = a[property].toLowerCase();
        } else {
            aTemp = a[property];
        }
        if (typeof b[property] === 'string') {
            bTemp = b[property].toLowerCase();
        } else {
            bTemp = b[property];
        }
        let result = (aTemp < bTemp) ? -1 : (aTemp > bTemp) ? 1 : 0;
        return result * sortOrder;
    }
}



// create HTML DOM element from HTML string
function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}



// Search in collection
function searchInCollection(opt) {
    opt.input.removeEventListener('keyup', null); // remove the event listener to make sure the callback isn't firing multiple times
    opt.input.addEventListener('keyup', (e) => { // add listener for the keyup event
        let filter = opt.input.value.toUpperCase(); // convert input value to uppercase
        opt.elements.forEach(el => { // loop through the elements
            if (el.querySelector(opt.text).textContent.toUpperCase().indexOf(filter) > -1) { // convert the textcontent of the element to uppercase and check if the input value matches something in that string
                el.style.display = ''; // if it matches, display that element
            } else {
                el.style.display = 'none'; // otherwise hide it
            }
        });
    });
    // clear the input and display all elements when clicking a button
    if (opt.clearBtn) {
        opt.clearBtn.addEventListener('click', (e) => {
            opt.input.value = '';
            opt.elements.forEach(el => el.style.display = '');
        });
    }
}



// Show an element
function showElement(elem) {
    // Get the natural height of the element
    const getHeight = function () {
        elem.style.display = 'block'; // Make it visible
        let height = elem.scrollHeight + 'px'; // Get it's height
        elem.style.display = ''; //  Hide it again
        return height;
    };
    const height = getHeight(); // Get the natural height
    elem.classList.add('is-visible'); // Make the element visible
    elem.style.height = height; // Update the max-height
    // Once the transition is complete, remove the inline max-height so the content can scale responsively
    window.setTimeout(function () {
        elem.style.height = '';
    }, 350);
}



// Hide an element
function hideElement(elem) {
    // Give the element a height to change from
    elem.style.height = elem.scrollHeight + 'px';
    // Set the height back to 0
    window.setTimeout(function () {
        elem.style.height = '0';
    }, 1);
    // When the transition is complete, hide it
    window.setTimeout(function () {
        elem.classList.remove('is-visible');
    }, 350);
}



// Toggle element visibility
function toggleVisibility(elem) {
    // If the element is visible, hide it
    if (elem.classList.contains('is-visible')) {
        return hideElement(elem);
    }
    // Otherwise, show it
    showElement(elem);
}



// Fade in effect
function fadeIn(el, _t) {
    el.style.opacity = 0;
    let t = _t || 400;
    let last = +new Date();
    let tick = function () {
        el.style.opacity = +el.style.opacity + (new Date() - last) / t;
        last = +new Date();
        if (+el.style.opacity < 1)(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
    tick();
}



// Fade out effect
function fadeOut(el, _t) {
    el.style.opacity = 1;
    let t = _t || 400;
    let last = +new Date();
    let tick = function () {
        el.style.opacity = +el.style.opacity - (new Date() - last) / t;
        last = +new Date();
        if (+el.style.opacity > 0)(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
    }
    tick();
}
