/* 


******************************************************************** _-_-_-_-_-_-_-_-_-_-_-_ ********************************************************************
********************************************************************                         ********************************************************************
********************************************************************   :::::::::::::::::::   ********************************************************************
********************************************************************                         ********************************************************************
********************************************************************    MATERIALIZE MODAL    ********************************************************************
********************************************************************                         ********************************************************************
********************************************************************   :::::::::::::::::::   ********************************************************************
********************************************************************                         ********************************************************************
******************************************************************** -_-_-_-_-_-_-_-_-_-_-_- ********************************************************************


This small library is supposed to simplify the usage of modals from the MaterializeCSS library, especially in a single-page application where they can be pretty useful.
Use it like this:
var modal = new Modal({
    title: 'My First Modal',
    openButton: '#open_myFirstModal',
    width: 70,
    height: 80,
    onOpen: function(modal) {
        modal.setContent('Some content');
    }
});


 * Options:
    - title         -> string               => optional     default: nothing    * Can contain HTML          => title  of the modal
    - width         -> integer              => optional     default: default width of Materialize modals    => width of the modal in %
    - height        -> integer              => optional     default: default height of Materialize modals   => height of the modal in vh
    - footerButtons -> string               => optional     default: nothing    * Can contain HTML          => buttons for the footer
    - openButton    -> string               => optional     default: nothing                                => button that opens the modal (HTML query string)
    - windowButtons -> boolean              => optional     default: true                                   => buttons on the top right to close/minimize/maximize the modal
    - type          -> string               => optional     default: 'modal-fixed-footer'                   => type of the modal (fixed-footer, bottom sheet, ..)
    - fixedContent  -> string               => optional     default: nothing    * Can contain HTML          => static content
    - onOpen        -> function(modal,data) => optional     default: nothing                                => Executed each time the modal is opened
    - onClose       -> function(modal)      => optional     default: nothing                                => Executed each time the modal is closed
 
 
 * Methods:
    - open(data)                                -> opens the modal      => custom data can be passed in to be used in the onOpen function
    - isOpen()                                  -> returns a boolean value indicating if the modal is currently open
    - close(callback)                           -> closes the modal - an optional callback function can be passed in with the modal instance as parameter
    - on(event, callback)                       -> binds an event (click, keypress, ...) to the modal - the callback gets the 'event' data
    - setContent(content)                       -> removes all dynamic content from the modal (the fixedContent from the options will not be affected) and sets the content passed in
    - addContent(content)                       -> adds content at the end of the modal
    - removeContent(selector)                   -> removes content based on a query selection
    - setTitle(title)                           -> sets the title of the modal
    - getTitle()                                -> returns the current title of the modal
    - setFooterButtons(buttons)                 -> removes the current footer buttons and sets the buttons passed in
    - setAttribute(attribute, value)            -> sets a custom HTML attribute
    - getAttribute(attribute)                   -> returns the value for the specified HTML attribute
    - insertForm(options)                       -> inserts a form
        * Options:
          - width       -> optional - integer - width of the entire form in % - default: 100
          - imageField  -> optional - boolean - adding an imageField to the right of the form - default: false
          - fields      -> required - array of objects containing the form fields - Each field can be customized like this:
            * name  - required - string
            * label - required - string
            * type  - required - string - available types: 
                -> text_short       => standard input type="text"
                -> text_long        => textarea
                -> password         => password input
                -> date             => datepicker (Datepicker.js library)
                -> yes_no           => checkbox
                -> custom           => select with single selection
                -> custom_multiple  => select with multiple selections
            * chips - required when using type 'custom' or 'custom multiple' - array of objects
                -> example: [{tag: '1'}, {tag: '2'}, {tag: '3'}]
            * dropzone - optional - boolean value to add a dropzone for that field - default: false - Dropzone.js library
            * icon  - optional - string (material-icons)
            * width - optional - integer (width in %) - when using this on 2 or more consecutive fields and their combined values is 100 or less, the fields will be on one line
            * attributes - optional - array of objects
                -> example: [{key: 'customAttribute1', val: 'yolo'}, {key: 'customAttribute2', val: 'swag'}, {key: 'customAttribute3', val: 'Hello World'}]
                -> if you want the form field to be required, add the attribute {key: 'required', val: 'true'}
    - setFormValues(values)                     -> sets the value for the form fields
        * the parameter must be an object containing all values. It should look something like this:
          {formFieldName1: 'value1', formFieldName2: 'value2', formFieldName3: 'value3', formFieldName4: 'value4',}
          In order for this to work, the property name must be equal to the name we gave the field in the 'insertForm' function
          Setting the value for type 'custom' or 'custom_multiple' requires an array with the selected element(s), the structure must be similar to the 'chips' array when creating the form field
          Setting the value for a 'yes_no' field requires a boolean value
    - getFormValues(mode)                       -> returns an array of objects with all fields and values
        * the function gets one optional parameter to change the structure of the data it returns - 'single' or 'combined' - default is 'combined'
    - getFormFields()                           -> returns all HTML form fields
    - getFormField(field)                       -> returns one HTML form field - parameter must be a string equal to the name of the field given in the 'insertForm' function
    - clearForm()                               -> clears the form
    - hideFormField([fields])                   -> hides form fields - parameter is an array of fields (each element in the array must be a string equal to the name of the field given in the 'insertForm' function)
    - formFieldChange(event, field, callback)   -> adds an event listener for a formField (change, keyup, keypress, ..) - the callback gets the 'event' data
    - displayImage(src)                         -> adds an image HTML field to the modal
    - displayFormImage(src)                     -> adds the path of the image to the already existing image field
    - hideFormImageDeleteButton()               -> hides the 'delete' button of the image field
    - showFormImageDeleteButton()               -> shows the 'delete' button of the image field
    - removeImage()                             -> removes the image
    - getImage()                                -> returns a FormData object of the selected image
    - hideDropzone()                            -> hides the Dropzone field
    - addChipsField(chips)                      -> adds a chips field to a form - the parameter is an array of chips similar to the structure of chips in a form field
    - insertCollection(options)                 -> adds a collection to the modal
        * Options:
          - width       -> integer - width of the collection in % - default: 100
          - sortable    -> boolean - indicate if the collection items should be sortable - works with the library Sortable.js
          - items       -> array - array of objects (collection items)
            * Each item has a couple of properties:
              - label -> required - string - the label of the item
              - attributes -> optional - object - custom HTML attributes for the item - example: {customAttr1: 'yolo', customAttr2: 'swag'}
              - secondaryContent -> optional - array - array of secondary-content items. Each item has some properties:
                * icon - required - string - material-icons
                * class - optional - string - a custom class for the item
                * color - optional - string - CSS color for the item
                * tooltip - optional - string - tooltip for the item
          - onInserted  -> function - executed when the collection has been inserted
    - getCollection()                           -> returns the HTML collection
    - getCollectionItems()                      -> returns all HTML collection items
 
 
 * Helper:
    - Adding the class 'modal-submit-form' to an element triggers its click event when pressing the Enter key
 


*/



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
        opt.items.forEach(function (item) {
            var element = itemTemplate;
            element.find('div').html(item.label);
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
