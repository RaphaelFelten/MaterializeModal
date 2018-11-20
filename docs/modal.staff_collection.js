let modal_staff_collection = new Modal({
    title: 'Staff',
    titleColor: '#fff',
    titleBackgroundColor: '#00bcd4',
    width: 50,
    height: 90,
    footerButtons: '<div id="new_employee" class="btn cyan"><i class="material-icons">add</i></div>',
    openButton: '#open_modal_staff',
    onOpen: (modal) => {
        if (staff.length > 0) {
            let collection = [];
            staff.forEach(empl => {
                collection.push({
                    label: `${empl.firstname} ${empl.lastname}`,
                    attributes: {
                        "employee-id": empl['employee_id']
                    },
                    secondaryContent: [{
                            icon: 'edit',
                            class: 'edit-employee',
                            color: '#757575'
                        },
                        {
                            icon: 'delete',
                            class: 'delete-employee',
                            color: '#df0101'
                        }]
                });
            });
            modal.insertCollection({
                searchBar: true,
                items: collection,
                onInserted: () => {
                    modal.selectAll('.edit-employee').forEach(el => el.addEventListener('click', (e) => {
                        let empl_id = e.target.closest('.collection-item').getAttribute('employee-id');
                        modal_staff_form.open(empl_id);
                        modal_staff_form.setTitle('Edit employee');
                        modal_staff_form.setFormValues(staff.filter(empl => empl['employee_id'] == empl_id)[0]);
                        modal_staff_form.setFooterButtons('<div class="btn-flat modal-close">Cancel</div><div id="update_employee" class="btn-flat white-text cyan">Update</div>');
                        modal_staff_form.select('#update_employee').addEventListener('click', (e) => {
                            let values = modal_staff_form.getFormValues();
                            if (values.requiredFieldMissing) {
                                M_Modal.presets.error('Required field(s) missing');
                            } else {
                                values.employee_id = empl_id;
                                staff[empl_id] = values;
                                modal_staff_form.close();
                                modal_staff_collection.onOpen(modal_staff_collection);
                            }
                        });
                    }));
                    modal.selectAll('.delete-employee').forEach(el => el.addEventListener('click', (e) => {
                        M_Modal.presets.confirm('Are you sure you want to delete this employee?', (conf) => {
                            if (conf) {
                                if (staff.length == 1) {
                                    staff = [];
                                } else {
                                    staff = staff.filter(empl => empl.employee_id != e.target.closest('.collection-item').getAttribute('employee-id'));
                                }
                                modal_staff_collection.onOpen(modal_staff_collection);
                            }
                        });
                    }));
                }
            });
        } else {
            modal.setContent('Add employees by clicking the button on the bottom right.');
        }
    }
});

document.querySelector('#new_employee').addEventListener('click', (e) => {
    modal_staff_form.open();
    modal_staff_form.setTitle('Add new employee');
    modal_staff_form.setFooterButtons('<div class="btn-flat modal-close">Cancel</div><div id="add_employee" class="btn-flat white-text cyan">Add</div>');
    modal_staff_form.select('#add_employee').addEventListener('click', (e) => {
        let values = modal_staff_form.getFormValues();
        if (values.requiredFieldMissing) {
            M_Modal.presets.error('Required field(s) missing');
        } else {
            values['employee_id'] = staff.length;
            staff.push(values);
            modal_staff_form.close();
            modal_staff_collection.onOpen(modal_staff_collection);
        }
    });
});
