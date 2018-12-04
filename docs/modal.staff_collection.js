// create the modal
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
            // initialize an empty array that will hold all collection items
            let collection = [];
            // loop through the staff and populate the collection array
            staff.forEach(empl => {
                collection.push({
                    label: `${empl.firstname} ${empl.lastname}`,
                    attributes: {
                        // this is important since we need to have a reference of the ID in the HTML
                        // so that we can easily update/delete an employee
                        "employee-id": empl['employee_id']
                    },
                    // adding buttons on the right of the collection item
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
            // adding the collection
            modal.insertCollection({
                searchBar: true,
                items: collection,
                onInserted: () => {
                    // when the collection is fully inserted, set up a click event listener to edit the employee
                    modal.selectAll('.edit-employee').forEach(el => el.addEventListener('click', (e) => {
                        let empl_id = e.target.closest('.collection-item').getAttribute('employee-id'); // get the ID of the employee
                        modal_staff_form.open(); // open the form modal
                        modal_staff_form.setTitle('Edit employee'); // set the title
                        // set the form values based on the ID of the employee
                        // this is where you'd query your database
                        // for reasons of simplicity, I just made an array which holds all the data
                        modal_staff_form.setFormValues(staff.filter(empl => empl['employee_id'] == empl_id)[0]);
                        // set the footer buttons
                        modal_staff_form.setFooterButtons('<div class="btn-flat modal-close">Cancel</div><div id="update_employee" class="btn-flat white-text cyan">Update</div>');
                        // add a click event listener to be able to update the employee in the array
                        modal_staff_form.select('#update_employee').addEventListener('click', () => {
                            let values = modal_staff_form.getFormValues(); // the the form values
                            if (values.requiredFieldMissing) { // check if there are required fields that aren't filled in
                                M_Modal.presets.error('Required field(s) missing');
                            } else { // if not, update the data in the array
                                values.employee_id = empl_id;
                                staff[empl_id] = values;
                                modal_staff_form.close();
                                // this last line may look a little strange, but it's fairly simple
                                // all it does is to rerun the onOpen function so that the collection view gets updated
                                // this can be done in many different ways, but this is probably the simplest
                                // this may not be the most efficient, but it's OK for smaller collections
                                modal_staff_collection.onOpen(modal_staff_collection);
                                // if you want to optimize this, here's an example:
                                // you can select the item that's been updated by its 'employee-id' attribute and update the title
                                modal_staff_collection
                                    .getCollection() // get the collection DOM element
                                    .querySelector('[employee-id="' + empl_id + '"] .title') // select the title of the updated element
                                    .textContent = `${values.firstname} ${values.lastname}`; // and finally, update the text content
                            }
                        });
                    }));
                    // create a click event listener to delete the employee
                    modal.selectAll('.delete-employee').forEach(el => el.addEventListener('click', (e) => {
                        // display a confirm modal
                        M_Modal.presets.confirm('Are you sure you want to delete this employee?', (conf) => {
                            if (conf) {
                                if (staff.length == 1) {
                                    staff = [];
                                } else {
                                    // remove the entry from the array
                                    staff = staff.filter(empl => empl.employee_id != e.target.closest('.collection-item').getAttribute('employee-id'));
                                }
                                // update the collection view
                                modal_staff_collection.onOpen(modal_staff_collection);
                            }
                        });
                    }));
                }
            });
        } else { // if there are no items in the array, show some content
            modal.setContent('Add employees by clicking the button on the bottom right.');
        }
    }
});

// set up a click event listener to add employees
// this is pretty similar to the update
document.querySelector('#new_employee').addEventListener('click', () => {
    modal_staff_form.open(); // open the form modal
    modal_staff_form.setTitle('Add new employee'); // set the title
    // set the footer buttons
    modal_staff_form.setFooterButtons('<div class="btn-flat modal-close">Cancel</div><div id="add_employee" class="btn-flat white-text cyan">Add</div>');
    // add click event listener to add the employee to the array
    modal_staff_form.select('#add_employee').addEventListener('click', () => {
        let values = modal_staff_form.getFormValues(); // get the form values
        if (values.requiredFieldMissing) { // check if there are required fields that aren't filled in
            M_Modal.presets.error('Required field(s) missing');
        } else { // if not, add the data to the array
            values['employee_id'] = staff.length;
            staff.push(values);
            modal_staff_form.close();
            // update the collection view
            modal_staff_collection.onOpen(modal_staff_collection);
        }
    });
});
