let modal_staff_form = new Modal({
    width: 40,
    height: 70,
    windowButtons: false,
    onOpen: (modal) => {
        modal.insertForm({
            fields: [{
                name: 'firstname',
                label: 'First name',
                type: 'text_short',
                icon: 'account_circle',
                width: 45,
                required: true
            }, {
                name: 'lastname',
                label: 'Last name',
                type: 'text_short',
                icon: 'account_circle',
                width: 45,
                required: true
            }, {
                name: 'position',
                label: 'Position',
                type: 'custom',
                icon: 'label',
                required: true,
                chips: [{
                    tag: 'Accounting'
                }, {
                    tag: 'Sales'
                }, {
                    tag: 'Human Resources'
                }]
            }, {
                name: 'date_started',
                label: 'Start date',
                type: 'date',
                icon: 'date_range',
                required: true
            }]
        });
    }
});
