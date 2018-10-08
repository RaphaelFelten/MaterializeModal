var M_Modal = {};
M_Modal.instances = [];

class Modal {
    constructor(opt) {
        this.name = 'M_Modal_' + M_Modal.instances.length;
        this.title = opt.title || '';
        this.width = opt.width || 70;
        this.height = opt.height || 70;
        this.topMargin = this.height ? Math.floor((100 - this.height) / 2) : null;
        this.topMarginCSS = this.topMargin ? 'top:' + Math.floor((100 - this.height) / 2).toString() + 'vh;' : '';
        this.style = this.topMarginCSS;
        this.footerButtons = opt.footerButtons || '';
        this.openButton = opt.openButton || null;
        this.windowButtons = opt.windowButtons === false ? '' : '<div class="close-button-modal modal-windowbutton modal-close"><i class="material-icons">close</i></div><div class="minimize-button-modal modal-windowbutton modal-minimize"><i class="material-icons">minimize</i></div><div class="maximize-button-modal modal-windowbutton modal-maximize"><i class="material-icons">filter_none</i></div>';
        this.type = opt.type == 'default' ? '' : 'modal-fixed-footer';
        this.onOpen = opt.onOpen || null;
        this.onClose = opt.onClose || null;
        this.hasForm = false;
        this.wasOpened = false;
        this.fixedContent = opt.fixedContent || '';
        this.template = '<div id="' + this.name + '" class="modal ' + this.type + '" style="' + this.style + '"><div class="modal-header"><h4><span style="font-size: 22px;">' + this.title + '</span></h4></div><div class="modal-content" style="padding-top: 17px; height: calc(100% - 112px);">' + this.fixedContent + '<div class="modal-content-dynamic"></div></div><div class="modal-footer">' + this.footerButtons + '</div>' + this.windowButtons + '</div>';
        $('body').append(this.template);
        var self = this;
        if (this.openButton) {
            $(document).on('click', this.openButton, function () {
                self.open();
            });
        }
        M_Modal.instances.push(this);
    }
    open(cb) {
        var self = this;
        $('#' + this.name).modal({
            dismissible: false,
            startingTop: (this.topMargin - 5) + '%',
            endingTop: this.topMargin + '%',
            outDuration: 50,
            onCloseStart: function () {
                $('.minimized-item').each(function () {
                    if ($(this).attr('mid') == self.name) {
                        $(this).remove();
                        if ($('.minimized-item').length < 1) {
                            $('#minimized-wrapper').hide('500');
                        }
                    }
                });
            },
            onCloseEnd: function () {
                self.setContent('');
                $('#' + self.name).removeClass('maximized minimized');
                if (!self.title) self.setTitle('');
                if (self.onClose) self.onClose(self);
            }
        });
        $('#' + this.name).modal('open');
        $('#' + this.name).css({
            'height': this.height + 'vh',
            'max-height': this.height + 'vh',
            'width': this.width + '%',
            'max-width': this.width + '%'
        });
        $('#' + this.name).find('.modal-content').scrollTop(0);
        delete this.chipsField;
        this.removeImage();
        this.on('keypress', function (e) {
            if (e.which == 13) $('#' + self.name).find('.modal-submit-form').trigger('click');
        });
        if (this.onOpen) this.onOpen(this, cb);
    }
    isOpen() {
        return $('#' + this.name).hasClass('open');
    }
    close(cb) {
        $('#' + this.name).modal('close');
        this.removeImage();
        if (cb) cb(this);
    }
    on(event, cb) {
        $(document).off(event, '#' + this.name);
        $(document).on(event, '#' + this.name, function (e) {
            cb(e);
        });
    }
    setContent(content) {
        $('#' + this.name).find('.modal-content-dynamic').html(content);
    }
    addContent(content) {
        $('#' + this.name).find('.modal-content-dynamic').append(content);
    }
    removeContent(selector) {
        $(selector).remove();
    }
    setTitle(title) {
        $('#' + this.name).find('.modal-header h4 span').html(title);
    }
    getTitle() {
        return $('#' + this.name).find('.modal-header h4').html();
    }
    getTitleText() {
        return $('#' + this.name).find('.modal-header h4').text();
    }
    setFooterButtons(buttons) {
        $('#' + this.name).find('.modal-footer').html(buttons);
    }
    setAttribute(attr, val) {
        $('#' + this.name).attr(attr, val);
    }
    getAttribute(attr) {
        return $('#' + this.name).attr(attr);
    }
    insertForm(opt) {
        this.hasForm = true;
        var width = opt.width || 100;
        var container = $('<div class="modal-form" style="width:' + width + '%"></div>');
        var self = this;
        var datepickerArr = [];
        opt.fields.forEach(function (field) {
            field.modal = self.name;
            container.append(modalFormField(field));
            if (field.type == 'date') datepickerArr.push('#' + field.name.toLowerCase() + '_' + 'modalFormField' + '_' + field.modal + '[data-toggle="datepicker"]');
        });
        this.setContent(container);
        for (let id of datepickerArr) {
            $(id).datepicker({
                autoHide: true,
                format: 'yyyy-mm-dd',
                language: 'de-DE'
            });
            $(id).on('pick.datepicker', function (e) {
                setTimeout(function () {
                    M.updateTextFields();
                }, 100);
            });
            $(document).on('click', id, function () {
                $(id).datepicker('show');
            });
        }
        if (opt.imageField) {
            this.addContent('<input class="modal-img-file" type="file">');
            this.addContent('<div class="modal-img-container valign-wrapper"><img class="modal-img" src=""><a href="#!" class="modal-change-img btn btn-large btn-floating amber darken-2"><i class="material-icons">image</i></a><a href="#!" class="modal-delete-img btn btn-large btn-floating red"><i class="material-icons">delete</i></a></div>');
            var self = this;
            // Trigger click on file input when clicking the image button
            $('#' + this.name + ' .modal-change-img').off();
            $(document).off('click', '#' + this.name + ' .modal-change-img');
            $(document).on('click', '#' + this.name + ' .modal-change-img', function () {
                $('#' + self.name + ' .modal-img-file').trigger('click');
            });
            // Display selected image
            $('#' + this.name + ' .modal-img-file').off();
            $(document).off('change', '#' + this.name + ' .modal-img-file');
            $(document).on('change', '#' + this.name + ' .modal-img-file', function (event) {
                var imgFile = URL.createObjectURL(event.target.files[0]);
                $('#' + self.name).find('.modal-img').attr('src', imgFile);
                self.showFormImageDeleteButton();
            });
            // Delete image
            $('#' + this.name + ' .modal-delete-img').off();
            $(document).off('click', '#' + this.name + ' .modal-delete-img');
            $(document).on('click', '#' + this.name + ' .modal-delete-img', function () {
                mbox.confirm('Dieses Bild wirklich löschen?', function (answer) {
                    if (answer) {
                        $('#' + self.name).find('.modal-img').attr('src', '');
                        self.hideFormImageDeleteButton();
                    }
                });
            });
        }
        if (opt.values) return this.setFormValues(opt.values);
        $('select').formSelect();
        M.updateTextFields();
    }
    setFormValues(obj) {
        $('#' + this.name).find('.modal-content-dynamic .modal-form .input-field').each(function () {
            var self = $(this);
            if ($(this).attr('ftype') == 'custom' || $(this).attr('ftype') == 'custom_multiple') {
                $('#' + $(this).attr('fid') + ' option').each(function () {
                    var label = $(this).text();
                    var option = $(this);
                    var value = obj[self.attr('fname')];
                    if (value && typeof value == 'object') {
                        value.forEach(function (chip) {
                            if (label == chip) option.prop('selected', true);
                        });
                    } else if (value && typeof value == 'string') {
                        if (label == value) option.attr('selected', 'true');
                    }
                });
            } else if ($(this).attr('ftype') == 'yes_no') {
                $('#' + $(this).attr('fid')).prop('checked', (obj[$(this).attr('fname')] === true ? true : false));
            } else if ($(this).attr('ftype') == 'text_long') {
                $('#' + $(this).attr('fid')).val(obj[$(this).attr('fname')]);
                M.textareaAutoResize($('#' + $(this).attr('fid')));
            } else {
                $('#' + $(this).attr('fid')).val(obj[$(this).attr('fname')]);
            }
        });
        if (obj.type) {
            if (formTypeLookup('prog', obj.type) == 'custom' || formTypeLookup('prog', obj.type) == 'custom_multiple') {
                this.addChipsField(obj.chips);
            }
        }
        $('select').formSelect();
        M.updateTextFields();
    }
    getFormValues(mode) {
        if (mode && mode != 'single' && mode != 'combined') return console.error('Mode "' + mode + '" is not supported. Supported modes are: single, combined');
        var mode = mode || 'combined';
        var requiredFieldMissing = false;
        var result = [];
        if (mode == 'combined') result = {};
        $('#' + this.name).find('.modal-content-dynamic .modal-form .input-field').each(function () {
            if ($(this).attr('required') && !($('#' + $(this).attr('fid')).val())) {
                requiredFieldMissing = true;
                $(this).find('input').css('border-bottom', '1px solid #df0101');
            } else {
                $(this).find('input').css('border-bottom', '1px solid #9e9e9e');
            }
            if (mode == 'single') {
                if ($(this).attr('ftype') == 'yes_no') {
                    result.push({
                        field: $(this).attr('fname'),
                        value: $('#' + $(this).attr('fid')).is(':checked')
                    });
                } else {
                    result.push({
                        field: $(this).attr('fname'),
                        value: $('#' + $(this).attr('fid')).val()
                    });
                }
            } else if (mode == 'combined') {
                if ($(this).attr('ftype') == 'yes_no') {
                    result[$(this).attr('fname')] = $('#' + $(this).attr('fid')).is(':checked');
                } else {
                    result[$(this).attr('fname')] = $('#' + $(this).attr('fid')).val();
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
        return $('#' + this.name).find('.modal-content-dynamic .modal-form .input-field');
    }
    getFormField(field) {
        return $('#' + $('#' + this.name + ' .modal-content-dynamic .modal-form .input-field[fname="' + field + '"]').attr('fid'));
    }
    clearForm() {
        $('#' + this.name).find('.modal-content-dynamic .modal-form .input-field').each(function () {
            $('#' + $(this).attr('fid')).val('');
            $('#' + $(this).attr('fid') + ' option').prop('selected', false);
        });
        M.updateTextFields();
        $('select').formSelect();
    }
    hideFormField(arr) {
        $('#' + this.name).find('.modal-content-dynamic .modal-form .input-field').each(function () {
            var self = $(this);
            for (let field of arr) {
                if (self.attr('fname') == field) self.remove();
            }
        });
    }
    formFieldChange(event, field, cb) {
        var fid = $('#' + this.name + ' .modal-content-dynamic .modal-form .input-field[fname="' + field + '"]').attr('fid');
        var self = this;
        $('#' + fid).off();
        $(document).off(event, '#' + fid);
        $(document).on(event, '#' + fid, function (e) {
            cb($(this), self, e);
            M.updateTextFields();
        });
    }
    displayImage(img) {
        this.addContent('<div class="modal-img-container valign-wrapper"><img class="modal-img" src="' + img + '"></div>');
    }
    displayFormImage(img) {
        $('#' + this.name).find('.modal-img').attr('src', img);
    }
    hideFormImageDeleteButton() {
        $('#' + this.name).find('.modal-delete-img').hide();
    }
    showFormImageDeleteButton() {
        $('#' + this.name).find('.modal-delete-img').show();
    }
    removeImage() {
        $('#' + this.name).find('.modal-img').attr('src', '');
    }
    getImage() {
        if ($('#' + this.name).find('.modal-img-file').prop('files')[0]) {
            var imgData = new FormData();
            imgData.append('image', $('#' + this.name).find('.modal-img-file').prop('files')[0]);
            return imgData;
        } else {
            return $('#' + this.name).find('.modal-img').attr('src');
        }
    }
    hideDropzone() {
        $('#' + this.name).find('.open-dropzone-modal-wrapper').remove();
    }
    addChipsField(chips) {
        var chips = chips || [];
        this.chipsField = $('<div class="chips chips-placeholder" id="' + this.name + '_formChips' + '"></div>');
        var self = this;
        this.chipsField.chips({
            data: chips,
            placeholder: '+Option',
            secondaryPlaceholder: '+Option',
            onChipAdd: function () {
                self.chipsField.updateMaterialChipsView();
            }
        });
        this.addContent(this.chipsField);
    }
    insertCollection(opt) {
        var width = opt.width || 100;
        var container = $('<ul class="collection" style="width: ' + width + '%"></ul>');
        var itemTemplate = opt.template || $('<li class="collection-item"><div class="collection-item-content"></div></li>');
        var items = '';
        if (opt.sortable) itemTemplate.css('cursor', 'move');
        if (opt.searchBar) {
            var searchBar = $('<div class="modal-search-ctn"><i class="material-icons icon">search</i><input type="text" placeholder="Suchen.." /><i class="material-icons modal-search-clear">highlight_off</i></div>');
            if (!this.wasOpened) {
                $('#' + this.name).find('.modal-header').append(searchBar);
            } else {
                $('#' + this.name).find('.modal-search-ctn input').val('');
            }
            var self = this;
            searchBar.find('input').searchAndHighlight({
                textElement: '#' + self.name + ' .collection-item .title',
                parentElement: '#' + self.name + ' .collection-item'
            });
            searchBar.find('.modal-search-clear').click(function () {
                searchBar.find('input').val('');
                searchBar.find('input').searchAndHighlight();
            });
        }
        opt.items.forEach(function (item) {
            var style = item.style || '';
            if (item.customTemplate) {
                var element = item.customTemplate;
            } else {
                var element = itemTemplate;
                element.find('div').html('');
                element.find('div').append('<span class="title" style="' + style + '">' + item.label + '</span>');
            }
            if (item.attributes) {
                Object.keys(item.attributes).forEach(function (key) {
                    if (item.attributes.hasOwnProperty(key)) element.attr(key, item.attributes[key]);
                });
            }
            if (item.secondaryContent) {
                item.secondaryContent.reverse().forEach(function (secItem) {
                    var secondaryContentTemplate = $('<a href="#!" class="secondary-content"><i class="material-icons">' + secItem.icon + '</i></a>');
                    var secElementDOM = secondaryContentTemplate;
                    if (secItem.class) secElementDOM.addClass(secItem.class);
                    if (secItem.color) secElementDOM.find('.material-icons').css('color', secItem.color);
                    if (secItem.tooltip) {
                        secElementDOM.addClass('tooltipped');
                        secElementDOM.attr('data-tooltip', secItem.tooltip);
                    }
                    element.find('.collection-item-content').append(secElementDOM[0].outerHTML);
                });
            }
            container.append(element[0].outerHTML);
        });
        this.setContent(container);
        this.wasOpened = true;
        if (opt.onInserted) opt.onInserted();
    }
    getCollection() {
        return $('#' + this.name).find('.modal-content-dynamic .collection');
    }
    getCollectionItems() {
        return $('#' + this.name).find('.modal-content-dynamic .collection > li');
    }
    minimize() {
        var self = this;
        var title = this.getTitleText();
        var leftMinimized = $('.minimized-item').length > 0 ? Math.floor($('.minimized-item:last').offset().left + $('.minimized-item:last').width()) : 0;
        var leftModal = Math.floor($('#' + this.name).offset().left);
        var modalMinimized = false;
        $('#minimized-wrapper .minimized-item').each(function () {
            if ($(this).attr('mid') == self.name) {
                $(this).find('.title').text(title);
                modalMinimized = true;
                leftMinimized = Math.floor($(this).offset().left);
            }
        });
        var offset = (leftMinimized - leftModal) * 2;
        var template = $('<div class="minimized-item" mid="' + this.name + '" offset="' + offset + '"><div class="title">' + title + '</div><div class="minimized-windowbuttons"><div class="modal-minimized-maximize"><i class="material-icons">filter_none</i></div><div class="modal-minimized-close"><i class="material-icons">close</i></div></div></div>');
        if (!$('#minimized-wrapper').is(':visible')) $('#minimized-wrapper').show('500');
        if (!modalMinimized) template.hide().appendTo('#minimized-wrapper').show();
        if ($('.minimized-item').length > 5) {
            $('.minimized-item').css('width', (100 / $('.minimized-item').length).toFixedDecimals(2) + '%');
        } else {
            $('.minimized-item').css('width', '20%');
        }
        $('#' + this.name).animate({
            height: '0',
            width: '0',
            top: '1000px',
            left: offset + 'px',
            opacity: 0
        }, 250);
        $('#' + this.name).addClass('minimized');
        $('#' + this.name).next('.modal-overlay').fadeOut(100);
        $('body').css('overflow-y', 'scroll');
    }
    maximize(mode) {
        if ($('#' + this.name).hasClass('maximized') && !mode) {
            $('#' + this.name).css({
                'height': this.height + 'vh',
                'max-height': this.height + 'vh',
                'width': this.width + '%',
                'max-width': this.width + '%',
                'top': this.topMargin + '%'
            });
            $('#' + this.name).removeClass('maximized');
        } else {
            $('#' + this.name).css({
                transition: '.2s',
                'height': '100vh',
                'max-height': '100vh',
                'width': '100%',
                'max-width': '100%',
                'top': '0'
            });
            $('#' + this.name).addClass('maximized');
        }
    }
}



// MODAL MINIMIZE/MAXIMIZE
$('body').append('<div id="minimized-wrapper" style="display: none;"></div>'); // container for the minimized items
// Minimize modal
$(document).on('click', '.modal-minimize', function () {
    var modal = M_Modal.instances.filter(m => m.name == $(this).closest('.modal').attr('id'))[0];
    modal.minimize();
});
// Maximize modal
$(document).on('click', '.modal-maximize', function () {
    var modal = M_Modal.instances.filter(m => m.name == $(this).closest('.modal').attr('id'))[0];
    modal.maximize();
});
// Restore minimized modal
$(document).on('click', '.minimized-item div.title', function () {
    var modal = M_Modal.instances.filter(m => m.name == $(this).closest('.minimized-item').attr('mid'))[0];
    var topMargin = $('#' + $(this).closest('.minimized-item').attr('mid')).hasClass('maximized') ? '0' : modal.topMargin;
    var width = $('#' + $(this).closest('.minimized-item').attr('mid')).hasClass('maximized') ? '0' : modal.width;
    var left = (100 - modal.width) / 2;
    var offset = $('#' + $(this).closest('.minimized-item').attr('offset'));
    $('#' + modal.name).animate({
        height: '100%',
        width: '100%',
        top: topMargin + 'vh',
        left: '0',
        opacity: 1
    }, 150);
    $('#' + modal.name).next('.modal-overlay').fadeIn(100);
    $('#' + modal.name).removeClass('minimized');
    $('body').css('overflow-y', 'hidden');
    $(this).closest('.minimized-item').remove();
    if ($('.minimized-item').length > 5) {
        $('.minimized-item').css('width', (100 / $('.minimized-item').length).toFixedDecimals(2) + '%');
    } else {
        $('.minimized-item').css('width', '20%');
    }
    if ($('.minimized-item').length < 1) {
        $('#minimized-wrapper').hide('500');
    }
});
// Maximize minimized modal
$(document).on('click', '.modal-minimized-maximize', function () {
    var modal = M_Modal.instances.filter(m => m.name == $(this).closest('.minimized-item').attr('mid'))[0];
    $('#' + modal.name).animate({
        height: '100%',
        width: '100%',
        top: '0vh',
        left: '0',
        opacity: 1
    }, 150);
    $('#' + modal.name).next('.modal-overlay').fadeIn(100);
    $('#' + modal.name).removeClass('minimized');
    $('body').css('overflow-y', 'hidden');
    $(this).closest('.minimized-item').remove();
    if ($('.minimized-item').length > 5) {
        $('.minimized-item').css('width', (100 / $('.minimized-item').length).toFixedDecimals(2) + '%');
    } else {
        $('.minimized-item').css('width', '20%');
    }
    modal.maximize('restore');
    if ($('.minimized-item').length < 1) {
        $('#minimized-wrapper').hide('500');
    }
});
// Close minimized modal
$(document).on('click', '.modal-minimized-close', function () {
    var self = this;
    var modal = M_Modal.instances.filter(m => m.name == $(this).closest('.minimized-item').attr('mid'))[0];
    if (modal.hasForm) {
        mbox.confirm('Das Fenster beinhaltet ein aktives Formular. Wirklich schließen?', function (answer) {
            if (answer) {
                modal.close();
                $(self).closest('.minimized-item').remove();
                if ($('.minimized-item').length < 1) {
                    $('#minimized-wrapper').hide('500');
                }
            }
        });
    } else {
        modal.close();
        $(this).closest('.minimized-item').remove();
        if ($('.minimized-item').length > 5) {
            $('.minimized-item').css('width', (100 / $('.minimized-item').length).toFixedDecimals(2) + '%');
        } else {
            $('.minimized-item').css('width', '20%');
        }
        if ($('.minimized-item').length < 1) {
            $('#minimized-wrapper').hide('500');
        }
    }
});



// rearrange the chips in alphabetical order in the view
jQuery.fn.updateMaterialChipsView = function () {
    this.find('div').remove();
    this[0].M_Chips.chipsData.sort(dynamicSort('tag', 'asc'));
    var that = this;
    this[0].M_Chips.chipsData.forEach(function (chip) {
        that.find('input').before('<div class="chip">' + chip.tag + '<i class="close material-icons">close</i></div>');
    });
}



// Constructing the HTML form element
function modalFormField(opt) {
    var id = opt.name.toLowerCase() + '_' + 'modalFormField' + '_' + opt.modal;
    opt.labelClear = opt.label.replace(/_/g, ' ');
    var disabled = opt.disabled ? 'disabled' : '';
    var width = opt.width || 100;
    var value = opt.value || '';
    var attributes = '';
    if (opt.attributes) {
        opt.attributes.forEach(function (attribute) {
            attributes += attribute.key + '="' + attribute.val + '" ';
        });
    }
    var icon = opt.icon ? '<i class="material-icons prefix">' + opt.icon + '</i>' : '';
    var dropzoneTemplate = opt.dropzone ? '<div class="open-dropzone-modal-wrapper"><a href="#!" class="btn btn-floating cyan open-dropzone-modal"><i class="material-icons">description</i></a><span class="count-documents">0</span></div>' : '';
    switch (opt.type) {
        case 'text_short':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' class="form-field" id="' + id + '" value="' + value + '" type="text">' + dropzoneTemplate + '</div>';
            break;
        case 'password':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' class="form-field" id="' + id + '" value="' + value + '" type="password">' + dropzoneTemplate + '</div>';
            break;
        case 'text_long':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><textarea ' + disabled + ' id="' + id + '" class="materialize-textarea form-field">' + value + '</textarea>' + dropzoneTemplate + '</div>';
            break;
        case 'yes_no':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%"><p>' + icon + '<label for="' + id + '"><input ' + disabled + ' id="' + id + '" value="' + value + '" type="checkbox" class="filled-in form-field" /><span>' + opt.labelClear + '</span></label></p>' + dropzoneTemplate + '</div>';
            break;
        case 'date':
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<label for="' + id + '">' + opt.labelClear + '</label><input ' + disabled + ' id="' + id + '" value="' + value + '" class="form-field" data-toggle="datepicker" type="text">' + dropzoneTemplate + ' </div>';
            break;
        case 'custom':
            var options = "";
            for (var i = 0; i < opt.chips.length; i++) {
                if (opt.chips[i].tag == value) {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '" selected>' + opt.chips[i].tag + '</option>';
                } else {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '">' + opt.chips[i].tag + '</option>';
                }
            }
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<select ' + disabled + ' class="form-field" id="' + id + '"><option value="" disabled selected>Auswählen..</option>' + options + '</select><label>' + opt.labelClear + '</label>' + dropzoneTemplate + '</div>';
            break;
        case 'custom_multiple':
            var options = "";
            for (var i = 0; i < opt.chips.length; i++) {
                if (opt.chips[i].tag == value) {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '" selected>' + opt.chips[i].tag + '</option>';
                } else {
                    options += '<option customattr="' + opt.chips[i].customattr + '" value="' + opt.chips[i].tag + '">' + opt.chips[i].tag + '</option>';
                }
            }
            return '<div class="input-field" ' + attributes + ' fid="' + id + '" fname="' + opt.name + '" flabel="' + opt.label + '" ftype="' + opt.type + '" style="width:' + width + '%">' + icon + '<select ' + disabled + ' multiple class="form-field" id="' + id + '"><option  value="" disabled selected>Auswählen..</option>' + options + '</select><label>' + opt.labelClear + '</label>' + dropzoneTemplate + '</div>';
            break;
        default:
            return console.error('type "' + opt.type + '" is not defined in the modalFormField function');
    }
}



// Lookup for form types
function formTypeLookup(mode, val) {
    if (mode == 'prog') {
        if (val == "Kurzer Text") {
            return "text_short";
        } else if (val == "Passwort") {
            return "password";
        } else if (val == "Langer Text") {
            return "text_long";
        } else if (val == "Ja/Nein") {
            return "yes_no";
        } else if (val == "Datum") {
            return "date";
        } else if (val == "Benutzerdefiniertes Auswahlfeld") {
            return "custom";
        } else if (val == "Benutzerdefiniertes Auswahlfeld - Mehrere") {
            return "custom_multiple";
        } else {
            return console.error('type "' + val + '" not found');
        }
    } else if (mode == 'label') {
        if (val == "text_short") {
            return "Kurzer Text";
        } else if (val == "password") {
            return "Passwort";
        } else if (val == "text_long") {
            return "Langer Text";
        } else if (val == "yes_no") {
            return "Ja/Nein";
        } else if (val == "date") {
            return "Datum";
        } else if (val == "custom") {
            return "Benutzerdefiniertes Auswahlfeld";
        } else if (val == "custom_multiple") {
            return "Benutzerdefiniertes Auswahlfeld - Mehrere";
        } else {
            return console.error('type "' + val + '" not found');
        }
    }
}



// Alternative to the toFixed() method. The toFixed() method sometimes returns rounded values (i.e. 16.666666668 becomes 16.667 or 16.7 when using the toFixed() method)
// This is not correct since we want a fixed number of decimals of the existing number, not of the rounded number.
Number.prototype.toFixedDecimals = function (n) {
    return this.toString().match(/[^.]*/i)[0] + '.' + this.toString().match(/\.(.*)/)[1].substring(0, n);
}



// Sort an array of objects by an objects' property
function dynamicSort(property, order) {
    if (order == 'asc') {
        var sortOrder = 1;
    } else if (order == 'desc') {
        var sortOrder = -1;
    } else {
        return console.error('sort order ' + order + ' not defined in the dynamicSort function');
    }
    return function (a, b) {
        var aTemp, bTemp;
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
        var result = (aTemp < bTemp) ? -1 : (aTemp > bTemp) ? 1 : 0;
        return result * sortOrder;
    }
}
