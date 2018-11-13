# MaterializeModal
Work more efficiently with modals from the MaterializeCSS framework.

I've been working on a single-page application for our company in which I heavily used modals for all the functionality. I quickly realized that adding all those modals to the HTML file was kind of a mess and doing anything dynamic was a pain in the ass (forms, collections, ..).
That's why I've decided to write this small library. I just wanted to share this in case someone might find it helpful. Feel free to suggest any improvements that could be made.

## Installation
If you'd like to use this library, you'll need the latest version of [MaterializeCSS](https://materializecss.com/).
Then, simply include `materialize.modal.min.js` & `materialize.modal.min.css` in your HTML file. No initialization needed.
Also, no need to include JQuery.

## Example:
```javascript
let myFirstModal = new Modal({
  title: 'My First Modal !',
  openButton: '#open_myFirstModal',
  width: 70,
  height: 80,
  opacity: 0.7,
  dismissible: true,
  preventScrolling: false,
  inDuration: 150,
  outDuration: 75,
  onOpen: (modal) => {
    modal.setContent('Some content');
  }
});
```

## Options:
| Name | Type | Default value | Description |
| :------------ | :------------ | :------------ | :------------ |
| type | String | `modal-fixed-footer` | Type of the modal (fixed-footer, bottom-sheet, ..) |
| width | Integer | Default width of the MaterializeCSS library | width of the modal in % |
| height | Integer | Default height of the MaterializeCSS library | height of the modal in 'vh' |
| footerButtons | String | null | Buttons which will appear in the footer of the modal - Can contain HTML |
| openButton | String | null | HTML query string of the element that opens the modal |
| windowButtons | Boolean | true | Buttons on the top right of the modal (minimize, maximize, close) |
| fixedContent | String | null | Static content - Can contain HTML |
| opacity | Number | 0.5 | Opacity of the modal overlay |
| dismissible | Boolean | false | Allow modal to be dismissed by keyboard or overlay click |
| preventScrolling | Boolean | true | Prevent page from scrolling while modal is open |
| inDuration | Number | 250 | Transition in duration in milliseconds |
| outDuration | Number | 250 | Transition out duration in milliseconds |
| onOpen | Function | null | Executed each time the modal is opened. Gets two parameters: modal, data - the second argument can contain any kind of custom data which can be passed in through the open() method |
| onClose | Function | null | Executed each time the modal is closed. Gets the modal object as its argument |


## Methods:
#### open(data)
Opens the modal. If needed, custom data can be passed in to the `onOpen(modal, data)` function.
#### isOpen()
Returns a boolean value indicating if the modal is currently open.
#### close(callback)
Closes the modal. An optional callback function can be passed in that executes when the modal is closed (and gets the modal object as its parameter).
#### on(event, callback)
Binds an event (click, keypress, ...) to the modal. The callback gets the `event` data as its parameter.
#### setContent(content)
Removes all  dynamic content from the modal (the fixedContent from the options will not be affected) and sets the content passed in. The content must be a string.
#### addContent(content)
Adds content to the end of the modal. Content must be a string and may contain HTML.
#### removeContent(selector)
Removes content based on a HTML query selection. For example:
`modal.removeContent('.myNiceDiv')`
#### setTitle(title)
Sets the title of the modal. Argument must be a string and can contain HTML.
#### getTitle()
Returns the current title of the modal.
#### setFooterButtons(buttons)
Removes the current buttons and sets the buttons passed in (HTML string).
#### setAttribute(attribute, value)
Sets a custom HTML attribute.
#### getAttribute(attribute)
Returns the value of the specified attribute.
#### insertForm(options)
Inserts a form.
###### Options
| Name | Type | Default value | Description |
| :------------ | :------------ | :------------ | :------------ |
| width | Number | 100 | Width of the form in % |
| imageField | Boolean | false | Specify if an image field should be added to the form |
| fields | Array | null | Contains all form fields. Each field can be customized. See below for details. |
##### Form field options:
| Name | Type | Default value | Description |
| :------------ | :------------ | :------------ | :------------ |
| name | String | null | Required. Specifies the name of the field. Must be unique! |
| label | String | null | Required. Label of the form field. |
| width | Number| 100 | Optional. Width of the field in %. When setting this on 2 or more consecutive form fields and their combined value is 100 or less, these fields will be on one line. |
| type | string | null | Required. Specifies the field type. Available types are: `text_short`,`text_long`,`password`,`date`,`time`,`checkbox`,`custom`,`custom_multiple`|
| chips  | Array | null | Required when using form field type `custom` or `custom_multiple`. Structure example -> `[{tag: '1'}, {tag: '2'}, {tag: '3'}]` |
| required | Boolean | false | Indicate if the field has to be filled in. |
| append | String | null | HTML string to be appended to the form field |
| icon | String | null | Icon prefix to be used for the form field. Should be an icon string from the Material Icons package. |
| attributes | Array | null | Specify an array of custom attributes for the form field. For example: `[{key: 'customAttribute1', val: 'yolo'}, {key: 'customAttribute2', val: 'swag'}]` |
##### Example:
```javascript
modal.insertForm({
  width: 80,
  fields: [{
    name: 'firstname',
    label: 'First name',
    type: 'text_short',
    icon: 'account_circle',
    width: 50,
    required: true
    }, {
    name: 'lastname',
    label: 'Last name',
    type: 'text_short',
    icon: 'account_circle',
    width: 50,
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
```

#### setFormValues(values)
Sets the values for the form fields. The parameter must be an object.
Considering our previous example, it should look something like this:
```javascript
modal.setFormValues({
  firstname: 'Alex',
  lastname: 'Smith',
  position: [{tag: 'Sales'}],
  date_started: '2018-10-10' // depends on your Datepicker setup
});
```

In order for this to work, the property name must be equal to the name you gave the field in the 'insertForm' function.
Setting the value for type 'custom' or 'custom_multiple' requires an array with the selected element(s), the structure must be similar to the 'chips' array when creating the form field.
Setting the value for a 'checkbox' field requires a boolean value.
#### getFormValues(mode)
Returns the form values. An optional argument can be passed in to specify how the data should be structured:
`single` or `combined` - default is combined.
If there are required fields that are not filled in, this method returns this object: `{requiredFieldMissing: true}`
#### getFormFields()
Returns all HTML form fields.
#### getFormField(field)
Returns the specified HTML form field. Argument must be a string equal to the name of the field given in the `insertForm` function.
#### clearForm()
Clears the form.
#### hideFormField(fields)
Hides one or more form fields. Argument is an array of fields. Each element in the array must be a string equal to the name of the field given in the `insertForm` function.
#### formFieldChange(event, field, callback)
Adds an event listener to a form field (change, keyup, keypress, ..). The callback gets the `event` data.
#### displayImage(src)
Adds an image to the modal.
#### displayFormImage(src)
Adds the path of the image to the already existing image field.
#### hideFormImageDeleteButton()
Hides the delete button of the image field.
#### showFormImageDeleteButton()
Shows the delete button of the image field.
#### removeImage()
Removes the image.
#### getImage()
Returns a `FormData` object of the selected image.
#### addChipsField(chips)
Adds a chips field to the form - the argument is an array of chips equal to the structure of chips in a form field.
#### insertCollection(options)
Inserts a collection.
###### Options:
| Name | Type | Default value | Description |
|-|-|-|-|
| width | Number | 100 | Width of the collection in %. |
| searchBar | Boolean | false | Add a searchbar to the modal header to search through the collection. The search will be performed on the items' `label` text. |
| onInserted | Function | null | Optional callback that fires when the collection has been fully inserted. |
| items | Array | null | Required. Array of objects containing all collection items. Each item can be customized. See below for details. |
##### Collection item options
| Name | Type | Default value | Description |
|-|-|-|-|
| label | String | null | The label of the item |
| attributes | Object | null | Optional custom attributes can be added to the item. For example: `{customAttr1: 'yolo', customAttr2: 'swag'}` |
| secondaryContent | Array | null | Optional secondary content for the item. Each item has some properties. See below for details |
##### Secondary content options:
| Name | Type | Default value | Description |
|-|-|-|-|
| icon | String | null | Required. Specify a Material Icons icon string. |
| class | String | null | An optional class can be added to the item. |
| color | String | null | The color of the item can be changed by specifying a CSS color string. |
| tooltip | String | null | Specify tooltip text. |
##### Example:
Let's consider the example from the `insertForm()` method. We've added the data to some database and now we would like to display the members of the staff:
```javascript
// We've got the staff data from an API
let collection = [];
staff.forEach(empl => {
  collection.push({
    label: `${empl.firstname} ${empl.lastname}`,
    attributes: {employee-id: empl._id},
    secondaryContent: [
      {
      icon: 'edit',
      class: 'edit-employee',
      color: '#00bcd4'
      },
      {
      icon: 'delete',
      class: 'delete-employee',
      color: '#df0101'
      }
    ]
  });
});
modal.insertCollection({
  width: 90,
  searchBar: true,
  items: collection,
  onInserted: () => {
    // do something when the collection has been fully inserted
  }
});
```

#### getCollection()
Returns the HTML collection.
#### getCollectionItems()
Returns all HTML collection items.
#### minimize()
Minimize the modal programatically.
#### maximize()
Maximize the modal programatically.

## Global options
#### M_Modal.datePickerOptions
To customize the MaterializeCSS Datepicker, you can set options as described in their [documentation](https://materializecss.com/pickers.html).
`M_Modal.datePickerOptions = {options}`
Important: you need to add `container:'body'` to the options for the picker to show up (weird bug in MaterializeCSS).
#### M_Modal.timePickerOptions
To customize the MaterializeCSS Timepicker, you can set options as described in their [documentation](https://materializecss.com/pickers.html).
`M_Modal.timePickerOptions = {options}`
Important: you need to add `container:'body'` to the options for the picker to show up (weird bug in MaterializeCSS).
#### M_Modal.searchBarPlaceholderText
By default, the placeholder text of the searchbar in the header of the modal is `Search..`. This can be changed like this:
`M_Modal.searchBarPlaceholderText = 'Search..'`

## Helper
##### Submit form by pressing the Enter key
Adding the class 'modal-submit-form' to an element triggers its click event when pressing the Enter key.
